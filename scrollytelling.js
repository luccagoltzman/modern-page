// Scrollytelling 2.0 - Advanced scroll-based animations
gsap.registerPlugin(ScrollTrigger);

function initScrollytelling() {
    const storySteps = document.querySelectorAll('.story-step');
    const parallaxLayers = document.querySelectorAll('.parallax-layer');

    // Initial setup for story steps - all positioned absolutely
    storySteps.forEach((step, index) => {
        gsap.set(step, {
            position: 'absolute',
            top: '50%',
            left: '50%',
            x: '-50%',
            y: index === 0 ? '-50%' : '-30%',
            opacity: index === 0 ? 1 : 0,
            scale: index === 0 ? 1 : 0.8
        });
    });

    // Parallax layers with different speeds - reduced movement
    parallaxLayers.forEach((layer, index) => {
        const speed = 0.3 + (index * 0.2);
        gsap.to(layer, {
            y: -window.innerHeight * speed * 0.5,
            ease: 'none',
            scrollTrigger: {
                trigger: '.scrollytelling-section',
                start: 'top 80%',
                end: 'bottom 20%',
                scrub: true
            }
        });
    });

    // Cinematic reveal effects - without pin to avoid extra space
    const scrollySection = document.querySelector('.scrollytelling-section');
    if (scrollySection) {
        // Set initial states
        gsap.set('.story-step[data-step="1"]', { opacity: 1, scale: 1 });
        gsap.set('.story-step[data-step="2"]', { opacity: 0, scale: 0.8 });
        gsap.set('.story-step[data-step="3"]', { opacity: 0, scale: 0.8 });

        // Create timeline with scroll-based animation - smoother transitions
        const timeline = gsap.timeline({
            scrollTrigger: {
                trigger: scrollySection,
                start: 'top 70%',
                end: 'bottom 30%',
                scrub: 1,
                markers: false
            }
        });
        
        timeline
        .to('.story-step[data-step="1"]', 
            { opacity: 0, scale: 0.8, y: -50, duration: 0.4 },
            0
        )
        .to('.story-step[data-step="2"]',
            { opacity: 1, scale: 1, y: 0, duration: 0.4 },
            0.2
        )
        .to('.story-step[data-step="2"]',
            { opacity: 0, scale: 0.8, y: 50, duration: 0.4 },
            0.6
        )
        .to('.story-step[data-step="3"]',
            { opacity: 1, scale: 1, y: 0, duration: 0.4 },
            0.8
        );
    }

    // Text reveal on scroll
    const textElements = document.querySelectorAll('.story-text');
    textElements.forEach(text => {
        const chars = text.textContent.split('');
        text.textContent = '';
        chars.forEach((char, i) => {
            const span = document.createElement('span');
            span.textContent = char === ' ' ? '\u00A0' : char;
            span.style.opacity = '0';
            span.style.display = 'inline-block';
            text.appendChild(span);

            gsap.to(span, {
                opacity: 1,
                y: 0,
                duration: 0.05,
                delay: i * 0.02,
                scrollTrigger: {
                    trigger: text,
                    start: 'top 80%',
                    toggleActions: 'play none none none'
                }
            });
        });
    });
}

// Initialize when GSAP is ready
function checkGSAP() {
    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', initScrollytelling);
        } else {
            initScrollytelling();
        }
    } else {
        setTimeout(checkGSAP, 100);
    }
}

checkGSAP();
