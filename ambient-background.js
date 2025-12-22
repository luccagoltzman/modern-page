// Ambient Background Motion - Particles, Gradients, and Liquid Effects
function initAmbientBackground() {
    const particlesContainer = document.getElementById('particles-bg');
    if (!particlesContainer) return;

    // Create floating particles
    const particleCount = 100;
    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'ambient-particle';
        
        const size = Math.random() * 4 + 2;
        particle.style.width = size + 'px';
        particle.style.height = size + 'px';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.top = Math.random() * 100 + '%';
        particle.style.animationDelay = Math.random() * 20 + 's';
        particle.style.animationDuration = (Math.random() * 20 + 10) + 's';
        
        particlesContainer.appendChild(particle);
    }

    // Create gradient orbs
    const orbCount = 5;
    for (let i = 0; i < orbCount; i++) {
        const orb = document.createElement('div');
        orb.className = 'ambient-orb';
        
        const size = Math.random() * 300 + 200;
        orb.style.width = size + 'px';
        orb.style.height = size + 'px';
        orb.style.left = Math.random() * 100 + '%';
        orb.style.top = Math.random() * 100 + '%';
        orb.style.animationDelay = Math.random() * 10 + 's';
        
        // Random gradient colors
        const gradients = [
            'radial-gradient(circle, rgba(0,255,136,0.3) 0%, transparent 70%)',
            'radial-gradient(circle, rgba(0,102,255,0.3) 0%, transparent 70%)',
            'radial-gradient(circle, rgba(255,0,102,0.3) 0%, transparent 70%)',
            'radial-gradient(circle, rgba(255,170,0,0.3) 0%, transparent 70%)'
        ];
        orb.style.background = gradients[Math.floor(Math.random() * gradients.length)];
        
        particlesContainer.appendChild(orb);
    }

    // Liquid flow effect
    const liquidContainer = document.createElement('div');
    liquidContainer.className = 'liquid-container';
    particlesContainer.appendChild(liquidContainer);

    // Create liquid blobs
    const blobCount = 3;
    for (let i = 0; i < blobCount; i++) {
        const blob = document.createElement('div');
        blob.className = 'liquid-blob';
        
        const size = Math.random() * 400 + 300;
        blob.style.width = size + 'px';
        blob.style.height = size + 'px';
        blob.style.left = Math.random() * 100 + '%';
        blob.style.top = Math.random() * 100 + '%';
        blob.style.animationDelay = Math.random() * 5 + 's';
        
        liquidContainer.appendChild(blob);
    }

    // Mouse interaction with particles
    document.addEventListener('mousemove', (e) => {
        const particles = document.querySelectorAll('.ambient-particle');
        const mouseX = e.clientX;
        const mouseY = e.clientY;

        particles.forEach((particle, index) => {
            const rect = particle.getBoundingClientRect();
            const particleX = rect.left + rect.width / 2;
            const particleY = rect.top + rect.height / 2;
            
            const distance = Math.sqrt(
                Math.pow(mouseX - particleX, 2) + 
                Math.pow(mouseY - particleY, 2)
            );

            if (distance < 150) {
                const force = (150 - distance) / 150;
                const angle = Math.atan2(particleY - mouseY, particleX - mouseX);
                const moveX = Math.cos(angle) * force * 20;
                const moveY = Math.sin(angle) * force * 20;

                gsap.to(particle, {
                    x: moveX,
                    y: moveY,
                    duration: 0.3,
                    ease: 'power2.out'
                });
            } else {
                gsap.to(particle, {
                    x: 0,
                    y: 0,
                    duration: 0.5,
                    ease: 'power2.out'
                });
            }
        });
    });

    // Scroll-based intensity
    let scrollIntensity = 0;
    window.addEventListener('scroll', () => {
        scrollIntensity = Math.min(window.pageYOffset / 1000, 1);
        
        const orbs = document.querySelectorAll('.ambient-orb');
        orbs.forEach(orb => {
            orb.style.opacity = 0.2 + scrollIntensity * 0.3;
        });
    });
}

// Initialize on load
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAmbientBackground);
} else {
    initAmbientBackground();
}
