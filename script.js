/* ==========================================================================
   FOWAD ABRAR — AUTONOMOUS SYSTEMS & MACHINE LEARNING CONSOLE
   High-Performance 3D Drone Telemetry, Micro-Animations & Interaction Engine
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

    // ── 1. DYNAMIC ENGINEERING ROLE CYCLER ──
    const typewriterEl = document.getElementById('typewriter');
    const rolePhrases = [
        'Junior Frontend Software Engineer',
        'Autonomous Systems & Drone Telemetry',
        'Computer Vision & Edge ML (YOLO/PyTorch)',
        '3D CAD & Hardware Prototyping (Fusion 360)'
    ];
    let phraseIdx = 0;
    let charIdx = 0;
    let isDeleting = false;
    let typeSpeed = 65;

    function typeRole() {
        if (!typewriterEl) return;
        const current = rolePhrases[phraseIdx];

        if (isDeleting) {
            typewriterEl.textContent = current.substring(0, charIdx - 1);
            charIdx--;
            typeSpeed = 30;
        } else {
            typewriterEl.textContent = current.substring(0, charIdx + 1);
            charIdx++;
            typeSpeed = 65;
        }

        if (!isDeleting && charIdx === current.length) {
            isDeleting = true;
            typeSpeed = 2200; // Pause at phrase completion
        } else if (isDeleting && charIdx === 0) {
            isDeleting = false;
            phraseIdx = (phraseIdx + 1) % rolePhrases.length;
            typeSpeed = 350; // Pause before starting next
        }

        setTimeout(typeRole, typeSpeed);
    }

    typeRole();

    // ── 2. SCROLL-TRIGGERED REVEAL ENGINE ([data-reveal]) ──
    const revealElements = document.querySelectorAll('[data-reveal]');
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                revealObserver.unobserve(entry.target);
            }
        });
    }, {
        root: null,
        rootMargin: '0px 0px -40px 0px',
        threshold: 0.15
    });

    revealElements.forEach(el => revealObserver.observe(el));

    // ── 3. INTERACTIVE 3D AUTONOMOUS DRONE & TELEMETRY CANVAS ──
    const droneCanvas = document.getElementById('droneTelemetryCanvas');
    const droneViewport = document.getElementById('droneHudViewport');
    const dronePitchEl = document.getElementById('dronePitch');
    const droneRollEl = document.getElementById('droneRoll');
    const droneAltEl = document.getElementById('droneAlt');

    if (droneCanvas && droneViewport) {
        const ctx = droneCanvas.getContext('2d');
        const dpr = window.devicePixelRatio || 1;
        let width = droneViewport.clientWidth;
        let height = droneViewport.clientHeight;
        let animId = null;

        function resizeDroneCanvas() {
            width = droneViewport.clientWidth;
            height = droneViewport.clientHeight;
            droneCanvas.width = width * dpr;
            droneCanvas.height = height * dpr;
            droneCanvas.style.width = `${width}px`;
            droneCanvas.style.height = `${height}px`;
            ctx.scale(dpr, dpr);
        }

        resizeDroneCanvas();

        // 3D Matrix & Math Variables
        let rotX = 0.25; // Pitch
        let rotY = 0.6;  // Yaw
        let rotZ = 0.0;  // Roll
        let targetRotX = 0.25;
        let targetRotY = 0.6;
        let targetRotZ = 0.0;
        let autoYawSpeed = 0.008;
        let rotorAngle = 0;
        let lidarScanAngle = 0;
        let time = 0;

        // Desktop Mouse Tracking
        const isDesktop = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

        if (isDesktop) {
            droneViewport.addEventListener('mousemove', (e) => {
                const rect = droneViewport.getBoundingClientRect();
                const mouseX = (e.clientX - rect.left) / rect.width - 0.5; // -0.5 to +0.5
                const mouseY = (e.clientY - rect.top) / rect.height - 0.5;

                targetRotX = mouseY * 0.8 + 0.2;
                targetRotZ = -mouseX * 0.6;
                targetRotY += mouseX * 0.02;
            });

            droneViewport.addEventListener('mouseleave', () => {
                targetRotX = 0.25;
                targetRotZ = 0.0;
            });
        }

        // 3D Projection Math
        function project3D(x, y, z, originX, originY, focal) {
            // Apply Rotations: Yaw (Y), Pitch (X), Roll (Z)
            // 1. Yaw around Y
            const cosY = Math.cos(rotY);
            const sinY = Math.sin(rotY);
            const x1 = x * cosY + z * sinY;
            const y1 = y;
            const z1 = -x * sinY + z * cosY;

            // 2. Pitch around X
            const cosX = Math.cos(rotX);
            const sinX = Math.sin(rotX);
            const x2 = x1;
            const y2 = y1 * cosX - z1 * sinX;
            const z2 = y1 * sinX + z1 * cosX;

            // 3. Roll around Z
            const cosZ = Math.cos(rotZ);
            const sinZ = Math.sin(rotZ);
            const x3 = x2 * cosZ - y2 * sinZ;
            const y3 = x2 * sinZ + y2 * cosZ;
            const z3 = z2;

            // Perspective divide
            const f = focal / (focal + z3 + 300);
            return {
                x: originX + x3 * f,
                y: originY + y3 * f,
                z: z3,
                scale: f
            };
        }

        // Simulated LiDAR Point Cloud (Ground obstacles & target range echoes)
        const lidarPoints = [];
        for (let i = 0; i < 40; i++) {
            const angle = (i / 40) * Math.PI * 2;
            const dist = 70 + (i % 5) * 18;
            lidarPoints.push({
                x: Math.cos(angle) * dist,
                y: 55 + Math.sin(i * 3) * 6,
                z: Math.sin(angle) * dist
            });
        }

        function renderDroneHUD() {
            time += 0.03;
            rotorAngle += 0.45;
            lidarScanAngle += 0.05;

            // Autonomous Yaw Rotation
            targetRotY += autoYawSpeed;

            // Smooth Lerp Towards Target Angles
            rotX += (targetRotX - rotX) * 0.08;
            rotY += (targetRotY - rotY) * 0.08;
            rotZ += (targetRotZ - rotZ) * 0.08;

            // Update Telemetry Readouts
            const pitchDeg = (rotX * 180 / Math.PI) - 14.3;
            const rollDeg = (rotZ * 180 / Math.PI);
            const altitudeM = (12.4 + Math.sin(time * 1.5) * 0.35).toFixed(1);

            if (dronePitchEl) dronePitchEl.textContent = (pitchDeg >= 0 ? '+' : '') + pitchDeg.toFixed(1) + '°';
            if (droneRollEl) droneRollEl.textContent = (rollDeg >= 0 ? '+' : '') + rollDeg.toFixed(1) + '°';
            if (droneAltEl) droneAltEl.textContent = altitudeM + 'm';

            ctx.clearRect(0, 0, width, height);

            const originX = width / 2;
            // Bobbing hover vibration
            const originY = height / 2 + Math.sin(time * 2) * 5;
            const focal = Math.min(width, height) * 1.4;

            // ── 1. DRAW RADAR GROUND GRID & LIDAR SCAN ──
            ctx.lineWidth = 0.5;
            for (let r = 40; r <= 130; r += 30) {
                ctx.beginPath();
                for (let a = 0; a <= Math.PI * 2; a += 0.25) {
                    const gx = Math.cos(a) * r;
                    const gy = 55;
                    const gz = Math.sin(a) * r;
                    const p = project3D(gx, gy, gz, originX, originY, focal);
                    if (a === 0) ctx.moveTo(p.x, p.y);
                    else ctx.lineTo(p.x, p.y);
                }
                ctx.closePath();
                ctx.strokeStyle = 'rgba(0, 242, 254, 0.12)';
                ctx.stroke();
            }

            // LiDAR Point Cloud
            for (let i = 0; i < lidarPoints.length; i++) {
                const lp = lidarPoints[i];
                const p = project3D(lp.x, lp.y, lp.z, originX, originY, focal);
                ctx.beginPath();
                ctx.arc(p.x, p.y, Math.max(1, 2 * p.scale), 0, Math.PI * 2);
                ctx.fillStyle = (i % 7 === 0) ? 'rgba(99, 102, 241, 0.65)' : 'rgba(0, 242, 254, 0.35)';
                ctx.fill();
            }

            // LiDAR Rotating Sweep Cone
            const scanDist = 120;
            const scanX = Math.cos(lidarScanAngle) * scanDist;
            const scanZ = Math.sin(lidarScanAngle) * scanDist;
            const centerBase = project3D(0, 15, 0, originX, originY, focal);
            const scanTarget = project3D(scanX, 55, scanZ, originX, originY, focal);

            ctx.beginPath();
            ctx.moveTo(centerBase.x, centerBase.y);
            ctx.lineTo(scanTarget.x, scanTarget.y);
            ctx.strokeStyle = 'rgba(0, 242, 254, 0.4)';
            ctx.lineWidth = 1;
            ctx.stroke();

            // ── 2. DRONE CENTRAL FUSELAGE (3D Wireframe Hub) ──
            const bodySize = 22;
            const bodyH = 9;
            const bodyVerts = [
                { x: -bodySize, y: -bodyH, z: -bodySize },
                { x: bodySize, y: -bodyH, z: -bodySize },
                { x: bodySize, y: -bodyH, z: bodySize },
                { x: -bodySize, y: -bodyH, z: bodySize },
                { x: -bodySize, y: bodyH, z: -bodySize },
                { x: bodySize, y: bodyH, z: -bodySize },
                { x: bodySize, y: bodyH, z: bodySize },
                { x: -bodySize, y: bodyH, z: bodySize }
            ].map(v => project3D(v.x, v.y, v.z, originX, originY, focal));

            const bodyEdges = [
                [0,1], [1,2], [2,3], [3,0], // Top
                [4,5], [5,6], [6,7], [7,4], // Bottom
                [0,4], [1,5], [2,6], [3,7]  // Vertical Struts
            ];

            ctx.lineWidth = 1.2;
            ctx.strokeStyle = '#00f2fe';
            bodyEdges.forEach(([i, j]) => {
                ctx.beginPath();
                ctx.moveTo(bodyVerts[i].x, bodyVerts[i].y);
                ctx.lineTo(bodyVerts[j].x, bodyVerts[j].y);
                ctx.stroke();
            });

            // Avionics Core Glow
            const coreCenter = project3D(0, 0, 0, originX, originY, focal);
            ctx.beginPath();
            ctx.arc(coreCenter.x, coreCenter.y, 4 * coreCenter.scale, 0, Math.PI * 2);
            ctx.fillStyle = '#00f2fe';
            ctx.shadowColor = '#00f2fe';
            ctx.shadowBlur = 10;
            ctx.fill();
            ctx.shadowBlur = 0; // Reset

            // ── 3. 4 MOTOR ARMS & PROPELLERS (X-Configuration) ──
            const armSpan = 56;
            const motors = [
                { x: -armSpan, y: -2, z: -armSpan, name: 'FL' },
                { x: armSpan, y: -2, z: -armSpan, name: 'FR' },
                { x: armSpan, y: -2, z: armSpan, name: 'RR' },
                { x: -armSpan, y: -2, z: armSpan, name: 'RL' }
            ];

            motors.forEach((m, idx) => {
                const armStart = project3D(m.x * 0.3, 0, m.z * 0.3, originX, originY, focal);
                const armEnd = project3D(m.x, m.y, m.z, originX, originY, focal);

                // Arm Tube
                ctx.beginPath();
                ctx.moveTo(armStart.x, armStart.y);
                ctx.lineTo(armEnd.x, armEnd.y);
                ctx.strokeStyle = 'rgba(99, 102, 241, 0.85)';
                ctx.lineWidth = 1.6;
                ctx.stroke();

                // Motor Pod Cylinder
                const podTop = project3D(m.x, m.y - 7, m.z, originX, originY, focal);
                const podBottom = project3D(m.x, m.y + 4, m.z, originX, originY, focal);
                ctx.beginPath();
                ctx.moveTo(podTop.x, podTop.y);
                ctx.lineTo(podBottom.x, podBottom.y);
                ctx.strokeStyle = '#00f2fe';
                ctx.lineWidth = 2.5;
                ctx.stroke();

                // Spinning Propeller Disc / Rotor
                const propR = 26;
                const dir = (idx % 2 === 0) ? 1 : -1;
                const curPropA = (rotorAngle * dir) + (idx * Math.PI / 2);

                const blade1 = project3D(m.x + Math.cos(curPropA) * propR, m.y - 8, m.z + Math.sin(curPropA) * propR, originX, originY, focal);
                const blade2 = project3D(m.x - Math.cos(curPropA) * propR, m.y - 8, m.z - Math.sin(curPropA) * propR, originX, originY, focal);

                // Propeller Blade
                ctx.beginPath();
                ctx.moveTo(blade1.x, blade1.y);
                ctx.lineTo(blade2.x, blade2.y);
                ctx.strokeStyle = '#ffffff';
                ctx.lineWidth = 1.8;
                ctx.stroke();

                // Rotor Guard Sweep Disc
                ctx.beginPath();
                for (let a = 0; a <= Math.PI * 2; a += 0.4) {
                    const gx = m.x + Math.cos(a) * propR;
                    const gy = m.y - 8;
                    const gz = m.z + Math.sin(a) * propR;
                    const p = project3D(gx, gy, gz, originX, originY, focal);
                    if (a === 0) ctx.moveTo(p.x, p.y);
                    else ctx.lineTo(p.x, p.y);
                }
                ctx.closePath();
                ctx.strokeStyle = 'rgba(0, 242, 254, 0.2)';
                ctx.lineWidth = 0.6;
                ctx.stroke();
            });

            // ── 4. FORWARD ORIENTATION ARROW (Heading Vector) ──
            const noseBase = project3D(0, -bodyH, -bodySize, originX, originY, focal);
            const noseTip = project3D(0, -bodyH, -bodySize - 22, originX, originY, focal);
            ctx.beginPath();
            ctx.moveTo(noseBase.x, noseBase.y);
            ctx.lineTo(noseTip.x, noseTip.y);
            ctx.strokeStyle = '#00f2fe';
            ctx.lineWidth = 2;
            ctx.stroke();

            // Arrowhead
            const arrowL = project3D(-6, -bodyH, -bodySize - 14, originX, originY, focal);
            const arrowR = project3D(6, -bodyH, -bodySize - 14, originX, originY, focal);
            ctx.beginPath();
            ctx.moveTo(arrowL.x, arrowL.y);
            ctx.lineTo(noseTip.x, noseTip.y);
            ctx.lineTo(arrowR.x, arrowR.y);
            ctx.strokeStyle = '#00f2fe';
            ctx.lineWidth = 1.4;
            ctx.stroke();

            // ── 5. OPTICAL GIMBAL / LIDAR SENSOR TURRET ──
            const gimbalMount = project3D(0, bodyH, 0, originX, originY, focal);
            const gimbalTurret = project3D(0, bodyH + 10, 0, originX, originY, focal);
            ctx.beginPath();
            ctx.moveTo(gimbalMount.x, gimbalMount.y);
            ctx.lineTo(gimbalTurret.x, gimbalTurret.y);
            ctx.strokeStyle = '#818cf8';
            ctx.lineWidth = 2;
            ctx.stroke();

            ctx.beginPath();
            ctx.arc(gimbalTurret.x, gimbalTurret.y, 3 * gimbalTurret.scale, 0, Math.PI * 2);
            ctx.fillStyle = '#6366f1';
            ctx.fill();

            animId = requestAnimationFrame(renderDroneHUD);
        }

        // Debounced Resize
        let resizeTimer;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(() => {
                resizeDroneCanvas();
            }, 150);
        }, { passive: true });

        // Reduced Motion Check
        const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
        if (!reduceMotion.matches) {
            renderDroneHUD();
        }

        reduceMotion.addEventListener('change', (e) => {
            if (e.matches) {
                if (animId) cancelAnimationFrame(animId);
                ctx.clearRect(0, 0, width, height);
            } else {
                resizeDroneCanvas();
                renderDroneHUD();
            }
        });
    }

    // ── 4. CARD SPOTLIGHT & 3D PERSPECTIVE TILT (Desktop Only) ──
    const isDesktopPointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

    if (isDesktopPointer) {
        const spotlightCards = document.querySelectorAll(
            '.project-card, .pillar-card, .hero-telemetry-tile, .research-card, .ps-card, .hobby-card, .contact-card'
        );

        spotlightCards.forEach(card => {
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;

                card.style.setProperty('--mouse-x', `${x}px`);
                card.style.setProperty('--mouse-y', `${y}px`);

                // 3D Perspective Tilt on Project & Pillar Cards
                if (card.classList.contains('project-card') || card.classList.contains('pillar-card')) {
                    const centerX = rect.width / 2;
                    const centerY = rect.height / 2;
                    const rotateX = ((y - centerY) / centerY) * -5; // Max 5deg
                    const rotateY = ((x - centerX) / centerX) * 5;

                    requestAnimationFrame(() => {
                        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
                    });
                }
            });

            card.addEventListener('mouseleave', () => {
                if (card.classList.contains('project-card') || card.classList.contains('pillar-card')) {
                    requestAnimationFrame(() => {
                        card.style.transform = '';
                        card.style.transition = 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)';
                        setTimeout(() => {
                            card.style.transition = '';
                        }, 400);
                    });
                }
            });
        });
    }

    // ── 5. NUMERICAL TELEMETRY COUNTER INTERPOLATION ──
    const counterElements = document.querySelectorAll('[data-count]');

    function runCounter(el) {
        const target = parseFloat(el.getAttribute('data-count')) || 0;
        const suffix = el.getAttribute('data-suffix') || '';
        const duration = 1200; // 1.2s duration
        const startTime = performance.now();

        function step(now) {
            const elapsed = now - startTime;
            const progress = Math.min(elapsed / duration, 1);
            // Ease-out cubic
            const eased = 1 - Math.pow(1 - progress, 3);
            const current = Math.round(eased * target);

            el.textContent = current + suffix;

            if (progress < 1) {
                requestAnimationFrame(step);
            } else {
                el.textContent = target + suffix;
            }
        }

        requestAnimationFrame(step);
    }

    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                runCounter(entry.target);
                counterObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.15 });

    counterElements.forEach(el => counterObserver.observe(el));

    // ── 6. TERMINAL HUD TYPEWRITER (manifest.sh) ──
    const terminalTyped = document.getElementById('terminalTyped');
    const terminalBody = document.getElementById('terminalBody');
    let terminalStarted = false;

    const manifestCommands = [
        'cat systems_manifest.json',
        'yolo benchmark --weights yolov12n.pt',
        './deploy_resqtech_command.sh',
        'cat systems_manifest.json'
    ];

    async function runTerminalSequence() {
        if (!terminalTyped || terminalStarted) return;
        terminalStarted = true;

        for (let cmdIdx = 0; cmdIdx < manifestCommands.length; cmdIdx++) {
            const cmd = manifestCommands[cmdIdx];
            terminalTyped.textContent = '';

            for (let i = 0; i < cmd.length; i++) {
                await new Promise(r => setTimeout(r, 40));
                terminalTyped.textContent += cmd[i];
            }

            if (cmdIdx < manifestCommands.length - 1) {
                await new Promise(r => setTimeout(r, 1400));
            }
        }
    }

    if (terminalBody) {
        const termObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !terminalStarted) {
                    runTerminalSequence();
                    termObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.2 });

        termObserver.observe(terminalBody);
    }

    // ── 7. COPY DOSSIER & KEYBOARD SHORTCUTS ([C] key) ──
    const copyDossierBtn = document.getElementById('copyDossierBtn');
    const toastEl = document.getElementById('systemToast');
    const toastMsg = document.getElementById('toastMessage');
    let toastTimeout = null;

    function showToast(msg) {
        if (!toastEl) return;
        if (toastMsg) toastMsg.textContent = msg;
        toastEl.classList.add('show');
        clearTimeout(toastTimeout);
        toastTimeout = setTimeout(() => {
            toastEl.classList.remove('show');
        }, 2800);
    }

    function executeCopyDossier() {
        const dossierPayload = `=== FOWAD ABRAR — ENGINEERING DOSSIER ===
Role: Junior Frontend Software Engineer | Autonomous Systems & ML
Education: B.Sc. in CSE, United International University (Final Year)
Experience: Junior Frontend Software Engineer at Fazesoft
Research: 6 Publications (YOLOv12 UAV Flood Rescue, Assistive Vision ML, Dual-Microcontroller IoT)
Production: Shohay (shohay-bd.vercel.app), HomeNet BD (homenetbd.com)
Core Stack: React 19, TypeScript, ROS2, PX4, Python, YOLOv12, PyTorch, C/C++, ESP32/Arduino, Fusion 360
GitHub: https://github.com/sodium10
LinkedIn: https://www.linkedin.com/in/fowad-morshed-10112oo2/
Email: fowadabrar@gmail.com
Status: Open for Software Engineering, ML & Autonomous Systems Roles`;

        navigator.clipboard.writeText(dossierPayload).then(() => {
            showToast('✓ Engineering Dossier Copied to Clipboard');
        }).catch(() => {
            showToast('System Payload Ready: fowadabrar@gmail.com');
        });
    }

    if (copyDossierBtn) {
        copyDossierBtn.addEventListener('click', executeCopyDossier);
    }

    // Keyboard shortcut handler: 'c' or 'C' triggers copy dossier
    document.addEventListener('keydown', (e) => {
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
        if (e.key === 'c' || e.key === 'C') {
            executeCopyDossier();
        }
    });

    // ── 8. NAVBAR SCROLL EFFECT & ACTIVE LINK HIGHLIGHT ──
    const navbar = document.getElementById('navbar');
    const sections = document.querySelectorAll('.section, .hero');
    const navLinks = document.querySelectorAll('.nav-link:not(.nav-link-cta)');

    function onScroll() {
        const scrollY = window.scrollY;

        if (navbar) {
            if (scrollY > 40) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        }

        const activePos = scrollY + 140;
        sections.forEach(sec => {
            const top = sec.offsetTop;
            const height = sec.offsetHeight;
            const id = sec.getAttribute('id');

            if (activePos >= top && activePos < top + height) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${id}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    // ── 9. MOBILE NAV TOGGLE & ACCESSIBILITY ──
    const navToggle = document.getElementById('navToggle');
    const navLinksContainer = document.getElementById('navLinks');
    const navBackdrop = document.getElementById('navBackdrop');

    function toggleMobileMenu(forceClose = false) {
        if (!navLinksContainer || !navToggle) return;
        const isOpen = forceClose ? false : !navLinksContainer.classList.contains('active');

        navToggle.classList.toggle('active', isOpen);
        navLinksContainer.classList.toggle('active', isOpen);
        if (navBackdrop) navBackdrop.style.display = isOpen ? 'block' : 'none';
        document.body.style.overflow = isOpen ? 'hidden' : '';
        navToggle.setAttribute('aria-expanded', isOpen);
    }

    if (navToggle) {
        navToggle.addEventListener('click', () => toggleMobileMenu());
    }

    if (navBackdrop) {
        navBackdrop.addEventListener('click', () => toggleMobileMenu(true));
    }

    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            if (window.innerWidth <= 768) {
                toggleMobileMenu(true);
            }
        });
    });

    // ── 10. WORKSPACE PROJECT FILTER BAR ──
    const filterBtns = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.projects-grid .project-card');

    if (filterBtns.length > 0 && projectCards.length > 0) {
        filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                filterBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');

                const filter = btn.getAttribute('data-filter');

                projectCards.forEach(card => {
                    const category = card.getAttribute('data-category');
                    if (filter === 'all' || category === filter) {
                        card.classList.remove('filter-hidden');
                        card.style.opacity = '0';
                        card.style.transform = 'translateY(14px)';
                        setTimeout(() => {
                            card.style.transition = 'all 0.35s cubic-bezier(0.16, 1, 0.3, 1)';
                            card.style.opacity = '1';
                            card.style.transform = 'translateY(0)';
                        }, 50);
                    } else {
                        card.classList.add('filter-hidden');
                    }
                });
            });
        });
    }

    // ── 11. PDF RESEARCH VIEWER MODAL ──
    const pdfModal = document.getElementById('pdfModal');
    const pdfModalFrame = document.getElementById('pdfModalFrame');
    const pdfModalTitle = document.getElementById('pdfModalTitle');
    const pdfExternalBtn = document.getElementById('pdfExternalBtn');
    const pdfDownloadBtn = document.getElementById('pdfDownloadBtn');
    const pdfModalClose = document.getElementById('pdfModalClose');
    const pdfModalBackdrop = document.getElementById('pdfModalBackdrop');
    const pdfModalLoading = document.getElementById('pdfModalLoading');
    const openPdfBtns = document.querySelectorAll('.open-pdf-modal-btn');

    function openPdf(url, title) {
        if (!pdfModal || !pdfModalFrame) return;

        if (pdfModalTitle) pdfModalTitle.textContent = title || 'Research Publication';
        if (pdfExternalBtn) pdfExternalBtn.setAttribute('href', url);
        if (pdfDownloadBtn) {
            pdfDownloadBtn.setAttribute('href', url);
            pdfDownloadBtn.setAttribute('download', url.split('/').pop());
        }

        if (pdfModalLoading) pdfModalLoading.classList.remove('hidden');

        pdfModalFrame.src = `${url}#toolbar=1&view=FitH`;
        pdfModalFrame.onload = () => {
            if (pdfModalLoading) pdfModalLoading.classList.add('hidden');
        };

        setTimeout(() => {
            if (pdfModalLoading) pdfModalLoading.classList.add('hidden');
        }, 1500);

        pdfModal.classList.add('active');
        pdfModal.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
    }

    function closePdf() {
        if (!pdfModal) return;
        pdfModal.classList.remove('active');
        pdfModal.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
        if (pdfModalFrame) pdfModalFrame.src = '';
    }

    openPdfBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const url = btn.getAttribute('data-pdf');
            const title = btn.getAttribute('data-title');
            if (url) openPdf(url, title);
        });
    });

    if (pdfModalClose) pdfModalClose.addEventListener('click', closePdf);
    if (pdfModalBackdrop) pdfModalBackdrop.addEventListener('click', closePdf);

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && pdfModal && pdfModal.classList.contains('active')) {
            closePdf();
        }
    });

    // ── 12. AMBIENT CURSOR GLOW ──
    const cursorGlow = document.getElementById('cursorGlow');
    if (cursorGlow && isDesktopPointer) {
        document.addEventListener('mousemove', (e) => {
            requestAnimationFrame(() => {
                cursorGlow.style.left = `${e.clientX}px`;
                cursorGlow.style.top = `${e.clientY}px`;
            });
        });
    }

    // ── 13. SMOOTH ANCHOR LINK SCROLLING ──
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#' || targetId === '') return;
            const targetEl = document.querySelector(targetId);
            if (targetEl) {
                e.preventDefault();
                targetEl.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // ── 14. LIDAR & NEURAL MESH CANVAS BACKGROUND ──
    const canvas = document.getElementById('neuralCanvas');
    const diagFpsEl = document.getElementById('diagFps');

    if (canvas) {
        const ctx = canvas.getContext('2d');
        const dpr = window.devicePixelRatio || 1;
        let particles = [];
        let animId = null;
        let frameCount = 0;
        let fpsTimer = performance.now();

        function getDensity() {
            return window.innerWidth < 768 ? 28 : 75;
        }

        function setupCanvasSize() {
            canvas.width = window.innerWidth * dpr;
            canvas.height = window.innerHeight * dpr;
            canvas.style.width = `${window.innerWidth}px`;
            canvas.style.height = `${window.innerHeight}px`;
            ctx.scale(dpr, dpr);
        }

        function initParticles() {
            const count = getDensity();
            particles = [];
            for (let i = 0; i < count; i++) {
                particles.push({
                    x: Math.random() * window.innerWidth,
                    y: Math.random() * window.innerHeight,
                    vx: (Math.random() - 0.5) * 0.35,
                    vy: (Math.random() - 0.5) * 0.35,
                    radius: Math.random() * 1.5 + 0.6,
                    opacity: Math.random() * 0.45 + 0.15
                });
            }
        }

        function renderMesh(now) {
            ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

            // FPS Diagnostic Calculation
            frameCount++;
            if (now - fpsTimer >= 1000) {
                const currentFps = Math.round((frameCount * 1000) / (now - fpsTimer));
                if (diagFpsEl) diagFpsEl.textContent = currentFps;
                frameCount = 0;
                fpsTimer = now;
            }

            const connectDist = window.innerWidth < 768 ? 95 : 140;

            // Draw Connection Lines
            for (let i = 0; i < particles.length; i++) {
                for (let j = i + 1; j < particles.length; j++) {
                    const dx = particles[i].x - particles[j].x;
                    const dy = particles[i].y - particles[j].y;
                    const dist = Math.sqrt(dx * dx + dy * dy);

                    if (dist < connectDist) {
                        const alpha = (1 - dist / connectDist) * 0.09;
                        ctx.beginPath();
                        ctx.moveTo(particles[i].x, particles[i].y);
                        ctx.lineTo(particles[j].x, particles[j].y);
                        ctx.strokeStyle = `rgba(0, 242, 254, ${alpha})`;
                        ctx.lineWidth = 0.5;
                        ctx.stroke();
                    }
                }
            }

            // Draw Nodes
            for (const p of particles) {
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(0, 242, 254, ${p.opacity})`;
                ctx.fill();

                p.x += p.vx;
                p.y += p.vy;

                // Screen Wrap
                if (p.x < 0) p.x = window.innerWidth;
                if (p.x > window.innerWidth) p.x = 0;
                if (p.y < 0) p.y = window.innerHeight;
                if (p.y > window.innerHeight) p.y = 0;
            }

            animId = requestAnimationFrame(renderMesh);
        }

        // Debounced Resize Handler
        let resizeTimeout;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => {
                if (animId) cancelAnimationFrame(animId);
                setupCanvasSize();
                initParticles();
                renderMesh(performance.now());
            }, 200);
        }, { passive: true });

        // Reduced Motion Check
        const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
        if (!reduceMotion.matches) {
            setupCanvasSize();
            initParticles();
            renderMesh(performance.now());
        }

        reduceMotion.addEventListener('change', (e) => {
            if (e.matches) {
                if (animId) cancelAnimationFrame(animId);
                ctx.clearRect(0, 0, canvas.width, canvas.height);
            } else {
                setupCanvasSize();
                initParticles();
                renderMesh(performance.now());
            }
        });
    }
});
