import React, { useEffect, useRef, useState } from 'react';
import { ProjectData } from '../../types';

interface SimulationHUDProps {
  project: ProjectData;
}

export const SimulationHUD: React.FC<SimulationHUDProps> = ({ project }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [speed, setSpeed] = useState(1.0);
  const isPlayingRef = useRef(true);
  const speedRef = useRef(1.0);
  const simTimeRef = useRef(0);

  // Keep refs in sync with state for animation loop
  useEffect(() => {
    isPlayingRef.current = isPlaying;
  }, [isPlaying]);

  useEffect(() => {
    speedRef.current = speed;
  }, [speed]);

  const togglePlayback = () => {
    setIsPlaying((prev) => !prev);
  };

  const toggleSpeed = () => {
    const speeds = [1.0, 1.5, 2.0, 0.5];
    const idx = speeds.indexOf(speed);
    const nextSpeed = speeds[(idx + 1) % speeds.length];
    setSpeed(nextSpeed);
  };

  const resetView = () => {
    simTimeRef.current = 0;
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    function runSimulation() {
      if (!canvas || !ctx) return;

      const w = canvas.clientWidth;
      const h = canvas.clientHeight;

      if (canvas.width !== Math.floor(w * dpr) || canvas.height !== Math.floor(h * dpr)) {
        canvas.width = Math.floor(w * dpr);
        canvas.height = Math.floor(h * dpr);
      }

      ctx.save();
      ctx.scale(dpr, dpr);
      ctx.clearRect(0, 0, w, h);

      if (isPlayingRef.current) {
        simTimeRef.current += 0.016 * speedRef.current;
      }
      const simTime = simTimeRef.current;
      const cx = w * 0.5;
      const cy = h * 0.5;

      const simType = project.simType;

      if (simType === 'gear-mesh') {
        const r1 = 65,
          r2 = 90;
        const d1 = cx - 75,
          d2 = cx + 80;
        const a1 = simTime * 1.8;
        const a2 = -a1 * (r1 / r2) + 0.12;

        function drawGear(
          gx: number,
          gy: number,
          rad: number,
          teeth: number,
          angle: number,
          color: string,
          isDrive: boolean
        ) {
          if (!ctx) return;
          ctx.save();
          ctx.translate(gx, gy);
          ctx.rotate(angle);

          // Pitch circle (dashed)
          ctx.beginPath();
          ctx.arc(0, 0, rad, 0, Math.PI * 2);
          ctx.strokeStyle = 'rgba(77, 130, 243, 0.45)';
          ctx.setLineDash([4, 4]);
          ctx.lineWidth = 1.2;
          ctx.stroke();
          ctx.setLineDash([]);

          // Gear teeth
          ctx.beginPath();
          for (let i = 0; i < teeth; i++) {
            const th = (i / teeth) * Math.PI * 2;
            const thStep = (Math.PI * 2) / teeth;
            const ro = rad + 12;
            const ri = rad - 12;
            const t0 = th - thStep * 0.25;
            const t1 = th - thStep * 0.12;
            const t2 = th + thStep * 0.12;
            const t3 = th + thStep * 0.25;

            const x0 = Math.cos(t0) * ri,
              y0 = Math.sin(t0) * ri;
            const x1 = Math.cos(t1) * ro,
              y1 = Math.sin(t1) * ro;
            const x2 = Math.cos(t2) * ro,
              y2 = Math.sin(t2) * ro;
            const x3 = Math.cos(t3) * ri,
              y3 = Math.sin(t3) * ri;

            if (i === 0) ctx.moveTo(x0, y0);
            else ctx.lineTo(x0, y0);
            ctx.lineTo(x1, y1);
            ctx.lineTo(x2, y2);
            ctx.lineTo(x3, y3);
          }
          ctx.closePath();
          ctx.fillStyle = 'rgba(30, 41, 59, 0.85)';
          ctx.fill();
          ctx.strokeStyle = color;
          ctx.lineWidth = 1.5;
          ctx.stroke();

          // Keyed Shaft Hub
          ctx.beginPath();
          ctx.arc(0, 0, 20, 0, Math.PI * 2);
          ctx.fillStyle = '#0F172A';
          ctx.fill();
          ctx.strokeStyle = '#94A3B8';
          ctx.lineWidth = 1.4;
          ctx.stroke();

          // Keyway
          ctx.fillStyle = '#64748B';
          ctx.fillRect(-3, -20, 6, 8);

          // Rotating Torque Vector
          if (isDrive) {
            ctx.beginPath();
            ctx.arc(0, 0, rad * 0.55, -0.6, 1.2);
            ctx.strokeStyle = '#4D82F3';
            ctx.lineWidth = 2.4;
            ctx.stroke();
          }

          ctx.restore();
        }

        drawGear(d1, cy, r1, 14, a1, '#E2E8F0', true);
        drawGear(d2, cy, r2, 20, a2, '#94A3B8', false);

        // Mesh Point Crosshair
        const mx = (d1 * r2 + d2 * r1) / (r1 + r2);
        ctx.beginPath();
        ctx.arc(mx, cy, 5, 0, Math.PI * 2);
        ctx.strokeStyle = '#10B981';
        ctx.lineWidth = 1.5;
        ctx.stroke();

        ctx.font = '600 11px "JetBrains Mono", monospace';
        ctx.fillStyle = '#94A3B8';
        ctx.fillText('MESH FREQUENCY: 331.3 Hz', 24, h - 24);
        ctx.fillStyle = '#4D82F3';
        ctx.fillText('DRIVE: 1,420 RPM [ACTIVE]', 24, h - 42);
      } else if (simType === 'conveyor-flow') {
        const troughW = w * 0.78;
        const troughH = 110;
        const tx = (w - troughW) * 0.5;
        const ty = cy - troughH * 0.5;

        ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
        ctx.lineWidth = 1.5;
        ctx.strokeRect(tx, ty, troughW, troughH);

        ctx.fillStyle = '#1E293B';
        ctx.fillRect(tx, cy - 8, troughW, 16);
        ctx.strokeStyle = '#64748B';
        ctx.lineWidth = 1.2;
        ctx.strokeRect(tx, cy - 8, troughW, 16);

        const pitches = 8;
        const pitchW = troughW / pitches;
        const flightH = 44;
        const screwPhase = (simTime * 2.8) % 1;

        ctx.lineWidth = 2.2;
        for (let i = -1; i <= pitches; i++) {
          const fx = tx + (i + screwPhase) * pitchW;
          if (fx < tx - 10 || fx > tx + troughW + 10) continue;

          ctx.beginPath();
          ctx.moveTo(fx, cy - flightH);
          ctx.bezierCurveTo(
            fx + pitchW * 0.5,
            cy - flightH * 0.2,
            fx + pitchW * 0.5,
            cy + flightH * 0.2,
            fx + pitchW,
            cy + flightH
          );
          ctx.strokeStyle = '#E2E8F0';
          ctx.stroke();

          ctx.beginPath();
          ctx.moveTo(fx, cy - flightH);
          ctx.bezierCurveTo(
            fx - pitchW * 0.3,
            cy - flightH * 0.2,
            fx - pitchW * 0.3,
            cy + flightH * 0.2,
            fx + pitchW,
            cy + flightH
          );
          ctx.strokeStyle = 'rgba(100, 116, 139, 0.45)';
          ctx.stroke();
        }

        const pCount = 38;
        for (let p = 0; p < pCount; p++) {
          const pProgress = (simTime * 0.45 + p / pCount) % 1.0;
          const px = tx + 10 + pProgress * (troughW - 20);
          const py = cy + 12 + Math.sin(p * 9 + simTime * 2) * 26;
          const pr = 2.0 + (p % 3) * 0.8;

          ctx.beginPath();
          ctx.arc(px, py, pr, 0, Math.PI * 2);
          ctx.fillStyle = p % 4 === 0 ? '#4D82F3' : 'rgba(226, 232, 240, 0.75)';
          ctx.fill();
        }

        ctx.strokeStyle = '#10B981';
        ctx.fillStyle = '#10B981';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(tx + 24, ty - 26);
        ctx.lineTo(tx + 24, ty - 6);
        ctx.stroke();

        ctx.font = '600 11px "JetBrains Mono", monospace';
        ctx.fillStyle = '#10B981';
        ctx.fillText('FEED INLET: 45.0 TPH', tx + 34, ty - 12);
        ctx.fillStyle = '#94A3B8';
        ctx.fillText('TROUGH FILL FRACTION: 38% [OPTIMAL]', tx, ty + troughH + 24);
      } else if (simType === 'spm-gantry') {
        const railY = cy - 80;
        const railW = w * 0.74;
        const rx = (w - railW) * 0.5;

        ctx.fillStyle = '#1E293B';
        ctx.fillRect(rx, railY, railW, 16);
        ctx.strokeStyle = '#475569';
        ctx.lineWidth = 1.5;
        ctx.strokeRect(rx, railY, railW, 16);

        const travelRange = railW * 0.65;
        const cycle = Math.sin(simTime * 1.8);
        const carX = cx + cycle * (travelRange * 0.5);
        const carW = 60,
          carH = 34;

        ctx.fillStyle = '#0F172A';
        ctx.fillRect(carX - carW * 0.5, railY - 8, carW, carH);
        ctx.strokeStyle = '#E2E8F0';
        ctx.lineWidth = 1.6;
        ctx.strokeRect(carX - carW * 0.5, railY - 8, carW, carH);

        const drop = Math.max(0, Math.sin(simTime * 3.6)) * 65;
        const cylY = railY + carH;
        ctx.fillStyle = '#94A3B8';
        ctx.fillRect(carX - 6, cylY, 12, 45 + drop);

        const gripY = cylY + 45 + drop;
        ctx.fillStyle = '#1E293B';
        ctx.fillRect(carX - 22, gripY, 44, 12);

        ctx.fillStyle = '#4D82F3';
        ctx.fillRect(carX - 14, gripY + 12, 28, 20);
        ctx.strokeStyle = '#E2E8F0';
        ctx.lineWidth = 1;
        ctx.strokeRect(carX - 14, gripY + 12, 28, 20);

        ctx.beginPath();
        ctx.moveTo(carX, gripY + 32);
        ctx.lineTo(carX, cy + 90);
        ctx.strokeStyle = 'rgba(16, 185, 129, 0.45)';
        ctx.lineWidth = 1.2;
        ctx.setLineDash([3, 3]);
        ctx.stroke();
        ctx.setLineDash([]);

        ctx.fillStyle = 'rgba(255, 255, 255, 0.08)';
        ctx.fillRect(rx, cy + 90, railW, 10);

        ctx.font = '600 11px "JetBrains Mono", monospace';
        ctx.fillStyle = '#E2E8F0';
        ctx.fillText(
          `AXIS POSITION: X ${(carX - cx).toFixed(1)} mm | Z ${drop.toFixed(1)} mm`,
          rx,
          cy + 124
        );
        ctx.fillStyle = '#10B981';
        ctx.fillText('CYCLE OEE: 99.4% [SYNCHRONIZED]', rx, cy + 140);
      } else if (simType === 'shaft-stress') {
        const shaftW = w * 0.74;
        const sx = (w - shaftW) * 0.5;

        const d1W = shaftW * 0.32,
          d1H = 50;
        const d2W = shaftW * 0.36,
          d2H = 80;
        const d3W = shaftW * 0.32,
          d3H = 55;

        const step1X = sx + d1W;
        const step2X = step1X + d2W;

        ctx.fillStyle = '#1E293B';
        ctx.fillRect(sx, cy - d1H * 0.5, d1W, d1H);
        ctx.strokeStyle = '#64748B';
        ctx.strokeRect(sx, cy - d1H * 0.5, d1W, d1H);

        const stressGrad = ctx.createLinearGradient(step1X, cy, step2X, cy);
        const pulse = (Math.sin(simTime * 3) + 1) * 0.5;
        stressGrad.addColorStop(0, `rgba(245, 158, 11, ${0.4 + pulse * 0.5})`);
        stressGrad.addColorStop(0.18, '#1E293B');
        stressGrad.addColorStop(0.82, '#1E293B');
        stressGrad.addColorStop(1, `rgba(245, 158, 11, ${0.4 + pulse * 0.5})`);

        ctx.fillStyle = stressGrad;
        ctx.fillRect(step1X, cy - d2H * 0.5, d2W, d2H);
        ctx.strokeStyle = '#94A3B8';
        ctx.strokeRect(step1X, cy - d2H * 0.5, d2W, d2H);

        ctx.fillStyle = '#1E293B';
        ctx.fillRect(step2X, cy - d3H * 0.5, d3W, d3H);
        ctx.strokeStyle = '#64748B';
        ctx.strokeRect(step2X, cy - d3H * 0.5, d3W, d3H);

        ctx.beginPath();
        ctx.arc(step1X, cy - d1H * 0.5, 9, 0, Math.PI * 2);
        ctx.arc(step1X, cy + d1H * 0.5, 9, 0, Math.PI * 2);
        ctx.arc(step2X, cy - d3H * 0.5, 9, 0, Math.PI * 2);
        ctx.arc(step2X, cy + d3H * 0.5, 9, 0, Math.PI * 2);
        ctx.strokeStyle = '#F59E0B';
        ctx.lineWidth = 1.8;
        ctx.stroke();

        const twPhase = (simTime * 2.5) % Math.PI;
        ctx.beginPath();
        ctx.arc(sx + 30, cy, 32, -0.6 + twPhase * 0.3, 0.8 + twPhase * 0.3);
        ctx.strokeStyle = '#4D82F3';
        ctx.lineWidth = 2.4;
        ctx.stroke();

        ctx.font = '600 11px "JetBrains Mono", monospace';
        const curMpa = (118 + pulse * 20).toFixed(1);
        ctx.fillStyle = '#F59E0B';
        ctx.fillText(`VON MISES PEAK: ${curMpa} MPa [SAFE // LIMIT 285 MPa]`, sx, cy + 90);
        ctx.fillStyle = '#94A3B8';
        ctx.fillText('ELLIPTIC FILLET CONVERGENCE: Kt = 1.15', sx, cy + 108);
      } else if (simType === 'telemetry-wave') {
        const waveW = w * 0.82;
        const wx = (w - waveW) * 0.5;

        ctx.beginPath();
        for (let i = 0; i < waveW; i += 4) {
          const xVal = wx + i;
          const yVal = cy - 35 + Math.sin(i * 0.024 + simTime * 3.5) * 28 + Math.cos(i * 0.06) * 7;
          if (i === 0) ctx.moveTo(xVal, yVal);
          else ctx.lineTo(xVal, yVal);
        }
        ctx.strokeStyle = '#4D82F3';
        ctx.lineWidth = 2.2;
        ctx.stroke();

        ctx.beginPath();
        for (let i = 0; i < waveW; i += 3) {
          const xVal = wx + i;
          const yVal = cy + 42 + Math.sin(i * 0.08 + simTime * 5.2) * 16 + Math.sin(i * 1.4) * 4;
          if (i === 0) ctx.moveTo(xVal, yVal);
          else ctx.lineTo(xVal, yVal);
        }
        ctx.strokeStyle = '#10B981';
        ctx.lineWidth = 1.8;
        ctx.stroke();

        const packetW = 60;
        for (let pk = 0; pk < 5; pk++) {
          const pkX = wx + (((simTime * 110 + pk * 150) % (waveW + 60)) - 60);
          if (pkX >= wx && pkX + packetW <= wx + waveW) {
            ctx.fillStyle = 'rgba(255, 255, 255, 0.06)';
            ctx.fillRect(pkX, cy - 8, packetW, 16);
            ctx.strokeStyle = '#94A3B8';
            ctx.strokeRect(pkX, cy - 8, packetW, 16);
            ctx.font = '600 9px "JetBrains Mono", monospace';
            ctx.fillStyle = '#CBD5E1';
            ctx.fillText(`0x${(120 + pk * 17).toString(16).toUpperCase()}`, pkX + 12, cy + 4);
          }
        }

        ctx.font = '600 11px "JetBrains Mono", monospace';
        ctx.fillStyle = '#4D82F3';
        ctx.fillText('CH1: LOAD SPECTRUM // 14.8A NOMINAL', wx, cy - 78);
        ctx.fillStyle = '#10B981';
        ctx.fillText('CH2: VIBRATION ACCEL // 0.12 g RMS', wx, cy + 86);
      } else if (simType === 'vision-laser') {
        const beltW = w * 0.78;
        const bx = (w - beltW) * 0.5;
        const beltY = cy + 45;

        ctx.fillStyle = 'rgba(255, 255, 255, 0.05)';
        ctx.fillRect(bx, beltY, beltW, 14);
        ctx.strokeStyle = '#475569';
        ctx.strokeRect(bx, beltY, beltW, 14);

        const wpX = cx - 40;
        const wpY = cy - 40;
        const wpW = 80,
          wpH = 70;

        ctx.fillStyle = '#1E293B';
        ctx.fillRect(wpX, wpY, wpW, wpH);
        ctx.strokeStyle = '#94A3B8';
        ctx.lineWidth = 1.4;
        ctx.strokeRect(wpX, wpY, wpW, wpH);

        ctx.beginPath();
        ctx.arc(cx, cy - 5, 20, 0, Math.PI * 2);
        ctx.fillStyle = '#0F172A';
        ctx.fill();
        ctx.strokeStyle = '#CBD5E1';
        ctx.stroke();

        const laserX = bx + 20 + ((Math.sin(simTime * 2.8) + 1) * 0.5) * (beltW - 40);

        ctx.beginPath();
        ctx.moveTo(laserX, cy - 110);
        ctx.lineTo(laserX, beltY);
        ctx.strokeStyle = '#10B981';
        ctx.lineWidth = 2.4;
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(laserX, cy - 110);
        ctx.lineTo(laserX, beltY);
        ctx.strokeStyle = 'rgba(16, 185, 129, 0.25)';
        ctx.lineWidth = 8;
        ctx.stroke();

        const isOver = Math.abs(laserX - cx) < 65;
        const bbColor = isOver ? '#10B981' : '#4D82F3';

        ctx.strokeStyle = bbColor;
        ctx.lineWidth = 1.8;

        ctx.beginPath();
        ctx.moveTo(wpX - 12, wpY - 4);
        ctx.lineTo(wpX - 12, wpY - 12);
        ctx.lineTo(wpX - 4, wpY - 12);

        ctx.moveTo(wpX + wpW + 4, wpY - 12);
        ctx.lineTo(wpX + wpW + 12, wpY - 12);
        ctx.lineTo(wpX + wpW + 12, wpY - 4);

        ctx.moveTo(wpX - 12, wpY + wpH + 4);
        ctx.lineTo(wpX - 12, wpY + wpH + 12);
        ctx.lineTo(wpX - 4, wpY + wpH + 12);

        ctx.moveTo(wpX + wpW + 4, wpY + wpH + 12);
        ctx.lineTo(wpX + wpW + 12, wpY + wpH + 12);
        ctx.lineTo(wpX + wpW + 12, wpY + wpH + 4);
        ctx.stroke();

        ctx.font = '600 11px "JetBrains Mono", monospace';
        ctx.fillStyle = bbColor;
        ctx.fillText('[AI] BORE: Ø40.008mm [PASS 99.85%]', wpX - 12, wpY - 18);
        ctx.fillStyle = '#E2E8F0';
        ctx.fillText('INSPECTION SPEED: 120 PARTS/MIN // 12ms INFERENCE', bx, cy + 90);
      }

      ctx.restore();

      animId = requestAnimationFrame(runSimulation);
    }

    animId = requestAnimationFrame(runSimulation);

    return () => {
      cancelAnimationFrame(animId);
    };
  }, [project.simType]);

  return (
    <div className="pm-sim-card">
      <div className="pm-sim-hud-top">
        <div className="pm-hud-feed">
          <span className="pm-hud-tag">4K SIMULATION</span>
          <span className="pm-hud-fps" id="pm-hud-fps">
            60 FPS // KINEMATIC SOLVER
          </span>
        </div>
        <div className="pm-hud-telemetry" id="pm-hud-telemetry">
          <span>SPEED: {project.telemetry.speed}</span>
          <span className="pm-hud-sep">|</span>
          <span>{project.telemetry.torque}</span>
          <span className="pm-hud-sep">|</span>
          <span>{project.telemetry.tolerance}</span>
        </div>
      </div>

      <div className="pm-canvas-viewport">
        <canvas ref={canvasRef} id="projectSimCanvas" />
        <div className="pm-viewport-grid" />
        <div className="pm-crosshair ch-top-left" />
        <div className="pm-crosshair ch-top-right" />
        <div className="pm-crosshair ch-bottom-left" />
        <div className="pm-crosshair ch-bottom-right" />
        <div className="pm-center-reticle" />
      </div>

      <div className="pm-sim-hud-bottom">
        <div className="pm-sim-controls">
          <button className="pm-sim-btn" id="pmSimPlayBtn" onClick={togglePlayback}>
            {isPlaying ? (
              <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
                <rect x="6" y="4" width="4" height="16" />
                <rect x="14" y="4" width="4" height="16" />
              </svg>
            ) : (
              <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
                <polygon points="5 3 19 12 5 21 5 3" />
              </svg>
            )}
            <span id="pmPlayLabel">{isPlaying ? 'PAUSE' : 'PLAY'}</span>
          </button>
          <button className="pm-sim-btn" onClick={toggleSpeed}>
            <span>
              SPEED: <strong id="pmSpeedVal">{speed.toFixed(1)}x</strong>
            </span>
          </button>
          <button className="pm-sim-btn" onClick={resetView}>
            <svg
              width="13"
              height="13"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
            >
              <polyline points="1 4 1 10 7 10" />
              <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10" />
            </svg>
            <span>RE-CENTER</span>
          </button>
        </div>
        <div className="pm-sim-status-chip">
          <span className="pm-chip-dot" />
          <span id="pmSimStateText">{project.telemetry.status}</span>
        </div>
      </div>
    </div>
  );
};

