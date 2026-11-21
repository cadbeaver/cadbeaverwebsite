import React, { useEffect, useRef } from 'react';

export const LiquidGlassCards: React.FC = () => {
    const stageRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        const stage = stageRef.current;
        if (!stage) return;

        let mouseX = 0, mouseY = 0;
        let curX = 0, curY = 0;

        const onMouseMove = (e: MouseEvent) => {
            // Guard: When scrolled past hero, reset to upright neutral
            if (window.scrollY > 450) {
                mouseX = 0;
                mouseY = 0;
                return;
            }
            const rect = stage.getBoundingClientRect();
            if (!rect.width || !rect.height) return;
            const normX = (e.clientX - rect.left) / rect.width - 0.5;
            const normY = (e.clientY - rect.top) / rect.height - 0.5;
            // Strict clamp to prevent off-screen or out-of-bounds coordinates from blowing up
            const clampedX = Math.max(-0.6, Math.min(0.6, normX));
            const clampedY = Math.max(-0.5, Math.min(0.5, normY));
            mouseX = clampedX * 10;
            mouseY = clampedY * 10;
        };

        const onTouchMove = (e: TouchEvent) => {
            if (window.scrollY > 450) {
                mouseX = 0;
                mouseY = 0;
                return;
            }
            if (e.touches && e.touches[0]) {
                const rect = stage.getBoundingClientRect();
                if (!rect.width || !rect.height) return;
                const normX = (e.touches[0].clientX - rect.left) / rect.width - 0.5;
                const normY = (e.touches[0].clientY - rect.top) / rect.height - 0.5;
                const clampedX = Math.max(-0.35, Math.min(0.35, normX));
                const clampedY = Math.max(-0.25, Math.min(0.25, normY));
                mouseX = clampedX * 6;
                mouseY = clampedY * 6;
            }
        };

        const onTouchEnd = () => {
            mouseX = 0;
            mouseY = 0;
        };

        const onScroll = () => {
            if (window.scrollY > 400) {
                mouseX = 0;
                mouseY = 0;
            }
        };

        window.addEventListener('mousemove', onMouseMove);
        window.addEventListener('touchmove', onTouchMove, { passive: true });
        window.addEventListener('touchend', onTouchEnd, { passive: true });
        window.addEventListener('scroll', onScroll, { passive: true });

        let animId: number;
        let isVisible = true;
        const loop = () => {
            if (!isVisible) return;
            animId = requestAnimationFrame(loop);
            curX += (mouseX - curX) * 0.08;
            curY += (mouseY - curY) * 0.08;

            // Strict angular clamping: pitch (rotateX) capped between -5deg and +5deg (never flattens!)
            // yaw (rotateY) capped between -7deg and +7deg
            const rotY = Math.max(-7, Math.min(7, curX * 0.5));
            const rotX = Math.max(-5, Math.min(5, -curY * 0.5));
            const isMobile = window.innerWidth <= 968;
            const baseScale = isMobile ? 'scale(0.88) translateY(14px) ' : '';

            stage.style.transform = `${baseScale}rotateY(${rotY}deg) rotateX(${rotX}deg)`;
        };

        const observer = new IntersectionObserver(([entry]) => {
            const nextVisible = entry.isIntersecting;
            if (nextVisible && !isVisible) {
                isVisible = true;
                animId = requestAnimationFrame(loop);
            } else if (!nextVisible) {
                isVisible = false;
                cancelAnimationFrame(animId);
            }
        }, { threshold: 0.02 });

        observer.observe(stage);
        loop();

        return () => {
            observer.disconnect();
            cancelAnimationFrame(animId);
            window.removeEventListener('mousemove', onMouseMove);
            window.removeEventListener('touchmove', onTouchMove);
            window.removeEventListener('touchend', onTouchEnd);
            window.removeEventListener('scroll', onScroll);
        };
    }, []);

    return (
        <div className="hero-cards-stage" id="hero-cards-stage" ref={stageRef}>
            {/* 1. FEA / CFD SIMULATION (Aurora Frosted Glass + Squircle Button) */}
            <div className="hero-orbit-card card-mech">
                <div className="card-img-wrap">
                    <img src="./cards/card_mech.webp" alt="FEA / CFD Simulation" className="card-png-img" decoding="async" fetchPriority="high" />
                    <div className="card-overlay-info overlay-style-aurora">
                        <div className="card-title">FEA / CFD Simulation</div>
                        <div className="card-sub">Peak Stress 248 MPa</div>
                    </div>
                </div>
            </div>

            {/* 2. CONVEYOR SYSTEMS (Light Archives + Inner Document Sheet + 000 Badge) */}
            <div className="hero-orbit-card card-software">
                <div className="card-img-wrap">
                    <img src="./cards/card_software.webp" alt="Conveyor Systems" className="card-png-img" decoding="async" fetchPriority="high" />
                    <ul className="card-sheet-bullets">
                        <li><span className="sheet-bullet-dot"></span>Screw Conveyor</li>
                        <li><span className="sheet-bullet-dot"></span>Belt Conveyor</li>
                        <li><span className="sheet-bullet-dot"></span>Pusher Feeder</li>
                        <li><span className="sheet-bullet-dot"></span>Screw Feeder</li>
                        <li><span className="sheet-bullet-dot"></span>Rotary Air Lock</li>
                    </ul>
                    <div className="card-overlay-info overlay-style-archives">
                        <div className="card-title">Conveyor Systems</div>
                        <div className="card-sub">Bulk Drive | SPM</div>
                    </div>
                </div>
            </div>

            {/* 3. LASER CUT & DXF (Scarlet Magma + Smoked Dark Glass) */}
            <div className="hero-orbit-card card-laser">
                <div className="card-img-wrap">
                    <img src="./cards/card_laser.webp" alt="Laser Cut & DXF" className="card-png-img" decoding="async" />
                    <div className="card-overlay-info overlay-style-dark">
                        <div className="card-title">Laser Cut &amp; DXF</div>
                        <div className="card-sub">1:1 Flat Pattern</div>
                    </div>
                </div>
            </div>

            {/* 4. AI AUTOMATION (Cosmic Royal Blue / Purple Magma) */}
            <div className="hero-orbit-card card-ai">
                <div className="card-img-wrap">
                    <img src="./cards/card_ai.webp" alt="AI Automation" className="card-png-img" decoding="async" />
                    <div className="card-overlay-info overlay-style-dark">
                        <div className="card-title">AI Automation</div>
                        <div className="card-sub">Neural Vision | 24/7</div>
                    </div>
                </div>
            </div>

            {/* 5. CUSTOM SOFTWARE (Golden Bronze Magma) */}
            <div className="hero-orbit-card card-conveyor">
                <div className="card-img-wrap">
                    <img src="./cards/card_conveyor.webp" alt="Custom Software" className="card-png-img" decoding="async" />
                    <div className="card-overlay-info overlay-style-dark">
                        <div className="card-title">Custom Software</div>
                        <div className="card-sub">Cloud | API Core</div>
                    </div>
                </div>
            </div>

            {/* 6. MECHANICAL DESIGN (Dark Archives + Inner Sheet + 000 Badge) */}
            <div className="hero-orbit-card card-sim">
                <div className="card-img-wrap">
                    <img src="./cards/card_sim.webp" alt="Mechanical Design" className="card-png-img" decoding="async" />
                    <ul className="card-sheet-bullets card-sheet-bullets-grey">
                        <li><span className="sheet-bullet-dot"></span>Machine &amp; SPM Design</li>
                        <li><span className="sheet-bullet-dot"></span>Fabrication Drawings</li>
                        <li><span className="sheet-bullet-dot"></span>Reverse Engineering</li>
                        <li><span className="sheet-bullet-dot"></span>3D CAD Modeling</li>
                    </ul>
                    <div className="card-overlay-info overlay-style-dark">
                        <div className="card-title">Mechanical Design</div>
                        <div className="card-sub">GD&amp;T | DFM Prints</div>
                    </div>
                </div>
            </div>

            {/* 7. CNC / VMC PROGRAMMING (Emerald Mint Magma) */}
            <div className="hero-orbit-card card-cnc">
                <div className="card-img-wrap">
                    <img src="./cards/card_cnc.webp" alt="CNC / VMC Programming" className="card-png-img" decoding="async" />
                    <div className="card-overlay-info overlay-style-dark">
                        <div className="card-title">CNC / VMC Programming</div>
                        <div className="card-sub">5-Axis Toolpaths</div>
                    </div>
                </div>
            </div>
        </div>
    );
};
