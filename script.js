// Modern Page — script mínimo (efeitos em lando-effects.js)

(function () {
    'use strict';

    const header = document.querySelector('.site-header');

    // Smooth scroll para âncoras
    document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href === '#') return;
            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                const top = target.getBoundingClientRect().top + window.pageYOffset;
                const offset = header ? header.offsetHeight : 0;
                window.scrollTo({ top: top - offset, behavior: 'smooth' });
            }
        });
    });

    // Formulário de contato
    const form = document.querySelector('.contact-form');
    if (form) {
        form.addEventListener('submit', function (e) {
            e.preventDefault();
            var btn = form.querySelector('.btn-submit');
            var text = btn ? btn.textContent : '';
            if (btn) {
                btn.textContent = 'Enviado';
                btn.disabled = true;
            }
            // Aqui você pode enviar para um backend
            setTimeout(function () {
                if (btn) {
                    btn.textContent = text;
                    btn.disabled = false;
                }
                form.reset();
            }, 3000);
        });
    }
})();
