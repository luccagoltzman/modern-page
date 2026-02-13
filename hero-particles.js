/**
 * Partículas interativas no hero — reagem ao movimento do mouse
 */
(function () {
    'use strict';

    const canvas = document.getElementById('hero-particles');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let width = 0;
    let height = 0;
    let particles = [];
    let mouseX = -1e4;
    let mouseY = -1e4;
    let raf = 0;

    const LIME = 'rgba(184, 255, 60,';
    const PARTICLE_COUNT = 80;
    const MOUSE_RADIUS = 120;
    const REPEL_STRENGTH = 0.08;
    const TITLE_REPEL_STRENGTH = 0.15;
    const TITLE_PADDING = 40;
    const FRICTION = 0.98;
    const BASE_SPEED = 0.08;
    const DRIFT_STRENGTH = 0.012;
    const DRIFT_CHANGE = 0.0003;

    function resize() {
        const hero = canvas.closest('.hero');
        if (!hero) return;
        const rect = hero.getBoundingClientRect();
        const dpr = window.devicePixelRatio || 1;
        width = rect.width;
        height = rect.height;
        canvas.width = width * dpr;
        canvas.height = height * dpr;
        canvas.style.width = width + 'px';
        canvas.style.height = height + 'px';
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        initParticles();
    }

    function initParticles() {
        particles = [];
        for (let i = 0; i < PARTICLE_COUNT; i++) {
            const angle = Math.random() * Math.PI * 2;
            const speed = 0.03 + Math.random() * BASE_SPEED;
            particles.push({
                x: Math.random() * width,
                y: Math.random() * height,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed,
                radius: 1.5 + Math.random() * 2,
                opacity: 0.4 + Math.random() * 0.5,
                driftX: (Math.random() - 0.5) * 2,
                driftY: (Math.random() - 0.5) * 2
            });
        }
    }

    function dist(x1, y1, x2, y2) {
        return Math.hypot(x2 - x1, y2 - y1);
    }

    function getTitleZone() {
        const hero = canvas.closest('.hero');
        if (!hero) return null;
        const title = hero.querySelector('.hero-name');
        if (!title) return null;
        const heroRect = hero.getBoundingClientRect();
        const titleRect = title.getBoundingClientRect();
        const cx = titleRect.left - heroRect.left + titleRect.width / 2;
        const cy = titleRect.top - heroRect.top + titleRect.height / 2;
        const rx = titleRect.width / 2 + TITLE_PADDING;
        const ry = titleRect.height / 2 + TITLE_PADDING;
        return { cx, cy, rx, ry };
    }

    function isInsideEllipse(px, py, cx, cy, rx, ry) {
        return Math.pow((px - cx) / rx, 2) + Math.pow((py - cy) / ry, 2) < 1;
    }

    function update() {
        const titleZone = getTitleZone();
        for (let i = 0; i < particles.length; i++) {
            const p = particles[i];
            const d = dist(p.x, p.y, mouseX, mouseY);
            if (d < MOUSE_RADIUS && d > 0) {
                const force = (MOUSE_RADIUS - d) / MOUSE_RADIUS;
                const angle = Math.atan2(p.y - mouseY, p.x - mouseX);
                p.vx += Math.cos(angle) * force * REPEL_STRENGTH;
                p.vy += Math.sin(angle) * force * REPEL_STRENGTH;
            }
            if (titleZone) {
                const { cx, cy, rx, ry } = titleZone;
                if (isInsideEllipse(p.x, p.y, cx, cy, rx, ry)) {
                    const angle = Math.atan2(p.y - cy, p.x - cx);
                    const dx = (p.x - cx) / rx;
                    const dy = (p.y - cy) / ry;
                    const depth = 1 - Math.sqrt(dx * dx + dy * dy);
                    const force = Math.max(0.06, depth * TITLE_REPEL_STRENGTH);
                    p.vx += Math.cos(angle) * force;
                    p.vy += Math.sin(angle) * force;
                }
            }
            p.vx += p.driftX * DRIFT_STRENGTH;
            p.vy += p.driftY * DRIFT_STRENGTH;
            if (Math.random() < DRIFT_CHANGE) {
                p.driftX += (Math.random() - 0.5) * 0.4;
                p.driftY += (Math.random() - 0.5) * 0.4;
                p.driftX = Math.max(-1, Math.min(1, p.driftX));
                p.driftY = Math.max(-1, Math.min(1, p.driftY));
            }
            p.vx *= FRICTION;
            p.vy *= FRICTION;
            p.x += p.vx;
            p.y += p.vy;
            if (p.x < 0 || p.x > width) p.vx *= -0.8;
            if (p.y < 0 || p.y > height) p.vy *= -0.8;
            p.x = Math.max(0, Math.min(width, p.x));
            p.y = Math.max(0, Math.min(height, p.y));
        }
    }

    function draw() {
        ctx.clearRect(0, 0, width, height);
        for (let i = 0; i < particles.length; i++) {
            const p = particles[i];
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
            ctx.fillStyle = LIME + p.opacity + ')';
            ctx.fill();
        }
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const a = particles[i];
                const b = particles[j];
                const d = dist(a.x, a.y, b.x, b.y);
                if (d < 100) {
                    ctx.beginPath();
                    ctx.moveTo(a.x, a.y);
                    ctx.lineTo(b.x, b.y);
                    ctx.strokeStyle = LIME + (0.15 * (1 - d / 100)) + ')';
                    ctx.lineWidth = 0.5;
                    ctx.stroke();
                }
            }
        }
    }

    function loop() {
        update();
        draw();
        raf = requestAnimationFrame(loop);
    }

    function onMouseMove(e) {
        const hero = canvas.closest('.hero');
        if (!hero) return;
        const rect = hero.getBoundingClientRect();
        mouseX = e.clientX - rect.left;
        mouseY = e.clientY - rect.top;
    }

    function onMouseLeave() {
        mouseX = -1e4;
        mouseY = -1e4;
    }

    function start() {
        if (raf) return;
        resize();
        loop();
    }

    function stop() {
        if (raf) cancelAnimationFrame(raf);
        raf = 0;
    }

    const hero = canvas.closest('.hero');
    if (hero) {
        hero.addEventListener('mousemove', onMouseMove, { passive: true });
        hero.addEventListener('mouseleave', onMouseLeave);
    }
    window.addEventListener('resize', resize);

    const obs = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
            if (entry.isIntersecting) start();
            else stop();
        });
    }, { threshold: 0 });
    obs.observe(canvas);

    if (canvas.getBoundingClientRect().top < window.innerHeight) start();
})();
