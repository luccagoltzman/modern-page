// Expressive Typography Animations
gsap.registerPlugin(ScrollTrigger);

function initTypographyAnimations() {
    // Animated text with letter-by-letter reveal
    const animatedText = document.querySelector('.animated-text');
    if (animatedText) {
        const text = animatedText.getAttribute('data-text') || animatedText.textContent;
        animatedText.textContent = '';
        
        text.split('').forEach((char, i) => {
            const span = document.createElement('span');
            span.textContent = char === ' ' ? '\u00A0' : char;
            span.style.display = 'inline-block';
            animatedText.appendChild(span);

            gsap.fromTo(span,
                { 
                    opacity: 0, 
                    y: 50, 
                    rotationX: -90,
                    transformOrigin: '50% 0%'
                },
                {
                    opacity: 1,
                    y: 0,
                    rotationX: 0,
                    duration: 0.5,
                    delay: i * 0.05,
                    ease: 'back.out(1.7)',
                    scrollTrigger: {
                        trigger: animatedText,
                        start: 'top 80%',
                        toggleActions: 'play none none none'
                    }
                }
            );
        });
    }

    // Text reveal with split effect
    const textReveals = document.querySelectorAll('.text-reveal');
    textReveals.forEach((reveal, index) => {
        const text = reveal.textContent;
        reveal.textContent = '';
        
        const words = text.split(' ');
        words.forEach((word, wordIndex) => {
            const wordSpan = document.createElement('span');
            wordSpan.style.display = 'inline-block';
            wordSpan.style.marginRight = '0.5em';
            
            word.split('').forEach((char, charIndex) => {
                const charSpan = document.createElement('span');
                charSpan.textContent = char;
                charSpan.style.display = 'inline-block';
                charSpan.style.opacity = '0';
                charSpan.style.transform = 'translateY(100%)';
                wordSpan.appendChild(charSpan);

                gsap.to(charSpan, {
                    opacity: 1,
                    y: 0,
                    duration: 0.3,
                    delay: (wordIndex * 0.1) + (charIndex * 0.03),
                    ease: 'power3.out',
                    scrollTrigger: {
                        trigger: reveal,
                        start: 'top 80%',
                        toggleActions: 'play none none none'
                    }
                });
            });
            
            reveal.appendChild(wordSpan);
        });
    });

    // Glitch effect
    const glitchText = document.querySelector('.glitch-text');
    if (glitchText) {
        const text = glitchText.getAttribute('data-text') || glitchText.textContent;
        glitchText.textContent = text;
        
        setInterval(() => {
            if (Math.random() > 0.7) {
                glitchText.classList.add('glitch-active');
                setTimeout(() => {
                    glitchText.classList.remove('glitch-active');
                }, 200);
            }
        }, 2000);

        // Hover glitch
        glitchText.addEventListener('mouseenter', () => {
            glitchText.classList.add('glitch-active');
        });
        glitchText.addEventListener('mouseleave', () => {
            glitchText.classList.remove('glitch-active');
        });
    }

    // Liquid motion text
    const liquidText = document.querySelector('.liquid-text');
    if (liquidText) {
        const text = liquidText.textContent;
        liquidText.textContent = '';
        
        text.split('').forEach((char, i) => {
            const span = document.createElement('span');
            span.textContent = char === ' ' ? '\u00A0' : char;
            span.style.display = 'inline-block';
            liquidText.appendChild(span);

            // Continuous wave animation
            gsap.to(span, {
                y: -10,
                duration: 1 + Math.random(),
                repeat: -1,
                yoyo: true,
                ease: 'sine.inOut',
                delay: i * 0.1
            });

            // Mouse interaction
            liquidText.addEventListener('mousemove', (e) => {
                const rect = liquidText.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const spans = liquidText.querySelectorAll('span');
                
                spans.forEach((span, index) => {
                    const spanRect = span.getBoundingClientRect();
                    const spanCenter = spanRect.left + spanRect.width / 2;
                    const distance = Math.abs(x - spanCenter);
                    const intensity = Math.max(0, 1 - distance / 200);
                    
                    gsap.to(span, {
                        y: -20 * intensity,
                        scale: 1 + intensity * 0.3,
                        duration: 0.3,
                        ease: 'power2.out'
                    });
                });
            });

            liquidText.addEventListener('mouseleave', () => {
                const spans = liquidText.querySelectorAll('span');
                gsap.to(spans, {
                    y: 0,
                    scale: 1,
                    duration: 0.5,
                    ease: 'elastic.out(1, 0.5)'
                });
            });
        });
    }

    // Magnetic text effect
    const magneticElements = document.querySelectorAll('.animated-text, .text-reveal, .glitch-text, .liquid-text');
    magneticElements.forEach(element => {
        element.addEventListener('mousemove', (e) => {
            const rect = element.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            
            gsap.to(element, {
                x: x * 0.1,
                y: y * 0.1,
                duration: 0.5,
                ease: 'power2.out'
            });
        });

        element.addEventListener('mouseleave', () => {
            gsap.to(element, {
                x: 0,
                y: 0,
                duration: 0.5,
                ease: 'elastic.out(1, 0.5)'
            });
        });
    });
}

// Initialize when GSAP is ready
function checkGSAP() {
    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', initTypographyAnimations);
        } else {
            initTypographyAnimations();
        }
    } else {
        setTimeout(checkGSAP, 100);
    }
}

checkGSAP();
