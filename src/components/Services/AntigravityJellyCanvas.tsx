import React, { useEffect, useRef } from 'react';

interface Particle {
  bx: number;
  by: number;
  x: number;
  y: number;
  z: number;
  vx: number;
  vy: number;
  vz: number;
  dist: number;
  normDist: number;
  color: string;
  len: number;
  width: number;
  phase: number;
  noiseOffset: number;
}

export const AntigravityJellyCanvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const card = canvas.parentElement;
    if (!card) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let width = 0;
    let height = 0;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    const PARTICLE_BLUE = '#4D82F3'; // Vibrant Google Antigravity Blue
    let particles: Particle[] = [];
    let cx = 0;
    let cy = 0;
    let radius = 0;
    const minDistance = 25;

    function buildParticles() {
      particles = [];
      const isWide = width > 700;
      cx = isWide ? width * 0.72 : width * 0.52;
      cy = height * 0.5;
      radius = Math.min(isWide ? width * 0.38 : width * 0.44, height * 0.62, 205);

      const cellSize = minDistance / Math.SQRT2;
      const gridW = Math.ceil(width / cellSize);
      const gridH = Math.ceil(height / cellSize);
      const grid = new Int32Array(gridW * gridH).fill(-1);

      function isValid(x: number, y: number) {
        const dx = (x - cx) / (radius * 1.05);
        const dy = (y - cy) / (radius * 0.95);
        if (dx * dx + dy * dy > 1.0) return false;

        const cDist = Math.hypot(x - cx, y - cy);
        if (cDist < radius * 0.12) return false; // hollow airy eye

        const gx = Math.floor(x / cellSize);
        const gy = Math.floor(y / cellSize);
        const startX = Math.max(0, gx - 2);
        const endX = Math.min(gridW - 1, gx + 2);
        const startY = Math.max(0, gy - 2);
        const endY = Math.min(gridH - 1, gy + 2);

        for (let j = startY; j <= endY; j++) {
          for (let i = startX; i <= endX; i++) {
            const pIdx = grid[j * gridW + i];
            if (pIdx !== -1) {
              const pt = particles[pIdx];
              const distSq = (x - pt.bx) * (x - pt.bx) + (y - pt.by) * (y - pt.by);
              if (distSq < minDistance * minDistance) return false;
            }
          }
        }
        return true;
      }

      function addPoint(x: number, y: number) {
        const dist = Math.hypot(x - cx, y - cy);
        const pt: Particle = {
          bx: x,
          by: y,
          x: x,
          y: y,
          z: 0,
          vx: 0,
          vy: 0,
          vz: 0,
          dist: dist,
          normDist: dist / radius,
          color: PARTICLE_BLUE,
          len: 3.4 + Math.random() * 2.0,
          width: 1.25 + Math.random() * 0.35,
          phase: Math.random() * Math.PI * 2,
          noiseOffset: (Math.random() - 0.5) * 0.18
        };
        const idx = particles.length;
        particles.push(pt);
        const gx = Math.floor(x / cellSize);
        const gy = Math.floor(y / cellSize);
        grid[gy * gridW + gx] = idx;
      }

      const ringStep = minDistance * 1.15;
      for (let r = radius * 0.2; r <= radius; r += ringStep) {
        const count = Math.floor((2 * Math.PI * r) / (minDistance * 1.3));
        for (let i = 0; i < count; i++) {
          const angle = (i / count) * Math.PI * 2 + r * 0.45;
          const x = cx + Math.cos(angle) * r;
          const y = cy + Math.sin(angle) * r * 0.92;
          if (isValid(x, y)) {
            addPoint(x, y);
          }
        }
      }
    }

    function resize() {
      if (!card || !canvas || !ctx) return;
      const rect = card.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      buildParticles();
    }
    resize();
    window.addEventListener('resize', resize);

    let mouseX = -9999;
    let mouseY = -9999;
    let targetMouseX = -9999;
    let targetMouseY = -9999;
    let mouseActive = false;
    let mouseSpeed = 0;
    let lastMouseX = 0;
    let lastMouseY = 0;

    let ringX = cx;
    let ringY = cy;
    let targetRingX = cx;
    let targetRingY = cy;

    const onMouseMove = (e: MouseEvent) => {
      const rect = card.getBoundingClientRect();
      targetMouseX = e.clientX - rect.left;
      targetMouseY = e.clientY - rect.top;
      mouseActive = true;
      const dist = Math.hypot(targetMouseX - lastMouseX, targetMouseY - lastMouseY);
      mouseSpeed = Math.min(dist * 0.4, 25);
      lastMouseX = targetMouseX;
      lastMouseY = targetMouseY;
    };

    const onMouseLeave = () => {
      mouseActive = false;
      targetMouseX = -9999;
      targetMouseY = -9999;
    };

    card.addEventListener('mousemove', onMouseMove);
    card.addEventListener('mouseleave', onMouseLeave);

    let time = 0;

    let isVisible = true;
    function animate() {
      if (!isVisible) return;
      animId = requestAnimationFrame(animate);
      if (!ctx) return;
      time += 0.018;

      ctx.clearRect(0, 0, width, height);

      if (mouseActive) {
        mouseX += (targetMouseX - mouseX) * 0.14;
        mouseY += (targetMouseY - mouseY) * 0.14;
        targetRingX = mouseX;
        targetRingY = mouseY;
      } else {
        mouseX = -9999;
        mouseY = -9999;
        mouseSpeed *= 0.88;
        targetRingX = cx + Math.sin(time * 0.8) * 14;
        targetRingY = cy + Math.cos(time * 0.6) * 10;
      }

      ringX += (targetRingX - ringX) * 0.07;
      ringY += (targetRingY - ringY) * 0.07;

      const springK = 0.052;
      const damping = 0.88;

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        const waveX = Math.sin(time * 2.2 + p.phase) * 2.8;
        const waveY = Math.cos(time * 1.8 + p.phase * 1.3) * 2.5;
        const targetX = p.bx + waveX;
        const targetY = p.by + waveY;

        if (mouseActive) {
          const dx = p.x - mouseX;
          const dy = p.y - mouseY;
          const dist = Math.hypot(dx, dy);
          const radiusEffect = 150;

          if (dist < radiusEffect && dist > 0.001) {
            const f = Math.pow(1 - dist / radiusEffect, 1.8) * (14 + mouseSpeed * 0.35);
            p.vx += (dx / dist) * f;
            p.vy += (dy / dist) * f;
            p.vz -= f * 0.65;
          }
        }

        p.vx = (p.vx + (targetX - p.x) * springK) * damping;
        p.vy = (p.vy + (targetY - p.y) * springK) * damping;
        p.vz = (p.vz + (0 - p.z) * springK) * damping;

        p.x += p.vx;
        p.y += p.vy;
        p.z += p.vz;

        const angle =
          Math.atan2(p.y - ringY, p.x - ringX) +
          p.noiseOffset +
          Math.sin(time * 1.5 + p.phase) * 0.08;

        const distToRing = Math.hypot(p.x - ringX, p.y - ringY);
        const ringInfluence = Math.max(0, 1 - distToRing / 180);

        const pulseWave = Math.sin(time * 1.8 + p.phase + p.dist * 0.015);
        const rawFactor = (pulseWave + 1) * 0.5;
        const morphFactor = Math.pow(rawFactor, 1.4);

        const velSpeed = Math.hypot(p.vx, p.vy);
        const stretchImpulse = Math.min(velSpeed * 0.35, 1.0);

        const maxLen = p.len * (0.85 + ringInfluence * 0.35);
        const curLen = maxLen * Math.min(1.0, morphFactor + stretchImpulse);
        const curWidth = p.width * (1.15 - 0.25 * (curLen / (maxLen + 0.001)));

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(angle);

        ctx.beginPath();
        ctx.strokeStyle = PARTICLE_BLUE;
        ctx.fillStyle = PARTICLE_BLUE;
        ctx.globalAlpha = Math.min(1.0, 0.85 + ringInfluence * 0.15);

        if (ringInfluence > 0.25) {
          ctx.shadowColor = PARTICLE_BLUE;
          ctx.shadowBlur = 5 * ringInfluence;
        }

        if (curLen < 0.35) {
          ctx.arc(0, 0, curWidth * 0.55, 0, Math.PI * 2);
          ctx.fill();
        } else {
          ctx.lineCap = 'round';
          ctx.lineWidth = curWidth;
          ctx.moveTo(-curLen * 0.5, 0);
          ctx.lineTo(curLen * 0.5, 0);
          ctx.stroke();
        }

        ctx.restore();
      }
    }

    const observer = new IntersectionObserver(([entry]) => {
      const nextVisible = entry.isIntersecting;
      if (nextVisible && !isVisible) {
        isVisible = true;
        animId = requestAnimationFrame(animate);
      } else if (!nextVisible) {
        isVisible = false;
        cancelAnimationFrame(animId);
      }
    }, { threshold: 0.02 });

    observer.observe(canvas);
    animate();

    return () => {
      observer.disconnect();
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
      card.removeEventListener('mousemove', onMouseMove);
      card.removeEventListener('mouseleave', onMouseLeave);
    };
  }, []);

  return <canvas ref={canvasRef} className="antigravity-jelly-canvas" id="jelly-canvas-01" />;
};

