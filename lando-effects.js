/**
 * Efeitos inspirados em landonorris.com
 * - Scroll lock (travar / voltar ao scroll)
 * - Scroll horizontal com GSAP
 * - Menu fullscreen
 * - Reveal on scroll
 * - Barra de progresso horizontal
 */

(function () {
    'use strict';

    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
        return;
    }

    gsap.registerPlugin(ScrollTrigger);

    // ----- Scroll lock -----
    const body = document.body;
    const lockBtn = document.querySelector('.scroll-lock-btn');
    const lockText = document.querySelector('.scroll-lock-text');
    const lockLabel = lockBtn?.getAttribute('data-lock-label') || 'Travar scroll';
    const unlockLabel = lockBtn?.getAttribute('data-unlock-label') || 'Voltar ao scroll';

    if (lockBtn && lockText) {
        lockBtn.addEventListener('click', function () {
            const isLocked = body.classList.toggle('scroll-locked');
            lockBtn.setAttribute('aria-pressed', isLocked);
            lockText.textContent = isLocked ? unlockLabel : lockLabel;
        });
    }

    // ----- Menu -----
    const menuToggle = document.querySelector('.menu-toggle');
    const fullscreenMenu = document.querySelector('.fullscreen-menu');
    const menuLinks = document.querySelectorAll('.fullscreen-menu a');

    if (menuToggle && fullscreenMenu) {
        menuToggle.addEventListener('click', function () {
            const open = fullscreenMenu.classList.toggle('open');
            menuToggle.setAttribute('aria-expanded', open);
            fullscreenMenu.setAttribute('aria-hidden', !open);
            body.style.overflow = open ? 'hidden' : '';
        });

        menuLinks.forEach(function (link) {
            link.addEventListener('click', function () {
                fullscreenMenu.classList.remove('open');
                menuToggle.setAttribute('aria-expanded', 'false');
                fullscreenMenu.setAttribute('aria-hidden', 'true');
                body.style.overflow = '';
            });
        });
    }

    // ----- Header scrolled -----
    const header = document.querySelector('.site-header');
    if (header) {
        window.addEventListener('scroll', function () {
            header.classList.toggle('scrolled', window.scrollY > 80);
        }, { passive: true });
    }

    // ----- Horizontal scroll section -----
    const horizontalSection = document.querySelector('.horizontal-section');
    const horizontalViewport = document.querySelector('.horizontal-viewport');
    const horizontalTrack = document.querySelector('.horizontal-track');
    const progressBar = document.querySelector('.horizontal-progress-bar');

    function setupHorizontalScroll() {
        if (!horizontalSection || !horizontalTrack) return;
        const panels = horizontalTrack.querySelectorAll('.panel');
        const panelCount = panels.length;
        const vw = window.innerWidth;
        const vh = window.innerHeight;
        const totalWidth = panelCount * vw;
        const scrollDistance = totalWidth - vw;
        // Altura da seção = quanto o usuário precisa rolar (1 tela por painel). Só essa área "conta" como scroll; o que fica visível é sempre o .horizontal-viewport (100vh).
        const scrollHeight = panelCount * vh;
        horizontalSection.style.height = scrollHeight + 'px';

        ScrollTrigger.refresh();

        gsap.to(horizontalTrack, {
            x: -scrollDistance,
            ease: 'none',
            scrollTrigger: {
                trigger: horizontalSection,
                start: 'top top',
                end: 'bottom bottom',
                scrub: 1,
                pin: horizontalViewport || true,
                pinSpacing: true
            }
        });

        if (progressBar) {
            ScrollTrigger.create({
                trigger: horizontalSection,
                start: 'top top',
                end: 'bottom bottom',
                onUpdate: function (self) {
                    progressBar.style.width = (self.progress * 100) + '%';
                }
            });
        }
    }

    if (horizontalSection && horizontalTrack) {
        setupHorizontalScroll();
        window.addEventListener('resize', function () {
            ScrollTrigger.getAll().forEach(function (t) {
                if (t.trigger === horizontalSection) t.kill();
            });
            setupHorizontalScroll();
        });
    }

    // ----- Reveal on scroll (não usar em .split-block para a seção sempre visível) -----
    const revealEls = document.querySelectorAll('.message-inner, .strip-inner, .contact-inner, .hero-inner');
    revealEls.forEach(function (el) {
        el.classList.add('reveal-on-scroll');
    });

    const revealObserver = new IntersectionObserver(
        function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add('revealed');
                }
            });
        },
        { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
    );

    document.querySelectorAll('.reveal-on-scroll').forEach(function (el) {
        revealObserver.observe(el);
    });

    // ----- Hero name lines animation -----
    const nameLines = document.querySelectorAll('.hero-name .name-line');
    if (nameLines.length) {
        gsap.fromTo(
            nameLines,
            { opacity: 0, y: 30 },
            {
                opacity: 1,
                y: 0,
                duration: 0.8,
                stagger: 0.12,
                ease: 'power3.out',
                delay: 0.2
            }
        );
    }

    // ----- Stats counter -----
    const statNums = document.querySelectorAll('.stat-num[data-value]');
    const countObserver = new IntersectionObserver(
        function (entries) {
            entries.forEach(function (entry) {
                if (!entry.isIntersecting) return;
                const el = entry.target;
                const target = parseInt(el.getAttribute('data-value'), 10);
                if (isNaN(target) || el.classList.contains('counted')) return;
                el.classList.add('counted');
                gsap.fromTo(
                    el,
                    { textContent: 0 },
                    {
                        textContent: target,
                        duration: 1.5,
                        ease: 'power2.out',
                        snap: { textContent: 1 }
                    }
                );
            });
        },
        { threshold: 0.5 }
    );
    statNums.forEach(function (el) {
        countObserver.observe(el);
    });

    // ----- Message quote words (optional: subtle animation) -----
    const messageQuote = document.querySelector('.message-quote');
    if (messageQuote) {
        ScrollTrigger.create({
            trigger: messageQuote,
            start: 'top 80%',
            onEnter: function () {
                gsap.fromTo(
                    messageQuote.querySelectorAll('strong'),
                    { opacity: 0.5 },
                    { opacity: 1, duration: 0.6, stagger: 0.1 }
                );
            }
        });
    }
})();
