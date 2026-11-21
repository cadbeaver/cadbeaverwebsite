import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

export const HeroCanvas3D: React.FC = () => {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        let renderer: THREE.WebGLRenderer;
        let scene: THREE.Scene;
        let camera: THREE.PerspectiveCamera;
        let orbitGroup: THREE.Group;
        let ring1: THREE.Mesh;
        let ring2: THREE.Mesh;
        let ring3: THREE.Mesh;
        let cubes: { mesh: THREE.Mesh; orbitRadius: number; speed: number; angle: number; rotSpeed: { x: number; y: number } }[] = [];
        let animId: number;
        let isVisible = true;
        const clock = new THREE.Clock();

        try {
            scene = new THREE.Scene();
            camera = new THREE.PerspectiveCamera(45, (canvas.clientWidth || 300) / (canvas.clientHeight || 300), 0.1, 1000);

            renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
            renderer.setSize(canvas.clientWidth || 300, canvas.clientHeight || 300);
            renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));

            const ambientLight = new THREE.AmbientLight(0xffffff, 1.8);
            scene.add(ambientLight);

            const dirLight1 = new THREE.DirectionalLight(0xffffff, 2.2);
            dirLight1.position.set(6, 8, 7);
            scene.add(dirLight1);

            const dirLight2 = new THREE.DirectionalLight(0xE2E8F0, 1.4);
            dirLight2.position.set(-6, -4, 5);
            scene.add(dirLight2);

            orbitGroup = new THREE.Group();
            orbitGroup.rotation.x = 0.52;
            orbitGroup.rotation.y = -0.38;
            orbitGroup.rotation.z = 0.18;
            scene.add(orbitGroup);
        } catch (err) {
            console.warn('HeroCanvas3D WebGL init failed gracefully:', err);
            return;
        }

        const updateCameraDistance = () => {
            if (!canvas || canvas.clientHeight === 0) return;
            const aspect = canvas.clientWidth / canvas.clientHeight;
            camera.aspect = aspect;
            camera.position.set(0, 0, 11.6);
            camera.updateProjectionMatrix();

            // On mobile, scale orbit smaller than the cards area so it fits every mobile screen perfectly
            if (aspect < 1.0 || window.innerWidth <= 968) {
                orbitGroup.scale.set(0.46, 0.46, 0.46);
                orbitGroup.position.set(0.0, -0.15, 0);
            } else {
                orbitGroup.scale.set(1.0, 1.0, 1.0);
                orbitGroup.position.set(0.0, 0.0, 0);
            }
            renderer.setSize(canvas.clientWidth, canvas.clientHeight);
        };
        updateCameraDistance();

        const chromeMat = new THREE.MeshStandardMaterial({
            color: 0xCBD5E1,
            metalness: 0.94,
            roughness: 0.14
        });

        const darkTitaniumMat = new THREE.MeshStandardMaterial({
            color: 0x334155,
            metalness: 0.88,
            roughness: 0.22
        });

        const thinLineMat = new THREE.LineBasicMaterial({
            color: 0x94A3B8,
            transparent: true,
            opacity: 0.42
        });

        function createOrbitRing(radius: number, tubeRadius: number, mat: THREE.Material) {
            const geom = new THREE.TorusGeometry(radius, tubeRadius, 20, 120);
            const mesh = new THREE.Mesh(geom, mat);
            return mesh;
        }

        ring1 = createOrbitRing(2.6, 0.016, chromeMat);
        ring2 = createOrbitRing(3.7, 0.020, darkTitaniumMat);
        ring3 = createOrbitRing(4.65, 0.014, chromeMat);

        orbitGroup.add(ring1);
        orbitGroup.add(ring2);
        orbitGroup.add(ring3);

        const trackPoints: THREE.Vector3[] = [];
        for (let i = 0; i <= 64; i++) {
            const theta = (i / 64) * Math.PI * 2;
            trackPoints.push(new THREE.Vector3(Math.cos(theta) * 3.1, Math.sin(theta) * 3.1, 0));
        }
        const trackGeom = new THREE.BufferGeometry().setFromPoints(trackPoints);
        const trackLine = new THREE.Line(trackGeom, thinLineMat);
        orbitGroup.add(trackLine);

        cubes = [];
        const cubeGeom = new THREE.BoxGeometry(0.18, 0.18, 0.18);

        const nodeConfigs = [
            { r: 2.6, speed: 0.45, mat: chromeMat, angle: 0.2 },
            { r: 2.6, speed: -0.42, mat: darkTitaniumMat, angle: 3.4 },
            { r: 3.7, speed: 0.32, mat: chromeMat, angle: 1.8 },
            { r: 3.7, speed: -0.38, mat: darkTitaniumMat, angle: 4.8 },
            { r: 4.65, speed: 0.25, mat: chromeMat, angle: 2.5 },
            { r: 4.65, speed: -0.28, mat: darkTitaniumMat, angle: 5.6 }
        ];

        nodeConfigs.forEach(cfg => {
            const mesh = new THREE.Mesh(cubeGeom, cfg.mat);
            orbitGroup.add(mesh);
            cubes.push({
                mesh,
                orbitRadius: cfg.r,
                speed: cfg.speed * 0.016,
                angle: cfg.angle,
                rotSpeed: { x: 0.012, y: 0.018 }
            });
        });

        let targetMouseX = 0, targetMouseY = 0;
        let curMouseX = 0, curMouseY = 0;

        const onMouseMove = (e: MouseEvent) => {
            if (window.scrollY > 450) {
                targetMouseX = 0;
                targetMouseY = 0;
                return;
            }
            const rect = canvas.getBoundingClientRect();
            if (!rect.width || !rect.height) return;
            const normX = (e.clientX - rect.left) / rect.width - 0.5;
            const normY = (e.clientY - rect.top) / rect.height - 0.5;
            const clampedX = Math.max(-0.6, Math.min(0.6, normX));
            const clampedY = Math.max(-0.5, Math.min(0.5, normY));
            targetMouseX = clampedX * 1.5;
            targetMouseY = -clampedY * 1.5;
        };

        const onTouchMove = (e: TouchEvent) => {
            if (window.scrollY > 450) {
                targetMouseX = 0;
                targetMouseY = 0;
                return;
            }
            if (e.touches && e.touches[0]) {
                const rect = canvas.getBoundingClientRect();
                if (!rect.width || !rect.height) return;
                const normX = (e.touches[0].clientX - rect.left) / rect.width - 0.5;
                const normY = (e.touches[0].clientY - rect.top) / rect.height - 0.5;
                const clampedX = Math.max(-0.35, Math.min(0.35, normX));
                const clampedY = Math.max(-0.25, Math.min(0.25, normY));
                targetMouseX = clampedX * 0.8;
                targetMouseY = -clampedY * 0.8;
            }
        };

        const onTouchEnd = () => {
            targetMouseX = 0;
            targetMouseY = 0;
        };

        const onScroll = () => {
            if (window.scrollY > 400) {
                targetMouseX = 0;
                targetMouseY = 0;
            }
        };

        window.addEventListener('mousemove', onMouseMove);
        window.addEventListener('touchmove', onTouchMove, { passive: true });
        window.addEventListener('touchend', onTouchEnd, { passive: true });
        window.addEventListener('scroll', onScroll, { passive: true });

        const animate = () => {
            if (!isVisible) return;
            animId = requestAnimationFrame(animate);
            const delta = clock.getDelta();

            curMouseX += (targetMouseX - curMouseX) * 0.05;
            curMouseY += (targetMouseY - curMouseY) * 0.05;

            // Clamped orbit tilt: base x is 0.50 rad (~28.6deg), tilt variance strictly capped to ±0.06 rad (±3.4deg)
            const tiltX = Math.max(-0.06, Math.min(0.06, -curMouseY * 0.06));
            const tiltY = Math.max(-0.08, Math.min(0.08, curMouseX * 0.08));

            orbitGroup.rotation.y = -0.38 + tiltY;
            orbitGroup.rotation.x = 0.50 + tiltX;

            ring1.rotation.z += 0.12 * delta;
            ring2.rotation.z -= 0.08 * delta;
            ring3.rotation.z += 0.06 * delta;

            cubes.forEach(c => {
                c.angle += c.speed;
                c.mesh.position.x = Math.cos(c.angle) * c.orbitRadius;
                c.mesh.position.y = Math.sin(c.angle) * c.orbitRadius;
                c.mesh.position.z = Math.sin(c.angle * 2) * 0.22;

                c.mesh.rotation.x += c.rotSpeed.x;
                c.mesh.rotation.y += c.rotSpeed.y;
            });

            renderer.render(scene, camera);
        };

        const observer = new IntersectionObserver(([entry]) => {
            const nextVisible = entry.isIntersecting;
            if (nextVisible && !isVisible) {
                isVisible = true;
                clock.getDelta();
                animId = requestAnimationFrame(animate);
            } else if (!nextVisible) {
                isVisible = false;
                cancelAnimationFrame(animId);
            }
        }, { threshold: 0.02 });

        observer.observe(canvas);
        animate();

        window.addEventListener('resize', updateCameraDistance);

        return () => {
            if (observer) observer.disconnect();
            if (animId) cancelAnimationFrame(animId);
            window.removeEventListener('mousemove', onMouseMove);
            window.removeEventListener('touchmove', onTouchMove);
            window.removeEventListener('touchend', onTouchEnd);
            window.removeEventListener('scroll', onScroll);
            window.removeEventListener('resize', updateCameraDistance);
            if (renderer) renderer.dispose();
        };
    }, []);

    return <canvas id="three-canvas" ref={canvasRef}></canvas>;
};

