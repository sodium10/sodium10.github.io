/* ==========================================================================
   FOWAD ABRAR — AUTONOMOUS SYSTEMS & MACHINE LEARNING CONSOLE
   High-Performance Animation, Telemetry & Interaction Engine
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

    // ── 1. HERO ROLE CYCLER (Typewriter) ──
    const typewriterEl = document.getElementById('typewriter');
    const rolePhrases = [
        'Frontend Systems // Vision & Autonomous Robotics',
        'Machine Learning // YOLOv12 Research',
        'Cyber-Physical Systems & Embedded Telemetry',
        'Competitive Algorithmic Solves (100+)',
        'React 19, TypeScript & High-Performance UI'
    ];
    let phraseIdx = 0;
    let charIdx = 0;
    let isDeleting = false;
    let typeSpeed = 70;

    function typeRole() {
        if (!typewriterEl) return;
        const current = rolePhrases[phraseIdx];

        if (isDeleting) {
            typewriterEl.textContent = current.substring(0, charIdx - 1);
            charIdx--;
            typeSpeed = 35;
        } else {
            typewriterEl.textContent = current.substring(0, charIdx + 1);
            charIdx++;
            typeSpeed = 70;
        }

        if (!isDeleting && charIdx === current.length) {
            isDeleting = true;
            typeSpeed = 2200; // Pause at completion
        } else if (isDeleting && charIdx === 0) {
            isDeleting = false;
            phraseIdx = (phraseIdx + 1) % rolePhrases.length;
            typeSpeed = 350; // Pause before next
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

    // ── 3. CARD SPOTLIGHT & 3D PERSPECTIVE TILT (Desktop Only) ──
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

    // ── 4. NUMERICAL TELEMETRY COUNTER INTERPOLATION ──
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

    // ── 5. TERMINAL HUD TYPEWRITER (manifest.sh) ──
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

    // ── 6. COPY DOSSIER & KEYBOARD SHORTCUTS ([C] key) ──
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
Role: Frontend Systems & Autonomous Tech Engineer
Education: B.Sc. in CSE, United International University (Final Year)
Experience: Frontend Developer Intern at Fazesoft
Research: 6 Publications (YOLOv12 UAV Flood Rescue, Assistive Vision ML, IoT Smart Systems)
Production: Shohay (shohay-bd.vercel.app), HomeNet BD (homenetbd.com)
Core Stack: React 19, TypeScript, Next.js, Python, YOLOv12, PyTorch, C/C++, ESP32/Arduino
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

    // ── 7. NAVBAR SCROLL EFFECT & ACTIVE LINK HIGHLIGHT ──
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

    // ── 8. MOBILE NAV TOGGLE & ACCESSIBILITY ──
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

    // ── 9. WORKSPACE PROJECT FILTER BAR ──
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

    // ── 10. PDF RESEARCH VIEWER MODAL ──
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

    // ── 11. AMBIENT CURSOR GLOW ──
    const cursorGlow = document.getElementById('cursorGlow');
    if (cursorGlow && isDesktopPointer) {
        document.addEventListener('mousemove', (e) => {
            requestAnimationFrame(() => {
                cursorGlow.style.left = `${e.clientX}px`;
                cursorGlow.style.top = `${e.clientY}px`;
            });
        });
    }

    // ── 12. SMOOTH ANCHOR LINK SCROLLING ──
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

    // ── 13. LIDAR & NEURAL MESH CANVAS ENGINE ──
    const canvas = document.getElementById('neuralCanvas');
    const diagFpsEl = document.getElementById('diagFps');

    if (canvas) {
        const ctx = canvas.getContext('2d');
        const dpr = window.devicePixelRatio || 1;
        let particles = [];
        let animId = null;
        let lastFrameTime = performance.now();
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
