// 1. THREE.JS 3D ORBITAL SYSTEM WITH FLOATING METALLIC NODES
        const canvas = document.getElementById('three-canvas');
        const cardsStage = document.getElementById('hero-cards-stage');
        const scene = new THREE.Scene();

        const camera = new THREE.PerspectiveCamera(45, canvas.clientWidth / canvas.clientHeight, 0.1, 1000);

        const isMobileScreen = window.innerWidth <= 968 || /Mobi|Android|iPhone/i.test(navigator.userAgent);
        const renderer = new THREE.WebGLRenderer({
            canvas: canvas,
            alpha: true,
            antialias: !isMobileScreen,
            powerPreference: 'high-performance'
        });
        renderer.setSize(canvas.clientWidth, canvas.clientHeight);
        renderer.setPixelRatio(isMobileScreen ? 1.0 : Math.min(window.devicePixelRatio, 2));

        // High-end ambient & studio lighting
        const ambientLight = new THREE.AmbientLight(0xffffff, 1.8);
        scene.add(ambientLight);

        const dirLight1 = new THREE.DirectionalLight(0xffffff, 2.2);
        dirLight1.position.set(6, 8, 7);
        scene.add(dirLight1);

        const dirLight2 = new THREE.DirectionalLight(0xE2E8F0, 1.4);
        dirLight2.position.set(-6, -4, 5);
        scene.add(dirLight2);

        // Group holding the tilted 3D orbital rings & cubes - perfectly centered
        const orbitGroup = new THREE.Group();
        orbitGroup.position.set(0.0, 0.0, 0);
        orbitGroup.rotation.x = 0.52;
        orbitGroup.rotation.z = -0.25;
        scene.add(orbitGroup);

        function updateCameraDistance() {
            const parent = canvas.parentElement;
            if (!parent || parent.clientHeight === 0) return;
            const aspect = parent.clientWidth / parent.clientHeight;
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
            renderer.setSize(parent.clientWidth, parent.clientHeight);
        }
        updateCameraDistance();

        // Video Playback Optimization - pause videos when off-screen to save mobile GPU/decoder
        const allVideos = document.querySelectorAll('video');
        if ('IntersectionObserver' in window && allVideos.length > 0) {
            const vidObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.play().catch(() => {});
                    } else {
                        entry.target.pause();
                    }
                });
            }, { threshold: 0.15 });
            allVideos.forEach(v => vidObserver.observe(v));
        }

        // Function to create smooth 3D elliptical wireframe orbit rings
        function createOrbitRing(radiusX, radiusY, colorHex, opacity, isDashed) {
            const curve = new THREE.EllipseCurve(
                0, 0,
                radiusX, radiusY,
                0, 2 * Math.PI,
                false,
                0
            );
            const points = curve.getPoints(120);
            const geometry = new THREE.BufferGeometry().setFromPoints(points);

            let mat;
            if (isDashed) {
                mat = new THREE.LineDashedMaterial({
                    color: colorHex,
                    opacity: opacity,
                    transparent: true,
                    dashSize: 0.18,
                    gapSize: 0.12,
                    linewidth: 1
                });
            } else {
                mat = new THREE.LineBasicMaterial({
                    color: colorHex,
                    opacity: opacity,
                    transparent: true,
                    linewidth: 1.2
                });
            }
            const line = new THREE.Line(geometry, mat);
            if (isDashed) line.computeLineDistances();
            return line;
        }

        // Concentric orbital paths - Scaled with generous clearance so cubes never clip on left/right edges
        const ringOuter = createOrbitRing(4.60, 2.34, 0x94A3B8, 0.45, false);
        const ringMid = createOrbitRing(3.70, 1.88, 0xCBD5E1, 0.65, false);
        const ringInner = createOrbitRing(2.80, 1.42, 0x94A3B8, 0.35, true);
        const ringCore = createOrbitRing(1.85, 0.94, 0xE2E8F0, 0.40, false);

        orbitGroup.add(ringOuter);
        orbitGroup.add(ringMid);
        orbitGroup.add(ringInner);
        orbitGroup.add(ringCore);

        // Floating Dark Metallic 3D Cubes positioned along the orbits
        const cubeMaterial = new THREE.MeshPhysicalMaterial({
            color: 0x1E293B,
            metalness: 0.82,
            roughness: 0.22,
            clearcoat: 1.0,
            clearcoatRoughness: 0.1
        });
        const edgeMaterial = new THREE.LineBasicMaterial({ color: 0x64748B });

        const orbitCubes = [];
        const cubeData = [
            { rx: 4.60, ry: 2.34, angle: 0.58, size: 0.23, speed: 0.0006 },
            { rx: 4.60, ry: 2.34, angle: 3.25, size: 0.21, speed: 0.0005 },
            { rx: 3.70, ry: 1.88, angle: 0.06, size: 0.22, speed: 0.0007 },
            { rx: 3.70, ry: 1.88, angle: 2.15, size: 0.19, speed: 0.0006 },
            { rx: 2.80, ry: 1.42, angle: 4.60, size: 0.20, speed: 0.0008 }
        ];

        cubeData.forEach(d => {
            const geo = new THREE.BoxGeometry(d.size, d.size, d.size);
            const mesh = new THREE.Mesh(geo, cubeMaterial);
            const edges = new THREE.EdgesGeometry(geo);
            const line = new THREE.LineSegments(edges, edgeMaterial);
            mesh.add(line);

            mesh.position.set(
                Math.cos(d.angle) * d.rx,
                Math.sin(d.angle) * d.ry,
                0
            );
            mesh.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, 0);
            orbitGroup.add(mesh);
            orbitCubes.push({ mesh, data: d });
        });

        // Small spherical nodal anchors along orbits
        const nodeGeo = new THREE.SphereGeometry(0.045, 12, 12);
        const nodeMat = new THREE.MeshBasicMaterial({ color: 0x475569 });
        const nodeAngles = [0.92, 1.85, 2.75, 3.85, 5.05];
        nodeAngles.forEach(ang => {
            const node = new THREE.Mesh(nodeGeo, nodeMat);
            node.position.set(Math.cos(ang) * 3.70, Math.sin(ang) * 1.88, 0);
            orbitGroup.add(node);
        });

        // Vertical coordinate reference line behind top-right card (Matching photo)
        const vLineGeo = new THREE.BufferGeometry().setFromPoints([
            new THREE.Vector3(2.6, 0.4, 0),
            new THREE.Vector3(2.6, 3.2, 0)
        ]);
        const vLineMat = new THREE.LineBasicMaterial({
            color: 0x94A3B8,
            transparent: true,
            opacity: 0.35,
            linewidth: 1
        });
        const vLine = new THREE.Line(vLineGeo, vLineMat);
        orbitGroup.add(vLine);

        const vCrossNode = new THREE.Mesh(new THREE.SphereGeometry(0.04, 12, 12), new THREE.MeshBasicMaterial({ color: 0x64748B }));
        vCrossNode.position.set(2.6, 2.8, 0);
        orbitGroup.add(vCrossNode);

        // Mouse & scroll inertia state
        let mouseX = 0;
        let mouseY = 0;
        let targetX = 0;
        let targetY = 0;
        let scrollY = 0;
        let targetScrollY = 0;

        window.addEventListener('mousemove', (e) => {
            if (window.scrollY > 450) {
                mouseX = 0;
                mouseY = 0;
                return;
            }
            const rawX = (e.clientX / window.innerWidth) - 0.5;
            const rawY = (e.clientY / window.innerHeight) - 0.5;
            mouseX = Math.max(-0.6, Math.min(0.6, rawX));
            mouseY = Math.max(-0.5, Math.min(0.5, rawY));
        });

        window.addEventListener('touchmove', (e) => {
            // Keep native mobile vertical touch scrolling 100% unimpeded
        }, { passive: true });

        window.addEventListener('touchend', () => {
            mouseX = 0;
            mouseY = 0;
        }, { passive: true });

        let isScrolling = false;
        let scrollTimer = null;
        if (isMobileScreen) {
            window.addEventListener('scroll', () => {
                isScrolling = true;
                if (scrollTimer) clearTimeout(scrollTimer);
                scrollTimer = setTimeout(() => {
                    isScrolling = false;
                }, 70);
            }, { passive: true });
        }

        window.addEventListener('scroll', () => {
            targetScrollY = window.scrollY;
            if (window.scrollY > 400) {
                mouseX = 0;
                mouseY = 0;
            }
        }, { passive: true });

        window.addEventListener('resize', updateCameraDistance);

        let isHeroVisible = true;
        let heroAnimId = null;
        function animate() {
            if (!isHeroVisible) return;
            heroAnimId = requestAnimationFrame(animate);

            // While thumb is actively scrolling on mobile, pause WebGL render to dedicate 100% GPU to 120fps kinetic scroll
            if (isMobileScreen && isScrolling) {
                return;
            }

            // Smooth mouse & scroll inertia
            targetX += (mouseX - targetX) * 0.055;
            targetY += (mouseY - targetY) * 0.055;
            scrollY += (targetScrollY - scrollY) * 0.07;

            // Slowly orbit cubes and rotate on their local axes
            for (let i = 0; i < orbitCubes.length; i++) {
                const c = orbitCubes[i];
                c.data.angle += c.data.speed;
                c.mesh.position.x = Math.cos(c.data.angle) * c.data.rx;
                c.mesh.position.y = Math.sin(c.data.angle) * c.data.ry;
                c.mesh.rotation.x += 0.007;
                c.mesh.rotation.y += 0.011;
            }

            // Sync 3D WebGL orbit tilt with mouse - strictly clamped so it never flattens out
            const orbitDeltaZ = Math.max(-0.06, Math.min(0.06, targetX * 0.08));
            const orbitDeltaX = Math.max(-0.06, Math.min(0.06, targetY * 0.08));
            orbitGroup.rotation.z = -0.25 + orbitDeltaZ;
            orbitGroup.rotation.x = 0.52 + orbitDeltaX;

            // Sync CSS 3D cards stage tilt smoothly with mouse on desktop
            // On mobile, keep locked in optimal 3D perspective to prevent per-frame DOM reflows
            if (cardsStage) {
                const isMobile = window.innerWidth <= 968;
                if (isMobile) {
                    if (!cardsStage.dataset.mobileFixed) {
                        cardsStage.style.transform = 'perspective(1400px) scale(0.88) translateY(14px)';
                        cardsStage.dataset.mobileFixed = 'true';
                    }
                } else {
                    const rotX = Math.max(-5, Math.min(5, targetY * -7));
                    const rotY = Math.max(-7, Math.min(7, targetX * 9));
                    cardsStage.style.transform = `perspective(1400px) rotateX(${rotX}deg) rotateY(${rotY}deg)`;
                }
            }

            renderer.render(scene, camera);
        }

        const heroObserver = new IntersectionObserver(([entry]) => {
            const next = entry.isIntersecting;
            if (next && !isHeroVisible) {
                isHeroVisible = true;
                heroAnimId = requestAnimationFrame(animate);
            } else if (!next) {
                isHeroVisible = false;
                if (heroAnimId) cancelAnimationFrame(heroAnimId);
            }
        }, { threshold: 0.02 });
        if (canvas) heroObserver.observe(canvas);
        animate();

        // 3. INTERACTIVE VIDEO SHOWCASE LOGIC (CUSTOM SOFTWARE & MECHANICAL DESIGN)
        const showcaseData = {
            software: {
                ai: {
                    desc: "With advanced Generative AI and neural vision models, we help businesses automate mission-critical tasks, improve workflows, and make better decisions—faster.",
                    target: "vision-scanner",
                    status: "Production Verified"
                },
                telemetry: {
                    desc: "High-frequency machine telemetry dashboards with sub-10ms cycle tracking, MQTT / WebSocket data streaming, and comprehensive shopfloor analytics for live plant monitoring.",
                    target: "telemetry-dashboard",
                    status: "Sub-10ms Real-Time"
                },
                erp: {
                    desc: "Custom industrial ERP engines, automated inventory pipelines, and enterprise REST/GraphQL APIs connecting hardware shopfloor sensors directly to business management systems.",
                    target: "telemetry-dashboard",
                    status: "Enterprise Scalable"
                }
            },
            mechanical: {
                spm: {
                    desc: "From conceptual 3D kinematics to manufacturing-ready assemblies, we engineer robust Special Purpose Machines (SPM), dynamic torque systems, and high-precision automation mechanisms built for heavy-duty industrial cycles.",
                    target: "spm-machine",
                    status: "Turnkey Commissioned"
                },
                fea: {
                    desc: "Comprehensive finite element analysis, non-linear stress distribution, dynamic load verification, and thermal dissipation studies ensuring zero field failure under cyclic industrial loading.",
                    target: "rotary-drive",
                    status: "248.6 MPa Peak Verified"
                },
                dxf: {
                    desc: "Production-ready 2D fabrication drawings, ISO 2768-m GD&T prints, sheet metal flat pattern unfolding, and 1:1 DXF profiles optimized for CNC laser cutting and precision bending.",
                    target: "torque-shaft",
                    status: "ISO 2768-m Tolerancing"
                }
            }
        };

        function switchShowcaseTab(category, tabKey) {
            const card = document.getElementById(`showcase-${category}`);
            if (!card) return;

            // Update active tab buttons
            const tabs = card.querySelectorAll('.showcase-tab');
            tabs.forEach(tab => {
                if (tab.getAttribute('data-tab') === tabKey) {
                    tab.classList.add('active');
                } else {
                    tab.classList.remove('active');
                }
            });

            // Update description text with subtle smooth transition
            const descEl = document.getElementById(`${category}-showcase-desc`);
            const statusEl = document.getElementById(`${category}-status-text`);
            const learnBtn = document.getElementById(`${category}-learn-btn`);
            const info = showcaseData[category] && showcaseData[category][tabKey];

            if (descEl && info) {
                descEl.style.opacity = '0';
                descEl.style.transform = 'translateY(4px)';
                setTimeout(() => {
                    descEl.textContent = info.desc;
                    descEl.style.opacity = '1';
                    descEl.style.transform = 'translateY(0)';
                }, 160);
            }

            if (statusEl && info) {
                statusEl.textContent = info.status;
            }

            if (learnBtn && info) {
                learnBtn.setAttribute('onclick', `openProjectDetail('${info.target}')`);
            }
        }

        function togglePlayPause(videoId, btn) {
            const video = document.getElementById(videoId);
            if (!video) return;
            const pauseIcon = btn.querySelector('.icon-pause');
            const playIcon = btn.querySelector('.icon-play');
            if (video.paused) {
                video.play();
                if (pauseIcon) pauseIcon.style.display = 'block';
                if (playIcon) playIcon.style.display = 'none';
            } else {
                video.pause();
                if (pauseIcon) pauseIcon.style.display = 'none';
                if (playIcon) playIcon.style.display = 'block';
            }
        }

        function toggleMute(videoId, btn) {
            const video = document.getElementById(videoId);
            if (!video) return;
            video.muted = !video.muted;
            const mutedIcon = btn.querySelector('.icon-muted');
            const soundIcon = btn.querySelector('.icon-sound');
            if (video.muted) {
                if (mutedIcon) mutedIcon.style.display = 'block';
                if (soundIcon) soundIcon.style.display = 'none';
            } else {
                if (mutedIcon) mutedIcon.style.display = 'none';
                if (soundIcon) soundIcon.style.display = 'block';
            }
        }

        function toggleFullscreen(videoId) {
            const video = document.getElementById(videoId);
            if (!video) return;
            if (video.requestFullscreen) {
                video.requestFullscreen();
            } else if (video.webkitRequestFullscreen) {
                video.webkitRequestFullscreen();
            } else if (video.msRequestFullscreen) {
                video.msRequestFullscreen();
            }
        }

        // Auto-play videos when they enter viewport
        const caseVideos = document.querySelectorAll('.case-video-element');
        if ('IntersectionObserver' in window) {
            const videoObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.play().catch(() => { });
                    }
                });
            }, { threshold: 0.25 });
            caseVideos.forEach(v => videoObserver.observe(v));
        }

        // CASE STUDIES HORIZONTAL SLIDER CONTROLS (Slide Right / Left)
        function goToCaseSlide(index) {
            const track = document.getElementById('case-slider-track');
            if (!track) return;
            const cards = track.querySelectorAll('.case-showcase-card');
            if (cards[index] && cards[0]) {
                const targetLeft = cards[index].offsetLeft - cards[0].offsetLeft;
                track.scrollTo({ left: targetLeft, behavior: 'smooth' });
                updateCaseSliderDots(index);
            }
        }

        function nextCaseSlide() {
            const track = document.getElementById('case-slider-track');
            if (!track) return;
            const cards = track.querySelectorAll('.case-showcase-card');
            if (cards.length < 2) return;
            const step = (cards[1].offsetLeft - cards[0].offsetLeft) || track.clientWidth;
            const currentIndex = Math.round(track.scrollLeft / step);
            const nextIndex = (currentIndex + 1) % cards.length;
            goToCaseSlide(nextIndex);
        }

        function prevCaseSlide() {
            const track = document.getElementById('case-slider-track');
            if (!track) return;
            const cards = track.querySelectorAll('.case-showcase-card');
            if (cards.length < 2) return;
            const step = (cards[1].offsetLeft - cards[0].offsetLeft) || track.clientWidth;
            const currentIndex = Math.round(track.scrollLeft / step);
            const prevIndex = (currentIndex - 1 + cards.length) % cards.length;
            goToCaseSlide(prevIndex);
        }

        function updateCaseSliderDots(activeIdx) {
            const dots = document.querySelectorAll('.case-slider-dots .case-dot');
            dots.forEach((dot, idx) => {
                dot.classList.toggle('active', idx === activeIdx);
            });
        }

        document.addEventListener('DOMContentLoaded', () => {
            const caseTrack = document.getElementById('case-slider-track');
            if (caseTrack) {
                caseTrack.addEventListener('scroll', () => {
                    const cards = caseTrack.querySelectorAll('.case-showcase-card');
                    if (cards.length > 1) {
                        const step = (cards[1].offsetLeft - cards[0].offsetLeft) || caseTrack.clientWidth || 1;
                        const idx = Math.min(cards.length - 1, Math.max(0, Math.round(caseTrack.scrollLeft / step)));
                        updateCaseSliderDots(idx);
                    }
                }, { passive: true });
            }
        });

        // Backward compatibility slider handler
        const slider = document.getElementById('cases-slider');
        if (slider) {
            let isDown = false;
            let startX;
            let scrollLeft;
            let isSliderDragging = false;
            let sliderStartX = 0;

            slider.addEventListener('mousedown', (e) => {
                isDown = true;
                isSliderDragging = false;
                sliderStartX = e.pageX;
                slider.style.cursor = 'grabbing';
                startX = e.pageX - slider.offsetLeft;
                scrollLeft = slider.scrollLeft;
            });
            slider.addEventListener('mouseleave', () => {
                isDown = false;
                slider.style.cursor = 'grab';
            });
            slider.addEventListener('mouseup', () => {
                isDown = false;
                slider.style.cursor = 'grab';
                setTimeout(() => { isSliderDragging = false; }, 80);
            });
            slider.addEventListener('mousemove', (e) => {
                if (!isDown) return;
                e.preventDefault();
                const x = e.pageX - slider.offsetLeft;
                if (Math.abs(e.pageX - sliderStartX) > 8) {
                    isSliderDragging = true;
                }
                const walk = (x - startX) * 1.8;
                slider.scrollLeft = scrollLeft - walk;
            });
        }

        // 4. MODAL & QUOTE INQUIRY FUNCTIONS
        const modal = document.getElementById('contactModal');

        function openContactModal() {
            modal.classList.add('active');
            document.body.style.overflow = 'hidden';
        }

        function closeContactModal() {
            modal.classList.remove('active');
            document.body.style.overflow = '';
        }

        modal.addEventListener('click', (e) => {
            if (e.target === modal) closeContactModal();
        });

        function handleQuoteSubmit(e) {
            e.preventDefault();
            const name = document.getElementById('custName').value;
            const contact = document.getElementById('custContact').value;
            const service = document.getElementById('custService').value;
            const msg = document.getElementById('custMsg').value;

            const subject = encodeURIComponent(`Engineering Inquiry: ${service} - ${name}`);
            const body = encodeURIComponent(
                `Hi Cadbeaver Team,\n\n` +
                `New consultation/quote request:\n` +
                `• Name/Company: ${name}\n` +
                `• Contact Info: ${contact}\n` +
                `• Selected Service: ${service}\n\n` +
                `Details / Scope:\n${msg}\n\n` +
                `Regards,\n${name}`
            );

            window.location.href = `mailto:cadbeaverofficial@gmail.com?subject=${subject}&body=${body}`;
            closeContactModal();
        }

        // 5. SMOOTH 3D SCROLL REVEAL FOR CARDS & SECTIONS
        const isMobileScreenDevice = window.innerWidth <= 968 || /Mobi|Android|iPhone/i.test(navigator.userAgent);
        const revealSelector = isMobileScreenDevice
            ? '.project-card, .section-header, .contact-banner'
            : '.service-card, .project-card, .section-header, .contact-banner';
        const revealElements = document.querySelectorAll(revealSelector);
        revealElements.forEach((el, index) => {
            el.classList.add('scroll-3d-reveal');
            el.style.transitionDelay = `${(index % 3) * 0.08}s`;
        });

        const revealObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -40px 0px'
        });

        revealElements.forEach(el => revealObserver.observe(el));

        // 6. LIQUID MAGNETIC AUTO-SLIDER FOR STAT CARD (98.4% -> 100% -> DFM)
        const statSlides = [
            { label: 'Manufacturing Efficiency', value: '98.4%' },
            { label: 'Ready for Production', value: '100%' },
            { label: 'Zero Error Flow', value: 'DFM' }
        ];
        let currentStatIdx = 0;
        const statCard = document.querySelector('.revenue-card-float');
        const statLabel = document.getElementById('dynamic-stat-label');
        const statVal = document.getElementById('dynamic-stat');
        const statDots = document.querySelectorAll('.stepper-dots .step-dot');

        if (statCard && statVal && statLabel) {
            setInterval(() => {
                statCard.classList.add('slide-out');

                setTimeout(() => {
                    currentStatIdx = (currentStatIdx + 1) % statSlides.length;
                    const next = statSlides[currentStatIdx];

                    statLabel.textContent = next.label;
                    statVal.innerHTML = `${next.value} <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="display:inline-block; vertical-align:middle; margin-left: 4px;"><line x1="7" y1="17" x2="17" y2="7"></line><polyline points="7 7 17 7 17 17"></polyline></svg>`;

                    statDots.forEach((dot, idx) => {
                        dot.classList.toggle('active', idx === currentStatIdx);
                    });

                    statCard.classList.remove('slide-out');
                    statCard.classList.add('slide-in-prep');

                    void statCard.offsetWidth;

                    statCard.classList.remove('slide-in-prep');
                }, 320);
            }, 2800);
        }

        // 7. MOBILE HORIZONTAL CAROUSEL (NATIVE HIGH-PERFORMANCE TOUCH SCROLL)
        // Handled directly by GPU-accelerated CSS scroll-snap & touch momentum for authentic Apple smoothness.
        function initMobileSwipeCards() {
            // Native momentum scroll active across all mobile viewports
        }
        initMobileSwipeCards();

        // ---------------- GOOGLE ANTIGRAVITY MORPHING JELLY PARTICLE SPHERE ----------------
        // Authentic Google Antigravity Architecture:
        // - Poisson-disk blue noise spacing (guaranteed >=25px between particles, zero clumping)
        // - Tiny micro-capsules (3.4px - 5.4px length, 1.25px - 1.6px width with round line caps)
        // - Radial orientation vector atan2(y - ringY, x - ringX) towards/away from ring focus
        // - Elastic jelly spring-damper physics with fluid organic ripple
        function initAntigravityJellyCanvas() {
            const card = document.getElementById('service-card-01');
            const canvas = document.getElementById('jelly-canvas-01');
            if (!card || !canvas) return;

            const ctx = canvas.getContext('2d');
            let width = 0, height = 0;
            const isMobileDevice = window.innerWidth <= 968;
            const dpr = isMobileDevice ? 1.0 : Math.min(window.devicePixelRatio || 1, 2);

            // Single uniform Google Blue color for all particles
            const PARTICLE_BLUE = '#4D82F3'; // Vibrant Google Antigravity Blue

            let particles = [];
            let cx = 0, cy = 0, radius = 0;
            const minDistance = isMobileDevice ? 30 : 25; // Strict spacing: particles never stick or crowd

            function buildParticles() {
                particles = [];
                const isWide = width > 700;
                cx = isWide ? width * 0.72 : width * 0.52;
                cy = height * 0.50;
                radius = Math.min(isWide ? width * 0.38 : width * 0.44, height * 0.62, 205);

                const cellSize = minDistance / Math.SQRT2;
                const gridW = Math.ceil(width / cellSize);
                const gridH = Math.ceil(height / cellSize);
                const grid = new Int32Array(gridW * gridH).fill(-1);

                function isValid(x, y) {
                    const dx = (x - cx) / (radius * 1.05);
                    const dy = (y - cy) / (radius * 0.95);
                    if (dx * dx + dy * dy > 1.0) return false;

                    const cDist = Math.hypot(x - cx, y - cy);
                    if (cDist < radius * 0.12) return false; // hollow airy eye

                    const gx = Math.floor(x / cellSize);
                    const gy = Math.floor(y / cellSize);
                    const startX = Math.max(0, gx - 2), endX = Math.min(gridW - 1, gx + 2);
                    const startY = Math.max(0, gy - 2), endY = Math.min(gridH - 1, gy + 2);

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

                function addPoint(x, y) {
                    const dist = Math.hypot(x - cx, y - cy);
                    const pt = {
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
                        len: 3.4 + Math.random() * 2.0,       // Tiny micro-capsule length (3.4px to 5.4px)
                        width: 1.25 + Math.random() * 0.35,   // Crisp thin stroke (1.25px to 1.6px)
                        phase: Math.random() * Math.PI * 2,
                        noiseOffset: (Math.random() - 0.5) * 0.18
                    };
                    const idx = particles.length;
                    particles.push(pt);
                    const gx = Math.floor(x / cellSize);
                    const gy = Math.floor(y / cellSize);
                    grid[gy * gridW + gx] = idx;
                }

                // Concentric guide shells for radial alignment with blue-noise spacing
                const ringStep = minDistance * 1.15;
                for (let r = radius * 0.20; r <= radius; r += ringStep) {
                    const count = Math.floor((2 * Math.PI * r) / (minDistance * 1.30));
                    for (let i = 0; i < count; i++) {
                        const angle = (i / count) * Math.PI * 2 + (r * 0.45);
                        const x = cx + Math.cos(angle) * r;
                        const y = cy + Math.sin(angle) * r * 0.92;
                        if (isValid(x, y)) {
                            addPoint(x, y);
                        }
                    }
                }
            }

            function resize() {
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

            // Mouse interaction & dynamic ring tracking
            let mouseX = -9999, mouseY = -9999;
            let targetMouseX = -9999, targetMouseY = -9999;
            let mouseActive = false;
            let mouseSpeed = 0;
            let lastMouseX = 0, lastMouseY = 0;

            let ringX = cx, ringY = cy;
            let targetRingX = cx, targetRingY = cy;

            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                targetMouseX = e.clientX - rect.left;
                targetMouseY = e.clientY - rect.top;
                mouseActive = true;
                const dist = Math.hypot(targetMouseX - lastMouseX, targetMouseY - lastMouseY);
                mouseSpeed = Math.min(dist * 0.4, 25);
                lastMouseX = targetMouseX;
                lastMouseY = targetMouseY;
            });

            card.addEventListener('mouseleave', () => {
                mouseActive = false;
                targetMouseX = -9999;
                targetMouseY = -9999;
            });

            let time = 0;

            let isJellyVisible = true;
            let jellyAnimId = null;
            let isCardCovered = false;

            function animate() {
                if (!isJellyVisible || isCardCovered) return;
                jellyAnimId = requestAnimationFrame(animate);
                if (isMobileDevice && isScrolling) return;
                time += 0.018;

                ctx.clearRect(0, 0, width, height);

                // Smooth mouse interpolation
                if (mouseActive) {
                    mouseX += (targetMouseX - mouseX) * 0.14;
                    mouseY += (targetMouseY - mouseY) * 0.14;
                    targetRingX = mouseX;
                    targetRingY = mouseY;
                } else {
                    mouseX = -9999;
                    mouseY = -9999;
                    mouseSpeed *= 0.88;
                    // Gentle breathing idle float
                    targetRingX = cx + Math.sin(time * 0.8) * 14;
                    targetRingY = cy + Math.cos(time * 0.6) * 10;
                }

                // Ring center follows target with soft inertia
                ringX += (targetRingX - ringX) * 0.07;
                ringY += (targetRingY - ringY) * 0.07;

                const springK = 0.052;
                const damping = 0.88;

                for (let i = 0; i < particles.length; i++) {
                    const p = particles[i];

                    // 1. Organic Jelly Wave (Soft continuous gelatinous breathing)
                    const waveX = Math.sin(time * 2.2 + p.phase) * 2.8;
                    const waveY = Math.cos(time * 1.8 + p.phase * 1.3) * 2.5;
                    const targetX = p.bx + waveX;
                    const targetY = p.by + waveY;

                    // 2. Cursor Elastic Repulsion & 3D Denting
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

                    // 3. Elastic Spring-Damper Physics
                    p.vx = (p.vx + (targetX - p.x) * springK) * damping;
                    p.vy = (p.vy + (targetY - p.y) * springK) * damping;
                    p.vz = (p.vz + (0 - p.z) * springK) * damping;

                    p.x += p.vx;
                    p.y += p.vy;
                    p.z += p.vz;

                    // 4. Compute Radial Orientation Angle towards/away from ring focus
                    const angle = Math.atan2(p.y - ringY, p.x - ringX) + p.noiseOffset + Math.sin(time * 1.5 + p.phase) * 0.08;

                    // 5. Dynamic Morphing: Capsule -> Circle -> Capsule
                    // Dynamic scale and opacity based on ring proximity
                    const distToRing = Math.hypot(p.x - ringX, p.y - ringY);
                    const ringInfluence = Math.max(0, 1 - distToRing / 180);

                    // Organic harmonic breathing wave (soft rhythmic morphing across the sphere)
                    const pulseWave = Math.sin(time * 1.8 + p.phase + p.dist * 0.015);
                    const rawFactor = (pulseWave + 1) * 0.5; // 0 (circle) to 1 (capsule)
                    const morphFactor = Math.pow(rawFactor, 1.4);

                    // Cursor motion impulse stretches the capsule dynamically
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
                        // Softly contracts into a pure round micro-circle dot
                        ctx.arc(0, 0, curWidth * 0.55, 0, Math.PI * 2);
                        ctx.fill();
                    } else {
                        // Smoothly stretches into an elongated rounded capsule
                        ctx.lineCap = 'round';
                        ctx.lineWidth = curWidth;
                        ctx.moveTo(-curLen * 0.5, 0);
                        ctx.lineTo(curLen * 0.5, 0);
                        ctx.stroke();
                    }

                    ctx.restore();
                }
            }

            const jellyObserver = new IntersectionObserver(([entry]) => {
                const next = entry.isIntersecting;
                if (next && !isJellyVisible) {
                    isJellyVisible = true;
                    if (!isCardCovered && !jellyAnimId) jellyAnimId = requestAnimationFrame(animate);
                } else if (!next) {
                    isJellyVisible = false;
                    if (jellyAnimId) {
                        cancelAnimationFrame(jellyAnimId);
                        jellyAnimId = null;
                    }
                }
            }, { threshold: 0.02 });
            jellyObserver.observe(canvas);

            // Hardware Occlusion: When Card 2 slides over Card 1 on mobile, pause Card 1's 2D canvas completely
            const allServiceCards = document.querySelectorAll('.services-grid .service-card');
            const card2 = allServiceCards[1];
            if (card2 && isMobileDevice) {
                const checkOcclusion = () => {
                    const r2 = card2.getBoundingClientRect();
                    // When Card 2 reaches the sticky header area (top <= 90px), Card 1 is fully occluded
                    if (r2.top <= 90 && r2.bottom > 0) {
                        if (!isCardCovered) {
                            isCardCovered = true;
                            if (jellyAnimId) {
                                cancelAnimationFrame(jellyAnimId);
                                jellyAnimId = null;
                            }
                        }
                    } else if (r2.top > 90) {
                        if (isCardCovered) {
                            isCardCovered = false;
                            if (isJellyVisible && !jellyAnimId) {
                                jellyAnimId = requestAnimationFrame(animate);
                            }
                        }
                    }
                };
                window.addEventListener('scroll', checkOcclusion, { passive: true });
            }

            animate();
        }

        initAntigravityJellyCanvas();

        // ==================== PROJECT DETAIL MODAL & 60FPS SIMULATION SYSTEM ====================
        const projectCatalog = {
            'rotary-drive': {
                id: 'rotary-drive',
                badge: 'Precision Kinematics',
                title: 'Rotary Drive Assembly',
                subtitle: 'High-torque cyclic drive system engineered for zero-backlash rotational stability, preloaded bearing raceways, and dynamic balancing.',
                serviceOption: '01 — Engineering Design & Development',
                simType: 'gear-mesh',
                telemetry: {
                    speed: '1420 RPM',
                    torque: '480 Nm Peak',
                    tolerance: '±0.012 mm Runout',
                    status: 'CONVERGED // ZERO FLUTTER'
                },
                pipeline: [
                    { num: '01', title: 'Kinematic Solid CAD', desc: 'Parametric involute gear tooth modeling and dynamic clearance optimization.', tag: 'ISO 2768-m' },
                    { num: '02', title: 'Dynamic Load FEA', desc: 'Von Mises contact stress solver under 1,850 Nm cyclic shock torque.', tag: 'Stress < 185 MPa' },
                    { num: '03', title: 'Bearing Integration', desc: 'Dual-tapered roller bearing calculation for maximum axial & radial rigidity.', tag: 'L10h > 45,000 hrs' },
                    { num: '04', title: 'Production DFM Prints', desc: '2D manufacturing prints with true-position GD&T for multi-axis CNC.', tag: 'Zero-Rework Ready' }
                ],
                before: {
                    title: 'Legacy Workshop Layout',
                    desc: 'Off-the-shelf spur gear arrangement with manual shimming, excessive tooth play, and accelerated raceway wear under sudden reversing loads.',
                    tags: ['Backlash: ±0.35 mm', 'Manual Shim Fitting', '8.4% Assembly Scrap', 'High Audible Vibration']
                },
                after: {
                    title: 'Cadbeaver Engineered System',
                    desc: 'Custom-profiled precision helical gear mesh with hardened 4140 alloy, self-aligning pilot sleeves, and verified micron-level tooth clearance.',
                    tags: ['Backlash: ±0.012 mm', 'Zero-Shim Self-Centering', '0.0% Assembly Scrap', 'Silent Dynamic Mesh']
                },
                deltas: [
                    { val: '-72%', lbl: 'Backlash Play' },
                    { val: '+45%', lbl: 'Dynamic Load Peak' },
                    { val: '45k hrs', lbl: 'Bearing L10 Rating' },
                    { val: '0.0%', lbl: 'Shopfloor Rework' }
                ],
                specs: [
                    { label: 'Nominal Operating Speed', val: '1,420 RPM' },
                    { label: 'Peak Dynamic Torque', val: '480 Nm (1,850 Nm Shock)' },
                    { label: 'Total Radial Runout', val: '±0.012 mm' },
                    { label: 'Base Material Grade', val: 'Alloy Steel 4140 Hardened (HRC 50-54)' },
                    { label: 'Lubrication Enclosure', val: 'IP66 Dual Viton Rotary Lip Seals' },
                    { label: 'Engineering Deliverables', val: '2D GD&T DXF, 3D STEP Assembly, DFM Dossier' }
                ]
            },
            'bulk-conveyor': {
                id: 'bulk-conveyor',
                badge: 'Heavy Material Handling',
                title: 'Bulk Conveyor System',
                subtitle: 'High-throughput continuous screw conveyor engineered for abrasive bulk handling with zero trough jamming and progressive pitch feed.',
                serviceOption: '05 — Material Handling & Industrial Equipment',
                simType: 'conveyor-flow',
                telemetry: {
                    speed: '85 RPM Shaft',
                    torque: '620 Nm Continuous',
                    tolerance: '45 Ton / hr Rate',
                    status: 'UNIFORM VOLUMETRIC FLOW'
                },
                pipeline: [
                    { num: '01', title: 'Volumetric Pitch Modeling', desc: 'Progressive pitch flight geometry preventing hopper compaction and bridging.', tag: 'Variable 180-260mm' },
                    { num: '02', title: 'Torsional Deflection Solver', desc: 'Heavy-wall tubular shaft calculation to restrict span deflection under 1.8 mm.', tag: 'Deflection < L/1000' },
                    { num: '03', title: 'Wear-Resistant Hardfacing', desc: 'Flight edge cladding specification with anti-friction UHMW trough liner bedding.', tag: 'Hardness 450 BHN' },
                    { num: '04', title: 'Fabrication Detail Prints', desc: 'Modular flanged trough drawings with standardized drive mount interface.', tag: 'Field Bolt Assembly' }
                ],
                before: {
                    title: 'Standard Uniform Pitch Conveyor',
                    desc: 'Frequent material bridging at feed inlet, motor thermal trip-outs, and flight abrasion wear requiring replacement every 5 months.',
                    tags: ['Inlet Clogging Delays', 'High Motor Draw: 18.2A', 'Flight Life: 5 Months', '4.2% Spill Leakage']
                },
                after: {
                    title: 'Cadbeaver Progressive Lead System',
                    desc: 'Graduated pitch flighting with optimized feed throat clearance, reducing inlet compaction torque and tripling flight operating life.',
                    tags: ['Continuous Non-Clog Feed', 'Motor Draw: 11.4A (-37%)', 'Flight Life: 18+ Months', 'Zero Trough Spillage']
                },
                deltas: [
                    { val: '+38%', lbl: 'Bulk Throughput' },
                    { val: '-37%', lbl: 'Motor Power Draw' },
                    { val: '3.6x', lbl: 'Flight Wear Lifespan' },
                    { val: '0 Jam', lbl: 'Choke Failures' }
                ],
                specs: [
                    { label: 'Continuous Throughput', val: '45.0 Metric Tons / hr' },
                    { label: 'Shaft Outer Diameter', val: 'Ø114 mm Schedule 80 Seamless' },
                    { label: 'Flight Edge Metallurgy', val: 'Abrasion-Resistant Alloy 450' },
                    { label: 'Drive Reducer Ratio', val: '18.4:1 Helical-Bevel' },
                    { label: 'Hanger Bearing Type', val: 'Self-Lubricating Synthetic Insert' },
                    { label: 'Engineering Deliverables', val: 'Full Fabrication DXF, BOM, Motor Sizing Calc' }
                ]
            },
            'spm-machine': {
                id: 'spm-machine',
                badge: 'Special Purpose Machine',
                title: 'SPM Machine Framework',
                subtitle: 'High-speed automated assembly workstation with synchronized multi-axis gantry and sub-second parts transfer.',
                serviceOption: '06 — Custom Engineering Solutions',
                simType: 'spm-gantry',
                telemetry: {
                    speed: '1,200 Parts / hr',
                    torque: '3-Axis Gantry Cycle',
                    tolerance: 'Repeatability: ±0.015mm',
                    status: 'SYNCHRONIZED CAM & SERVO'
                },
                pipeline: [
                    { num: '01', title: 'Dynamic Kinematic Gantry', desc: 'Multi-axis pick-and-place mechanism with optimized S-curve velocity profiles.', tag: 'Acc: 2.2 m/s²' },
                    { num: '02', title: 'Vibration & Resonance FEA', desc: 'Rigid structural tubular frame maintaining modal frequency far above operational RPM.', tag: '1st Mode > 68 Hz' },
                    { num: '03', title: 'Pneumatic Nest Fixturing', desc: 'Rapid clamping pneumatic tooling nests with integrated proximity sensor feedback.', tag: 'Clamp Time < 0.15s' },
                    { num: '04', title: 'Turnkey Machine Docs', desc: 'Complete bill of materials, pneumatic schematics, and precision fabrication prints.', tag: 'CE / OSHA Compliant' }
                ],
                before: {
                    title: 'Multi-Station Manual Transfer',
                    desc: 'Operator-dependent manual loading stations resulting in irregular cycle times, operator strain, and 6.2% assembly variance defects.',
                    tags: ['Cycle: 8.4s / Part', 'Manual Operator Strain', '6.2% Defect Variance', 'Frequent Micro-Stops']
                },
                after: {
                    title: 'Cadbeaver Automated SPM Station',
                    desc: 'Single compact footprint automated workstation running continuous 2.4s cycles with pneumatic verification at every stage.',
                    tags: ['Cycle: 2.4s / Part (-71%)', 'Fully Hands-Free Automation', '0.04% Variance Margin', '99.4% Machine Uptime']
                },
                deltas: [
                    { val: '-71%', lbl: 'Part Cycle Time' },
                    { val: '1,200', lbl: 'Parts / hr Output' },
                    { val: '±0.015', lbl: 'Gantry Repeatability' },
                    { val: '99.4%', lbl: 'Operational OEE' }
                ],
                specs: [
                    { label: 'Station Cycle Output', val: '1,200 Units / hr (2.4s per cycle)' },
                    { label: 'Gantry Axes Travel', val: 'X: 650mm | Y: 400mm | Z: 180mm' },
                    { label: 'Positioning Repeatability', val: '±0.015 mm Linear' },
                    { label: 'Structural Base Frame', val: 'Stress-Relieved Heavy Tubular Steel' },
                    { label: 'Sensor Integration', val: 'Optical Gate + Inductive Nest Proxies' },
                    { label: 'Engineering Deliverables', val: 'Complete 3D Assembly, Pneumatic Schematic, 2D DFM' }
                ]
            },
            'torque-shaft': {
                id: 'torque-shaft',
                badge: 'Reverse Engineering & FEA',
                title: 'Torque Shaft Optimization',
                subtitle: 'Reverse engineering, 3D point-cloud reconstruction, and non-linear torsional stress redistribution for heavy turbine drives.',
                serviceOption: '03 — Engineering & Technical Services',
                simType: 'shaft-stress',
                telemetry: {
                    speed: '3600 RPM Rated',
                    torque: '2400 Nm Cyclic Load',
                    tolerance: 'Fillet Stress -55%',
                    status: 'VON MISES NOMINAL < 140 MPa'
                },
                pipeline: [
                    { num: '01', title: 'High-Precision Digitization', desc: 'Geometric capture of legacy splines and keyway transitions.', tag: 'Accuracy ±0.005mm' },
                    { num: '02', title: 'Stress Concentration FEA', desc: 'Finite element mesh refinement at shoulder fillets to pinpoint cyclic fatigue notch factors.', tag: 'Kt Reduced 1.8 -> 1.15' },
                    { num: '03', title: 'Parametric Fillet Re-profile', desc: 'Compound elliptic shoulder radius profile distributing shear stress uniformly.', tag: 'Fatigue Limit +85%' },
                    { num: '04', title: 'Precision CNC Turning Specs', desc: 'Blueprint specifying induction hardening depth and ground finish criteria.', tag: 'Ra 0.4 µm Bearing Seat' }
                ],
                before: {
                    title: 'Legacy Worn Shaft Component',
                    desc: 'Sharp step shoulder transitions caused premature micro-fracturing and catastrophic fatigue shearing under startup torque spikes.',
                    tags: ['Notch Stress: 310 MPa', 'Micro-Crack Propagation', 'Shaft Failure at 1,400 hrs', 'Unknown Metallurgy']
                },
                after: {
                    title: 'Cadbeaver Optimized Geometry',
                    desc: 'Redesigned elliptic relief transitions with specialized case-hardening profile, dropping peak notch stress safely below fatigue threshold.',
                    tags: ['Peak Stress: 138 MPa (-55%)', 'Infinite Life Cycle Curve', 'Case Hardened HRC 58-62', 'Complete Material Spec']
                },
                deltas: [
                    { val: '-55%', lbl: 'Peak Notch Stress' },
                    { val: '+180%', lbl: 'Fatigue Cycle Life' },
                    { val: 'Ra 0.4', lbl: 'Ground Finish Micro' },
                    { val: 'Zero', lbl: 'Startup Fractures' }
                ],
                specs: [
                    { label: 'Shaft Envelope Dimensions', val: 'Ø95 mm x 840 mm Length' },
                    { label: 'Continuous Torque Rating', val: '2,400 Nm (3,600 RPM)' },
                    { label: 'Peak Shock Factor', val: '2.5x Service Factor' },
                    { label: 'Metallurgical Standard', val: 'Alloy 4340 Vacuum Degassed' },
                    { label: 'Heat Treatment', val: 'Deep Nitrided / Case Hardened 0.8mm' },
                    { label: 'Engineering Deliverables', val: 'Full GD&T Shop Prints, FEA Simulation Report' }
                ]
            },
            'telemetry-dashboard': {
                id: 'telemetry-dashboard',
                badge: 'Custom Industrial Software',
                title: 'Operations & Telemetry Dashboard',
                subtitle: 'Microsecond machine telemetry data pipeline, distributed cycle analytics, and real-time operator control interface.',
                serviceOption: '07 — Custom Industrial Software & Dashboards',
                simType: 'telemetry-wave',
                telemetry: {
                    speed: '400 Hz Sampling',
                    torque: 'Zero Buffer Lag',
                    tolerance: 'Latency < 8ms',
                    status: 'REAL-TIME MQTT BROKER'
                },
                pipeline: [
                    { num: '01', title: 'Hardware Bus Ingestion', desc: 'Data driver capturing industrial PLC signals, encoder pulses, and temperature sensors.', tag: 'Sub-millisecond Edge' },
                    { num: '02', title: 'Telemetry Pipeline Broker', desc: 'High-throughput time-series streaming engine with automated compression and failover.', tag: '10,000 pts/sec' },
                    { num: '03', title: 'Aesthetic Web Dashboard', desc: 'Custom responsive machine dashboard with live oscilloscopes and cycle heatmaps.', tag: 'Zero Software Bloat' },
                    { num: '04', title: 'Predictive Threshold Alerts', desc: 'Automated notification engine alerting plant supervisors to thermal rise and cycle drift.', tag: 'Instant SMS / Email' }
                ],
                before: {
                    title: 'Disconnected Manual Shift Logs',
                    desc: 'Operators manually filled handwritten logbooks, machine heating spikes went undetected for hours, and micro-stops were untracked.',
                    tags: ['Delayed Fault Discovery', 'Handwritten Log Inaccuracies', '18% Untracked Downtime', 'No Predictive Visibility']
                },
                after: {
                    title: 'Cadbeaver Real-Time Telemetry',
                    desc: 'Instant visual insight across every operational metric, sub-second anomaly highlighting, and automated shift performance summaries.',
                    tags: ['Real-time 8ms Telemetry', 'Automated Shift Metrics', 'Zero Data Loss Logging', 'Immediate Thermal Alerts']
                },
                deltas: [
                    { val: '<8ms', lbl: 'Telemetry Latency' },
                    { val: '+28%', lbl: 'Operational OEE' },
                    { val: '100%', lbl: 'Cycle Visibility' },
                    { val: '0 min', lbl: 'Manual Logging' }
                ],
                specs: [
                    { label: 'Telemetry Ingestion Rate', val: '10,000 Samples / sec' },
                    { label: 'Pipeline Response Latency', val: '< 8 milliseconds' },
                    { label: 'Interface Architecture', val: 'High-Performance Web Client (Zero Plugins)' },
                    { label: 'Data Retention Storage', val: 'Encrypted Compressed Time-Series DB' },
                    { label: 'Alert Dispatch Channels', val: 'Instant Webhook, Telegram, SMS & Email' },
                    { label: 'Engineering Deliverables', val: 'Custom Software Codebase, API Schema, User Manual' }
                ]
            },
            'vision-scanner': {
                id: 'vision-scanner',
                badge: 'Edge AI & Computer Vision',
                title: 'Vision Quality & Defect Scanner',
                subtitle: 'Sub-millimeter automated optical classification, real-time dimensional contour verification, and zero-latency defect rejection.',
                serviceOption: '08 — AI Automation & Intelligent Systems',
                simType: 'vision-laser',
                telemetry: {
                    speed: '120 Parts / min',
                    torque: 'Neural Edge Inference',
                    tolerance: 'Accuracy: 99.85%',
                    status: 'MICRO-DEFECT IDENTIFIED: 0.02mm'
                },
                pipeline: [
                    { num: '01', title: 'Illumination & Optics Geometry', desc: 'Telecentric lens setup eliminating optical parallax distortion across manufactured parts.', tag: 'Telecentric 0.05x' },
                    { num: '02', title: 'Edge Neural Classifier', desc: 'Lightweight deep vision model detecting surface fissures, burrs, pitting, and thread errors in 12ms.', tag: '12ms / Frame' },
                    { num: '03', title: 'Sub-Pixel Dimension Metric', desc: 'Algorithmic contour measurement verifying critical diameters against CAD drawing tolerances.', tag: 'Precision ±0.008mm' },
                    { num: '04', title: 'High-Speed Reject Pneumatic', desc: 'Synchronized air-blast ejector triggering rejection of out-of-spec workpieces without line stoppage.', tag: '100% Sort Rate' }
                ],
                before: {
                    title: 'Manual Visual Inspection Table',
                    desc: 'Human inspectors fatigued after hours of eye strain, micro-cracks under 0.1mm slipped through undetected, resulting in customer returns.',
                    tags: ['Fatigue Error Rate: 4.8%', 'Inspection Speed: 15 / min', 'Missed Sub-mm Flaws', 'High Quality Disputes']
                },
                after: {
                    title: 'Cadbeaver Autonomous Optical AI',
                    desc: 'Continuous 120 parts/min automated scanner with 99.85% defect capture rate and instant pass/fail data logging to plant database.',
                    tags: ['Defect Accuracy: 99.85%', 'Inspection Speed: 120 / min', 'Sub-Pixel Micro Catch', '100% Traceability Audit']
                },
                deltas: [
                    { val: '99.85%', lbl: 'Defect Detection' },
                    { val: '8x', lbl: 'Inspection Throughput' },
                    { val: '±0.008', lbl: 'Sub-pixel Precision mm' },
                    { val: '0.0%', lbl: 'Customer Returns' }
                ],
                specs: [
                    { label: 'Inspection Throughput', val: '120 Units / min Continuous' },
                    { label: 'Optical Resolution', val: '5.0 Megapixel Telecentric Setup' },
                    { label: 'Defect Detection Threshold', val: '0.02 mm Surface Fissures' },
                    { label: 'Inference Latency', val: '12 milliseconds / Part' },
                    { label: 'Sorting Mechanism', val: 'Synchronized High-Speed Solenoid Jet' },
                    { label: 'Engineering Deliverables', val: 'AI Inspection Engine, Optical Enclosure, 2D Integration Prints' }
                ]
            }
        };

        let currentProjectId = null;
        let currentProjectData = null;
        let simAnimId = null;
        let simCanvas = null;
        let simCtx = null;
        let simIsPlaying = true;
        let simSpeed = 1.0;
        let simTime = 0;
        let simType = 'gear-mesh';

        // Simulation Viewport Controls
        function toggleSimPlayback() {
            simIsPlaying = !simIsPlaying;
            const playLabel = document.getElementById('pmPlayLabel');
            const playIcon = document.getElementById('pmPlayIcon');
            if (playLabel) playLabel.textContent = simIsPlaying ? 'PAUSE' : 'PLAY';
            if (playIcon) {
                if (simIsPlaying) {
                    playIcon.innerHTML = '<rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/>';
                } else {
                    playIcon.innerHTML = '<polygon points="5 3 19 12 5 21 5 3"/>';
                }
            }
        }

        function toggleSimSpeed() {
            const speeds = [1.0, 1.5, 2.0, 0.5];
            const idx = speeds.indexOf(simSpeed);
            simSpeed = speeds[(idx + 1) % speeds.length];
            const speedEl = document.getElementById('pmSpeedVal');
            if (speedEl) speedEl.textContent = simSpeed.toFixed(1) + 'x';
        }

        function resetSimView() {
            simTime = 0;
        }

        // Before / After Split Slider
        let isBaDragging = false;
        let baSliderPos = 50;

        function updateBaSlider(pos) {
            baSliderPos = Math.max(5, Math.min(95, pos));
            const handle = document.getElementById('pmBaHandle');
            const afterPanel = document.getElementById('pmBaAfter');
            if (handle) handle.style.left = baSliderPos + '%';
            if (afterPanel) afterPanel.style.clipPath = `polygon(0 0, ${baSliderPos}% 0, ${baSliderPos}% 100%, 0 100%)`;
        }

        function initBaSlider() {
            const container = document.getElementById('pmBaContainer');
            if (!container || container.dataset.init) return;
            container.dataset.init = 'true';

            function getContainerPos(clientX) {
                const rect = container.getBoundingClientRect();
                return ((clientX - rect.left) / rect.width) * 100;
            }

            container.addEventListener('mousedown', (e) => {
                isBaDragging = true;
                updateBaSlider(getContainerPos(e.clientX));
            });

            window.addEventListener('mousemove', (e) => {
                if (!isBaDragging) return;
                updateBaSlider(getContainerPos(e.clientX));
            });

            window.addEventListener('mouseup', () => {
                isBaDragging = false;
            });

            container.addEventListener('touchstart', (e) => {
                isBaDragging = true;
                if (e.touches[0]) updateBaSlider(getContainerPos(e.touches[0].clientX));
            }, { passive: true });

            window.addEventListener('touchmove', (e) => {
                if (!isBaDragging) return;
                if (e.touches[0]) updateBaSlider(getContainerPos(e.touches[0].clientX));
            }, { passive: true });

            window.addEventListener('touchend', () => {
                isBaDragging = false;
            });
            window.addEventListener('touchcancel', () => {
                isBaDragging = false;
            });
        }

        // Procedural 60fps Canvas Simulator
        function runSimulation() {
            const modal = document.getElementById('projectModal');
            if (!modal || !modal.classList.contains('active')) return;

            if (!simCanvas) {
                simCanvas = document.getElementById('projectSimCanvas');
                if (simCanvas) simCtx = simCanvas.getContext('2d');
            }
            if (!simCanvas || !simCtx) return;

            const dpr = Math.min(window.devicePixelRatio || 1, 2);
            const w = simCanvas.clientWidth;
            const h = simCanvas.clientHeight;

            if (simCanvas.width !== Math.floor(w * dpr) || simCanvas.height !== Math.floor(h * dpr)) {
                simCanvas.width = Math.floor(w * dpr);
                simCanvas.height = Math.floor(h * dpr);
            }

            simCtx.save();
            simCtx.scale(dpr, dpr);
            simCtx.clearRect(0, 0, w, h);

            if (simIsPlaying) {
                simTime += 0.016 * simSpeed;
            }

            const cx = w * 0.5;
            const cy = h * 0.5;

            // DRAW PROCEDURAL ENGINEERING ANIMATION MATCHING PROJECT
            if (simType === 'gear-mesh') {
                // Dual Meshing Gears
                const r1 = 65, r2 = 90;
                const d1 = cx - 75, d2 = cx + 80;
                const a1 = simTime * 1.8;
                const a2 = -a1 * (r1 / r2) + 0.12;

                function drawGear(gx, gy, rad, teeth, angle, color, isDrive) {
                    simCtx.save();
                    simCtx.translate(gx, gy);
                    simCtx.rotate(angle);

                    // Pitch circle (dashed)
                    simCtx.beginPath();
                    simCtx.arc(0, 0, rad, 0, Math.PI * 2);
                    simCtx.strokeStyle = 'rgba(77, 130, 243, 0.45)';
                    simCtx.setLineDash([4, 4]);
                    simCtx.lineWidth = 1.2;
                    simCtx.stroke();
                    simCtx.setLineDash([]);

                    // Gear teeth
                    simCtx.beginPath();
                    for (let i = 0; i < teeth; i++) {
                        const th = (i / teeth) * Math.PI * 2;
                        const thStep = (Math.PI * 2) / teeth;
                        const ro = rad + 12;
                        const ri = rad - 12;
                        const t0 = th - thStep * 0.25;
                        const t1 = th - thStep * 0.12;
                        const t2 = th + thStep * 0.12;
                        const t3 = th + thStep * 0.25;

                        const x0 = Math.cos(t0) * ri, y0 = Math.sin(t0) * ri;
                        const x1 = Math.cos(t1) * ro, y1 = Math.sin(t1) * ro;
                        const x2 = Math.cos(t2) * ro, y2 = Math.sin(t2) * ro;
                        const x3 = Math.cos(t3) * ri, y3 = Math.sin(t3) * ri;

                        if (i === 0) simCtx.moveTo(x0, y0);
                        else simCtx.lineTo(x0, y0);
                        simCtx.lineTo(x1, y1);
                        simCtx.lineTo(x2, y2);
                        simCtx.lineTo(x3, y3);
                    }
                    simCtx.closePath();
                    simCtx.fillStyle = 'rgba(30, 41, 59, 0.85)';
                    simCtx.fill();
                    simCtx.strokeStyle = color;
                    simCtx.lineWidth = 1.5;
                    simCtx.stroke();

                    // Keyed Shaft Hub
                    simCtx.beginPath();
                    simCtx.arc(0, 0, 20, 0, Math.PI * 2);
                    simCtx.fillStyle = '#0F172A';
                    simCtx.fill();
                    simCtx.strokeStyle = '#94A3B8';
                    simCtx.lineWidth = 1.4;
                    simCtx.stroke();

                    // Keyway
                    simCtx.fillStyle = '#64748B';
                    simCtx.fillRect(-3, -20, 6, 8);

                    // Rotating Torque Vector
                    if (isDrive) {
                        simCtx.beginPath();
                        simCtx.arc(0, 0, rad * 0.55, -0.6, 1.2);
                        simCtx.strokeStyle = '#4D82F3';
                        simCtx.lineWidth = 2.4;
                        simCtx.stroke();
                    }

                    simCtx.restore();
                }

                drawGear(d1, cy, r1, 14, a1, '#E2E8F0', true);
                drawGear(d2, cy, r2, 20, a2, '#94A3B8', false);

                // Mesh Point Crosshair
                const mx = (d1 * r2 + d2 * r1) / (r1 + r2);
                simCtx.beginPath();
                simCtx.arc(mx, cy, 5, 0, Math.PI * 2);
                simCtx.strokeStyle = '#10B981';
                simCtx.lineWidth = 1.5;
                simCtx.stroke();

                // Telemetry overlay text on canvas
                simCtx.font = '600 11px "JetBrains Mono", monospace';
                simCtx.fillStyle = '#94A3B8';
                simCtx.fillText('MESH FREQUENCY: 331.3 Hz', 24, h - 24);
                simCtx.fillStyle = '#4D82F3';
                simCtx.fillText('DRIVE: 1,420 RPM [ACTIVE]', 24, h - 42);

            } else if (simType === 'conveyor-flow') {
                // Rotating Bulk Screw Conveyor & Flowing Granular Particles
                const troughW = w * 0.78;
                const troughH = 110;
                const tx = (w - troughW) * 0.5;
                const ty = cy - troughH * 0.5;

                // Trough outline
                simCtx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
                simCtx.lineWidth = 1.5;
                simCtx.strokeRect(tx, ty, troughW, troughH);

                // Center Shaft
                simCtx.fillStyle = '#1E293B';
                simCtx.fillRect(tx, cy - 8, troughW, 16);
                simCtx.strokeStyle = '#64748B';
                simCtx.lineWidth = 1.2;
                simCtx.strokeRect(tx, cy - 8, troughW, 16);

                // Helical Flights
                const pitches = 8;
                const pitchW = troughW / pitches;
                const flightH = 44;
                const screwPhase = (simTime * 2.8) % 1;

                simCtx.lineWidth = 2.2;
                for (let i = -1; i <= pitches; i++) {
                    const fx = tx + (i + screwPhase) * pitchW;
                    if (fx < tx - 10 || fx > tx + troughW + 10) continue;

                    // Front helix curve
                    simCtx.beginPath();
                    simCtx.moveTo(fx, cy - flightH);
                    simCtx.bezierCurveTo(fx + pitchW * 0.5, cy - flightH * 0.2, fx + pitchW * 0.5, cy + flightH * 0.2, fx + pitchW, cy + flightH);
                    simCtx.strokeStyle = '#E2E8F0';
                    simCtx.stroke();

                    // Rear shadow curve
                    simCtx.beginPath();
                    simCtx.moveTo(fx, cy - flightH);
                    simCtx.bezierCurveTo(fx - pitchW * 0.3, cy - flightH * 0.2, fx - pitchW * 0.3, cy + flightH * 0.2, fx + pitchW, cy + flightH);
                    simCtx.strokeStyle = 'rgba(100, 116, 139, 0.45)';
                    simCtx.stroke();
                }

                // Granular Particles streaming through trough
                const pCount = 38;
                for (let p = 0; p < pCount; p++) {
                    const pProgress = ((simTime * 0.45 + p / pCount) % 1.0);
                    const px = tx + 10 + pProgress * (troughW - 20);
                    const py = cy + 12 + Math.sin(p * 9 + simTime * 2) * 26;
                    const pr = 2.0 + (p % 3) * 0.8;

                    simCtx.beginPath();
                    simCtx.arc(px, py, pr, 0, Math.PI * 2);
                    simCtx.fillStyle = (p % 4 === 0) ? '#4D82F3' : 'rgba(226, 232, 240, 0.75)';
                    simCtx.fill();
                }

                // Inflow hopper arrow
                simCtx.strokeStyle = '#10B981';
                simCtx.fillStyle = '#10B981';
                simCtx.lineWidth = 2;
                simCtx.beginPath();
                simCtx.moveTo(tx + 24, ty - 26);
                simCtx.lineTo(tx + 24, ty - 6);
                simCtx.stroke();

                simCtx.font = '600 11px "JetBrains Mono", monospace';
                simCtx.fillStyle = '#10B981';
                simCtx.fillText('FEED INLET: 45.0 TPH', tx + 34, ty - 12);
                simCtx.fillStyle = '#94A3B8';
                simCtx.fillText('TROUGH FILL FRACTION: 38% [OPTIMAL]', tx, ty + troughH + 24);

            } else if (simType === 'spm-gantry') {
                // SPM Automated 3-Axis Gantry Pick & Place
                const railY = cy - 80;
                const railW = w * 0.74;
                const rx = (w - railW) * 0.5;

                // Horizontal gantry beam
                simCtx.fillStyle = '#1E293B';
                simCtx.fillRect(rx, railY, railW, 16);
                simCtx.strokeStyle = '#475569';
                simCtx.lineWidth = 1.5;
                simCtx.strokeRect(rx, railY, railW, 16);

                // Sliding Carriage
                const travelRange = railW * 0.65;
                const cycle = Math.sin(simTime * 1.8);
                const carX = cx + cycle * (travelRange * 0.5);
                const carW = 60, carH = 34;

                simCtx.fillStyle = '#0F172A';
                simCtx.fillRect(carX - carW * 0.5, railY - 8, carW, carH);
                simCtx.strokeStyle = '#E2E8F0';
                simCtx.lineWidth = 1.6;
                simCtx.strokeRect(carX - carW * 0.5, railY - 8, carW, carH);

                // Telescopic Vertical Cylinder
                const drop = Math.max(0, Math.sin(simTime * 3.6)) * 65;
                const cylY = railY + carH;
                simCtx.fillStyle = '#94A3B8';
                simCtx.fillRect(carX - 6, cylY, 12, 45 + drop);

                // Gripper Head & Workpiece
                const gripY = cylY + 45 + drop;
                simCtx.fillStyle = '#1E293B';
                simCtx.fillRect(carX - 22, gripY, 44, 12);

                // Workpiece Block
                simCtx.fillStyle = '#4D82F3';
                simCtx.fillRect(carX - 14, gripY + 12, 28, 20);
                simCtx.strokeStyle = '#E2E8F0';
                simCtx.lineWidth = 1;
                simCtx.strokeRect(carX - 14, gripY + 12, 28, 20);

                // Laser Guide Beam downward
                simCtx.beginPath();
                simCtx.moveTo(carX, gripY + 32);
                simCtx.lineTo(carX, cy + 90);
                simCtx.strokeStyle = 'rgba(16, 185, 129, 0.45)';
                simCtx.lineWidth = 1.2;
                simCtx.setLineDash([3, 3]);
                simCtx.stroke();
                simCtx.setLineDash([]);

                // Target Base Table
                simCtx.fillStyle = 'rgba(255, 255, 255, 0.08)';
                simCtx.fillRect(rx, cy + 90, railW, 10);

                simCtx.font = '600 11px "JetBrains Mono", monospace';
                simCtx.fillStyle = '#E2E8F0';
                simCtx.fillText(`AXIS POSITION: X ${(carX - cx).toFixed(1)} mm | Z ${drop.toFixed(1)} mm`, rx, cy + 124);
                simCtx.fillStyle = '#10B981';
                simCtx.fillText('CYCLE OEE: 99.4% [SYNCHRONIZED]', rx, cy + 140);

            } else if (simType === 'shaft-stress') {
                // Stepped Torque Shaft with Finite Element Von Mises Stress Heatmap
                const shaftW = w * 0.74;
                const sx = (w - shaftW) * 0.5;

                // Stepped Diameters
                const d1W = shaftW * 0.32, d1H = 50;
                const d2W = shaftW * 0.36, d2H = 80;
                const d3W = shaftW * 0.32, d3H = 55;

                const step1X = sx + d1W;
                const step2X = step1X + d2W;

                // Section 1
                simCtx.fillStyle = '#1E293B';
                simCtx.fillRect(sx, cy - d1H * 0.5, d1W, d1H);
                simCtx.strokeStyle = '#64748B';
                simCtx.strokeRect(sx, cy - d1H * 0.5, d1W, d1H);

                // Section 2 (Center Heavy Section with dynamic stress gradient)
                const stressGrad = simCtx.createLinearGradient(step1X, cy, step2X, cy);
                const pulse = (Math.sin(simTime * 3) + 1) * 0.5;
                stressGrad.addColorStop(0, `rgba(245, 158, 11, ${0.4 + pulse * 0.5})`);
                stressGrad.addColorStop(0.18, '#1E293B');
                stressGrad.addColorStop(0.82, '#1E293B');
                stressGrad.addColorStop(1, `rgba(245, 158, 11, ${0.4 + pulse * 0.5})`);

                simCtx.fillStyle = stressGrad;
                simCtx.fillRect(step1X, cy - d2H * 0.5, d2W, d2H);
                simCtx.strokeStyle = '#94A3B8';
                simCtx.strokeRect(step1X, cy - d2H * 0.5, d2W, d2H);

                // Section 3
                simCtx.fillStyle = '#1E293B';
                simCtx.fillRect(step2X, cy - d3H * 0.5, d3W, d3H);
                simCtx.strokeStyle = '#64748B';
                simCtx.strokeRect(step2X, cy - d3H * 0.5, d3W, d3H);

                // Transition Fillet Markers with Glowing Rings
                simCtx.beginPath();
                simCtx.arc(step1X, cy - d1H * 0.5, 9, 0, Math.PI * 2);
                simCtx.arc(step1X, cy + d1H * 0.5, 9, 0, Math.PI * 2);
                simCtx.arc(step2X, cy - d3H * 0.5, 9, 0, Math.PI * 2);
                simCtx.arc(step2X, cy + d3H * 0.5, 9, 0, Math.PI * 2);
                simCtx.strokeStyle = '#F59E0B';
                simCtx.lineWidth = 1.8;
                simCtx.stroke();

                // Torsional Shear Vector Arrows
                const twPhase = (simTime * 2.5) % Math.PI;
                simCtx.beginPath();
                simCtx.arc(sx + 30, cy, 32, -0.6 + twPhase * 0.3, 0.8 + twPhase * 0.3);
                simCtx.strokeStyle = '#4D82F3';
                simCtx.lineWidth = 2.4;
                simCtx.stroke();

                simCtx.font = '600 11px "JetBrains Mono", monospace';
                const curMpa = (118 + pulse * 20).toFixed(1);
                simCtx.fillStyle = '#F59E0B';
                simCtx.fillText(`VON MISES PEAK: ${curMpa} MPa [SAFE // LIMIT 285 MPa]`, sx, cy + 90);
                simCtx.fillStyle = '#94A3B8';
                simCtx.fillText('ELLIPTIC FILLET CONVERGENCE: Kt = 1.15', sx, cy + 108);

            } else if (simType === 'telemetry-wave') {
                // High-Frequency Digital Telemetry Oscilloscope
                const waveW = w * 0.82;
                const wx = (w - waveW) * 0.5;

                // Channel 1: Machine Load Wave (Electric Blue)
                simCtx.beginPath();
                for (let i = 0; i < waveW; i += 4) {
                    const xVal = wx + i;
                    const yVal = cy - 35 + Math.sin(i * 0.024 + simTime * 3.5) * 28 + Math.cos(i * 0.06) * 7;
                    if (i === 0) simCtx.moveTo(xVal, yVal);
                    else simCtx.lineTo(xVal, yVal);
                }
                simCtx.strokeStyle = '#4D82F3';
                simCtx.lineWidth = 2.2;
                simCtx.stroke();

                // Channel 2: Acceleration FFT Waveform (Emerald Green)
                simCtx.beginPath();
                for (let i = 0; i < waveW; i += 3) {
                    const xVal = wx + i;
                    const yVal = cy + 42 + Math.sin(i * 0.08 + simTime * 5.2) * 16 + (Math.sin(i * 1.4) * 4);
                    if (i === 0) simCtx.moveTo(xVal, yVal);
                    else simCtx.lineTo(xVal, yVal);
                }
                simCtx.strokeStyle = '#10B981';
                simCtx.lineWidth = 1.8;
                simCtx.stroke();

                // Sliding Data Bus Packets
                const packetW = 60;
                for (let pk = 0; pk < 5; pk++) {
                    const pkX = wx + ((simTime * 110 + pk * 150) % (waveW + 60)) - 60;
                    if (pkX >= wx && pkX + packetW <= wx + waveW) {
                        simCtx.fillStyle = 'rgba(255, 255, 255, 0.06)';
                        simCtx.fillRect(pkX, cy - 8, packetW, 16);
                        simCtx.strokeStyle = '#94A3B8';
                        simCtx.strokeRect(pkX, cy - 8, packetW, 16);
                        simCtx.font = '600 9px "JetBrains Mono", monospace';
                        simCtx.fillStyle = '#CBD5E1';
                        simCtx.fillText(`0x${(120 + pk * 17).toString(16).toUpperCase()}`, pkX + 12, cy + 4);
                    }
                }

                simCtx.font = '600 11px "JetBrains Mono", monospace';
                simCtx.fillStyle = '#4D82F3';
                simCtx.fillText('CH1: LOAD SPECTRUM // 14.8A NOMINAL', wx, cy - 78);
                simCtx.fillStyle = '#10B981';
                simCtx.fillText('CH2: VIBRATION ACCEL // 0.12 g RMS', wx, cy + 86);

            } else if (simType === 'vision-laser') {
                // High-Speed Edge AI Vision & Laser Sweep
                const beltW = w * 0.78;
                const bx = (w - beltW) * 0.5;
                const beltY = cy + 45;

                // Conveyor Track
                simCtx.fillStyle = 'rgba(255, 255, 255, 0.05)';
                simCtx.fillRect(bx, beltY, beltW, 14);
                simCtx.strokeStyle = '#475569';
                simCtx.strokeRect(bx, beltY, beltW, 14);

                // Workpiece traversing track
                const wpX = cx - 40;
                const wpY = cy - 40;
                const wpW = 80, wpH = 70;

                simCtx.fillStyle = '#1E293B';
                simCtx.fillRect(wpX, wpY, wpW, wpH);
                simCtx.strokeStyle = '#94A3B8';
                simCtx.lineWidth = 1.4;
                simCtx.strokeRect(wpX, wpY, wpW, wpH);

                // Machined Bore Feature Inside Block
                simCtx.beginPath();
                simCtx.arc(cx, cy - 5, 20, 0, Math.PI * 2);
                simCtx.fillStyle = '#0F172A';
                simCtx.fill();
                simCtx.strokeStyle = '#CBD5E1';
                simCtx.stroke();

                // High-Speed Laser Sweep Line
                const laserX = bx + 20 + ((Math.sin(simTime * 2.8) + 1) * 0.5) * (beltW - 40);

                // Laser Beam
                simCtx.beginPath();
                simCtx.moveTo(laserX, cy - 110);
                simCtx.lineTo(laserX, beltY);
                simCtx.strokeStyle = '#10B981';
                simCtx.lineWidth = 2.4;
                simCtx.stroke();

                // Laser Beam Glow
                simCtx.beginPath();
                simCtx.moveTo(laserX, cy - 110);
                simCtx.lineTo(laserX, beltY);
                simCtx.strokeStyle = 'rgba(16, 185, 129, 0.25)';
                simCtx.lineWidth = 8;
                simCtx.stroke();

                // AI Bounding Box with Tech Brackets
                const isOver = Math.abs(laserX - cx) < 65;
                const bbColor = isOver ? '#10B981' : '#4D82F3';

                simCtx.strokeStyle = bbColor;
                simCtx.lineWidth = 1.8;

                // Corner bracket top-left
                simCtx.beginPath();
                simCtx.moveTo(wpX - 12, wpY - 4);
                simCtx.lineTo(wpX - 12, wpY - 12);
                simCtx.lineTo(wpX - 4, wpY - 12);
                // Top-right
                simCtx.moveTo(wpX + wpW + 4, wpY - 12);
                simCtx.lineTo(wpX + wpW + 12, wpY - 12);
                simCtx.lineTo(wpX + wpW + 12, wpY - 4);
                // Bottom-left
                simCtx.moveTo(wpX - 12, wpY + wpH + 4);
                simCtx.lineTo(wpX - 12, wpY + wpH + 12);
                simCtx.lineTo(wpX - 4, wpY + wpH + 12);
                // Bottom-right
                simCtx.moveTo(wpX + wpW + 4, wpY + wpH + 12);
                simCtx.lineTo(wpX + wpW + 12, wpY + wpH + 12);
                simCtx.lineTo(wpX + wpW + 12, wpY + wpH + 4);
                simCtx.stroke();

                simCtx.font = '600 11px "JetBrains Mono", monospace';
                simCtx.fillStyle = bbColor;
                simCtx.fillText('[AI] BORE: Ø40.008mm [PASS 99.85%]', wpX - 12, wpY - 18);
                simCtx.fillStyle = '#E2E8F0';
                simCtx.fillText('INSPECTION SPEED: 120 PARTS/MIN // 12ms INFERENCE', bx, cy + 90);
            }

            simCtx.restore();

            simAnimId = requestAnimationFrame(runSimulation);
        }

        // Open & Populate Project Detail Modal
        function openProjectDetail(projectId) {
            if (isSliderDragging) return;
            const project = projectCatalog[projectId];
            if (!project) return;

            currentProjectId = projectId;
            currentProjectData = project;

            // Header & Hero Texts
            const badgeEl = document.getElementById('pm-badge');
            const titleEl = document.getElementById('pm-title');
            const subEl = document.getElementById('pm-subtitle');
            if (badgeEl) badgeEl.textContent = project.badge.toUpperCase();
            if (titleEl) titleEl.textContent = project.title;
            if (subEl) subEl.textContent = project.subtitle;

            // Telemetry HUD
            const teleEl = document.getElementById('pm-hud-telemetry');
            if (teleEl && project.telemetry) {
                teleEl.innerHTML = `
                    <span>SPEED: ${project.telemetry.speed}</span>
                    <span class="pm-hud-sep">|</span>
                    <span>${project.telemetry.torque}</span>
                    <span class="pm-hud-sep">|</span>
                    <span>${project.telemetry.tolerance}</span>
                `;
            }
            const stateEl = document.getElementById('pmSimStateText');
            if (stateEl && project.telemetry) {
                stateEl.textContent = project.telemetry.status;
            }

            // Concept 1: Pipeline
            const pipeTrack = document.getElementById('pm-pipeline-track');
            if (pipeTrack && project.pipeline) {
                pipeTrack.innerHTML = project.pipeline.map(st => `
                    <div class="pm-pipeline-station">
                        <div class="pm-station-top">
                            <span class="pm-station-num">${st.num}</span>
                            <span class="pm-station-tag">${st.tag}</span>
                        </div>
                        <h4 class="pm-station-title">${st.title}</h4>
                        <p class="pm-station-desc">${st.desc}</p>
                    </div>
                `).join('');
            }

            // Concept 2: Before vs After
            const bTitle = document.getElementById('pm-before-title');
            const bDesc = document.getElementById('pm-before-desc');
            const bTags = document.getElementById('pm-before-tags');
            if (bTitle) bTitle.textContent = project.before.title;
            if (bDesc) bDesc.textContent = project.before.desc;
            if (bTags) {
                bTags.innerHTML = project.before.tags.map(t => `<span class="pm-ba-tag">${t}</span>`).join('');
            }

            const aTitle = document.getElementById('pm-after-title');
            const aDesc = document.getElementById('pm-after-desc');
            const aTags = document.getElementById('pm-after-tags');
            if (aTitle) aTitle.textContent = project.after.title;
            if (aDesc) aDesc.textContent = project.after.desc;
            if (aTags) {
                aTags.innerHTML = project.after.tags.map(t => `<span class="pm-ba-tag">${t}</span>`).join('');
            }

            // Deltas
            const deltaRow = document.getElementById('pm-delta-row');
            if (deltaRow && project.deltas) {
                deltaRow.innerHTML = project.deltas.map(d => `
                    <div class="pm-delta-card">
                        <span class="pm-delta-val">${d.val}</span>
                        <span class="pm-delta-lbl">${d.lbl}</span>
                    </div>
                `).join('');
            }

            // Concept 3: Specs Grid
            const specsGrid = document.getElementById('pm-specs-grid');
            if (specsGrid && project.specs) {
                specsGrid.innerHTML = project.specs.map(s => `
                    <div class="pm-spec-item">
                        <span class="pm-spec-label">${s.label}</span>
                        <span class="pm-spec-value">${s.val}</span>
                    </div>
                `).join('');
            }

            // WhatsApp link
            const waLink = document.getElementById('pm-whatsapp-link');
            if (waLink) {
                const waText = encodeURIComponent(`Hi Cadbeaver Engineering, I am interested in consulting regarding your "${project.title}" (${project.badge}) project solution.`);
                waLink.href = `https://wa.me/919172411202?text=${waText}`;
            }

            // Reset Slider Position
            initBaSlider();
            updateBaSlider(50);

            // Launch Simulation
            simType = project.simType || 'gear-mesh';
            simTime = 0;
            simIsPlaying = true;
            if (simAnimId) cancelAnimationFrame(simAnimId);
            runSimulation();

            // Open Modal
            const modal = document.getElementById('projectModal');
            if (modal) {
                modal.classList.add('active');
                modal.setAttribute('aria-hidden', 'false');
                document.body.style.overflow = 'hidden';
            }
        }

        function closeProjectModal() {
            const modal = document.getElementById('projectModal');
            if (modal) {
                modal.classList.remove('active');
                modal.setAttribute('aria-hidden', 'true');
            }
            document.body.style.overflow = '';
            if (simAnimId) {
                cancelAnimationFrame(simAnimId);
                simAnimId = null;
            }
        }

        // Bridge: Inquire from Project Detail
        function inquireFromProject() {
            if (!currentProjectData) return;
            const project = currentProjectData;
            closeProjectModal();
            setTimeout(() => {
                openContactModal();
                const serviceSelect = document.getElementById('custService');
                if (serviceSelect && project.serviceOption) {
                    for (let i = 0; i < serviceSelect.options.length; i++) {
                        if (serviceSelect.options[i].value === project.serviceOption) {
                            serviceSelect.selectedIndex = i;
                            break;
                        }
                    }
                }
                const msgBox = document.getElementById('custMsg');
                if (msgBox) {
                    msgBox.value = `I would like to inquire regarding engineering services similar to "${project.title}" (${project.badge}).\nProject Scope Requirement: `;
                    msgBox.focus();
                }
            }, 300);
        }

        // Project Modal Backdrop & Escape Key Handlers
        const pmOverlay = document.getElementById('projectModal');
        if (pmOverlay) {
            pmOverlay.addEventListener('click', (e) => {
                if (e.target === pmOverlay) closeProjectModal();
            });
        }

        window.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                const pm = document.getElementById('projectModal');
                if (pm && pm.classList.contains('active')) closeProjectModal();
                const cm = document.getElementById('contactModal');
                if (cm && cm.classList.contains('active')) closeContactModal();
            }
        });