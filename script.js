/* ==========================================
   FOWAD ABRAR — Portfolio JavaScript
   High-Performance Micro-Animations Engine
   ========================================== */

document.addEventListener('DOMContentLoaded', () => {

    // ── Hero Typewriter Effect ──
    const typewriterEl = document.getElementById('typewriter');
    const phrases = [
        'Frontend Systems Engineer',
        'Autonomous Tech & Robotics Enthusiast',
        'AI & Computer Vision Developer',
        'Competitive Problem Solver'
    ];
    let phraseIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typingSpeed = 80;

    function type() {
        const currentPhrase = phrases[phraseIndex];

        if (isDeleting) {
            typewriterEl.textContent = currentPhrase.substring(0, charIndex - 1);
            charIndex--;
            typingSpeed = 40;
        } else {
            typewriterEl.textContent = currentPhrase.substring(0, charIndex + 1);
            charIndex++;
            typingSpeed = 80;
        }

        if (!isDeleting && charIndex === currentPhrase.length) {
            isDeleting = true;
            typingSpeed = 2000; // Pause at end
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            phraseIndex = (phraseIndex + 1) % phrases.length;
            typingSpeed = 400; // Pause before next phrase
        }

        setTimeout(type, typingSpeed);
    }

    type();

    // ── Navbar Scroll Effect ──
    const navbar = document.getElementById('navbar');
    let lastScrollY = 0;

    function handleNavScroll() {
        const scrollY = window.scrollY;

        if (scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        lastScrollY = scrollY;
    }

    window.addEventListener('scroll', handleNavScroll, { passive: true });

    // ── Active Nav Link Highlight ──
    const sections = document.querySelectorAll('.section, .hero');
    const navLinks = document.querySelectorAll('.nav-link:not(.nav-link-cta)');

    function updateActiveNav() {
        const scrollY = window.scrollY + 120;

        sections.forEach(section => {
            const top = section.offsetTop;
            const height = section.offsetHeight;
            const id = section.getAttribute('id');

            if (scrollY >= top && scrollY < top + height) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${id}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }

    window.addEventListener('scroll', updateActiveNav, { passive: true });

    // ── Mobile Nav Toggle & Accessible Overlay ──
    const navToggle = document.getElementById('navToggle');
    const navLinksContainer = document.getElementById('navLinks');
    const navBackdrop = document.getElementById('navBackdrop');

    function toggleMobileNav(forceClose = false) {
        const isOpening = forceClose ? false : !navLinksContainer.classList.contains('active');
        
        navToggle.classList.toggle('active', isOpening);
        navLinksContainer.classList.toggle('active', isOpening);
        if (navBackdrop) {
            navBackdrop.classList.toggle('active', isOpening);
        }
        navToggle.setAttribute('aria-expanded', isOpening ? 'true' : 'false');
        document.body.classList.toggle('nav-open', isOpening);
    }

    if (navToggle && navLinksContainer) {
        navToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            toggleMobileNav();
        });

        // Close on backdrop click
        if (navBackdrop) {
            navBackdrop.addEventListener('click', () => {
                toggleMobileNav(true);
            });
        }

        // Close mobile nav on link click
        navLinksContainer.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                toggleMobileNav(true);
            });
        });

        // Close mobile nav on Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && navLinksContainer.classList.contains('active')) {
                toggleMobileNav(true);
            }
        });
    }

    // ── Old Scroll Animations (Intersection Observer for hero [data-animate]) ──
    const animatedElements = document.querySelectorAll('[data-animate]');

    const observerOptions = {
        root: null,
        rootMargin: '0px 0px -60px 0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const delay = entry.target.getAttribute('data-delay') || 0;
                setTimeout(() => {
                    entry.target.classList.add('visible');
                }, parseInt(delay));
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    animatedElements.forEach(el => observer.observe(el));

    // ══════════════════════════════════════════════════════════════════════
    //  1. SCROLL-TRIGGERED REVEAL ENGINE (data-reveal, zero dependencies)
    // ══════════════════════════════════════════════════════════════════════
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

    // ══════════════════════════════════════════════════════════════════════
    //  2. DESKTOP-ONLY 3D PERSPECTIVE TILT ON PROJECT CARDS
    // ══════════════════════════════════════════════════════════════════════
    if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
        const projectCards = document.querySelectorAll('.project-card');

        projectCards.forEach(card => {
            card.classList.add('tilt-active');

            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;

                const rotateX = ((y - centerY) / centerY) * -6; // Max 6deg
                const rotateY = ((x - centerX) / centerX) * 6;

                requestAnimationFrame(() => {
                    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-6px)`;
                });
            });

            card.addEventListener('mouseleave', () => {
                requestAnimationFrame(() => {
                    card.style.transform = '';
                    card.style.transition = 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)';
                    setTimeout(() => {
                        card.style.transition = '';
                    }, 500);
                });
            });
        });
    }

    // ══════════════════════════════════════════════════════════════════════
    //  3. TELEMETRY COUNTER ANIMATIONS
    // ══════════════════════════════════════════════════════════════════════
    const counterElements = document.querySelectorAll('[data-count]');

    function animateCounter(el) {
        const target = parseInt(el.getAttribute('data-count'), 10);
        const suffix = el.getAttribute('data-suffix') || '';
        const duration = 1200; // 1.2 seconds
        const startTime = performance.now();

        function step(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);

            // Ease-out cubic
            const eased = 1 - Math.pow(1 - progress, 3);
            const currentValue = Math.round(eased * target);

            el.textContent = currentValue + suffix;

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
                animateCounter(entry.target);
                counterObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.15
    });

    counterElements.forEach(el => counterObserver.observe(el));

    // ══════════════════════════════════════════════════════════════════════
    //  3b. TERMINAL HUD TYPEWRITER (manifest.sh)
    // ══════════════════════════════════════════════════════════════════════
    const terminalTyped = document.getElementById('terminalTyped');
    const terminalBody = document.getElementById('terminalBody');
    let terminalStarted = false;

    const terminalCommands = [
        'cat engineering_profile.json',
        'echo "Status: Active"',
        'ping systems.fowad.dev',
        'cat engineering_profile.json'
    ];

    async function typeTerminalCommand(text, el) {
        el.textContent = '';
        for (let i = 0; i < text.length; i++) {
            await new Promise(resolve => setTimeout(resolve, 45));
            el.textContent += text[i];
        }
        await new Promise(resolve => setTimeout(resolve, 1500));
    }

    async function runTerminalLoop() {
        if (terminalStarted) return;
        terminalStarted = true;

        for (let i = 0; i < terminalCommands.length; i++) {
            await typeTerminalCommand(terminalCommands[i], terminalTyped);
        }
        // Final state — keep the last command visible
        terminalTyped.textContent = terminalCommands[terminalCommands.length - 1];
    }

    if (terminalTyped && terminalBody) {
        const terminalObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !terminalStarted) {
                    runTerminalLoop();
                    terminalObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.15 });

        terminalObserver.observe(terminalBody);
    }

    // ── Cursor Glow Effect ──
    const cursorGlow = document.getElementById('cursorGlow');

    document.addEventListener('mousemove', (e) => {
        requestAnimationFrame(() => {
            cursorGlow.style.left = e.clientX + 'px';
            cursorGlow.style.top = e.clientY + 'px';
        });
    });

    // ── Smooth scroll for anchor links ──
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // ── Interactive Project Filter ──
    const filterButtons = document.querySelectorAll('.filter-btn');
    const filterableCards = document.querySelectorAll('.projects-grid .project-card');

    if (filterButtons.length > 0 && filterableCards.length > 0) {
        filterButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                filterButtons.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');

                const filter = btn.getAttribute('data-filter');

                filterableCards.forEach(card => {
                    const category = card.getAttribute('data-category');
                    if (filter === 'all' || category === filter) {
                        card.classList.remove('filter-hidden');
                        card.style.opacity = '0';
                        card.style.transform = 'translateY(12px)';
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

    // ── Research PDF Modal Viewer ──
    const pdfModal = document.getElementById('pdfModal');
    const pdfModalFrame = document.getElementById('pdfModalFrame');
    const pdfModalTitle = document.getElementById('pdfModalTitle');
    const pdfExternalBtn = document.getElementById('pdfExternalBtn');
    const pdfDownloadBtn = document.getElementById('pdfDownloadBtn');
    const pdfModalClose = document.getElementById('pdfModalClose');
    const pdfModalLoading = document.getElementById('pdfModalLoading');
    const openPdfButtons = document.querySelectorAll('.open-pdf-modal-btn');

    function openPdfReader(pdfUrl, title) {
        if (!pdfModal || !pdfModalFrame) return;

        pdfModalTitle.textContent = title || 'Research Paper';
        pdfExternalBtn.setAttribute('href', pdfUrl);
        pdfDownloadBtn.setAttribute('href', pdfUrl);
        pdfDownloadBtn.setAttribute('download', pdfUrl.split('/').pop());

        // Show loading state
        if (pdfModalLoading) {
            pdfModalLoading.classList.remove('hidden');
        }

        // Set iframe source with zoom and toolbar parameters
        pdfModalFrame.src = `${pdfUrl}#toolbar=1&view=FitH`;
        
        pdfModalFrame.onload = () => {
            if (pdfModalLoading) {
                pdfModalLoading.classList.add('hidden');
            }
        };

        // Fallback loading hide after 1.5s
        setTimeout(() => {
            if (pdfModalLoading) {
                pdfModalLoading.classList.add('hidden');
            }
        }, 1500);

        pdfModal.classList.add('active');
        pdfModal.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
    }

    function closePdfReader() {
        if (!pdfModal) return;
        pdfModal.classList.remove('active');
        pdfModal.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
        if (pdfModalFrame) {
            pdfModalFrame.src = '';
        }
    }

    if (openPdfButtons.length > 0) {
        openPdfButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const pdfUrl = btn.getAttribute('data-pdf');
                const title = btn.getAttribute('data-title');
                if (pdfUrl) {
                    openPdfReader(pdfUrl, title);
                }
            });
        });
    }

    if (pdfModalClose) {
        pdfModalClose.addEventListener('click', closePdfReader);
    }

    if (pdfModal) {
        pdfModal.addEventListener('click', (e) => {
            if (e.target === pdfModal) {
                closePdfReader();
            }
        });
    }

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && pdfModal && pdfModal.classList.contains('active')) {
            closePdfReader();
        }
    });

    // ══════════════════════════════════════════════════════════════════════
    //  4. SUBTLE NEURAL/LIDAR CANVAS BACKGROUND
    // ══════════════════════════════════════════════════════════════════════
    const canvas = document.getElementById('neuralCanvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        const dpr = window.devicePixelRatio || 1;
        let particles = [];
        let animFrameId = null;

        function getParticleCount() {
            return window.innerWidth < 768 ? 35 : 90;
        }

        function resizeCanvas() {
            canvas.width = window.innerWidth * dpr;
            canvas.height = window.innerHeight * dpr;
            canvas.style.width = window.innerWidth + 'px';
            canvas.style.height = window.innerHeight + 'px';
            ctx.scale(dpr, dpr);
        }

        function createParticles() {
            const count = getParticleCount();
            particles = [];
            for (let i = 0; i < count; i++) {
                particles.push({
                    x: Math.random() * window.innerWidth,
                    y: Math.random() * window.innerHeight,
                    vx: (Math.random() - 0.5) * 0.3,
                    vy: (Math.random() - 0.5) * 0.3,
                    radius: Math.random() * 1.5 + 0.5,
                    opacity: Math.random() * 0.5 + 0.1
                });
            }
        }

        function drawParticles() {
            ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

            const connectionDistance = window.innerWidth < 768 ? 100 : 150;

            // Draw connections
            for (let i = 0; i < particles.length; i++) {
                for (let j = i + 1; j < particles.length; j++) {
                    const dx = particles[i].x - particles[j].x;
                    const dy = particles[i].y - particles[j].y;
                    const dist = Math.sqrt(dx * dx + dy * dy);

                    if (dist < connectionDistance) {
                        const alpha = (1 - dist / connectionDistance) * 0.12;
                        ctx.beginPath();
                        ctx.moveTo(particles[i].x, particles[i].y);
                        ctx.lineTo(particles[j].x, particles[j].y);
                        ctx.strokeStyle = `rgba(0, 242, 254, ${alpha})`;
                        ctx.lineWidth = 0.5;
                        ctx.stroke();
                    }
                }
            }

            // Draw particles
            for (const p of particles) {
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(56, 189, 248, ${p.opacity})`;
                ctx.fill();

                // Move particle
                p.x += p.vx;
                p.y += p.vy;

                // Wrap around edges
                if (p.x < 0) p.x = window.innerWidth;
                if (p.x > window.innerWidth) p.x = 0;
                if (p.y < 0) p.y = window.innerHeight;
                if (p.y > window.innerHeight) p.y = 0;
            }

            animFrameId = requestAnimationFrame(drawParticles);
        }

        // Debounced resize handler
        let resizeTimer;
        function handleResize() {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(() => {
                if (animFrameId) cancelAnimationFrame(animFrameId);
                resizeCanvas();
                createParticles();
                drawParticles();
            }, 200);
        }

        window.addEventListener('resize', handleResize, { passive: true });

        // Respect reduced motion
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
        if (!prefersReducedMotion.matches) {
            resizeCanvas();
            createParticles();
            drawParticles();
        }

        prefersReducedMotion.addEventListener('change', (e) => {
            if (e.matches) {
                if (animFrameId) cancelAnimationFrame(animFrameId);
                ctx.clearRect(0, 0, canvas.width, canvas.height);
            } else {
                resizeCanvas();
                createParticles();
                drawParticles();
            }
        });
    }

    // ── Initial check for elements already in view ──
    handleNavScroll();
    updateActiveNav();
});
