/* ==========================================
   FOWAD ABRAR — Portfolio JavaScript
   Handles animations, interactions & effects
   ========================================== */

document.addEventListener('DOMContentLoaded', () => {

    // ── Typewriter Effect ──
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

    // ── Scroll Animations (Intersection Observer) ──
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
    const projectCards = document.querySelectorAll('.projects-grid .project-card');

    if (filterButtons.length > 0 && projectCards.length > 0) {
        filterButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                filterButtons.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');

                const filter = btn.getAttribute('data-filter');

                projectCards.forEach(card => {
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

    // ── Initial check for elements already in view ──
    handleNavScroll();
    updateActiveNav();
});
