// Navigation Scroll Effect
const nav = document.querySelector('.nav');
let lastScroll = 0;

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll > 100) {
        nav.style.padding = '1rem 0';
        nav.style.background = 'rgba(10, 10, 10, 0.95)';
    } else {
        nav.style.padding = '1.5rem 0';
        nav.style.background = 'rgba(10, 10, 10, 0.8)';
    }
    
    lastScroll = currentScroll;
});

// Smooth Scroll for Navigation Links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const navHeight = nav.offsetHeight;
            const targetPosition = target.offsetTop - navHeight;
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// Intersection Observer for Fade-in Animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, observerOptions);

// Observe all sections and cards
document.querySelectorAll('section, .feature-card, .stat-item, .grid-item').forEach(el => {
    el.classList.add('fade-in');
    observer.observe(el);
});

// Counter Animation for Stats
const animateCounter = (element, target, duration = 2000) => {
    let start = 0;
    const increment = target / (duration / 16);
    const timer = setInterval(() => {
        start += increment;
        if (start >= target) {
            element.textContent = target + (element.dataset.target.includes('%') ? '%' : '+');
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(start) + (element.dataset.target.includes('%') ? '%' : '+');
        }
    }, 16);
};

const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting && !entry.target.classList.contains('counted')) {
            const statNumber = entry.target.querySelector('.stat-number');
            const target = parseInt(statNumber.dataset.target);
            animateCounter(statNumber, target);
            entry.target.classList.add('counted');
        }
    });
}, { threshold: 0.5 });

document.querySelectorAll('.stat-item').forEach(stat => {
    statsObserver.observe(stat);
});

// Advanced Parallax Effects
let scrollY = 0;
window.addEventListener('scroll', () => {
    scrollY = window.pageYOffset;
    const scrolled = window.pageYOffset;
    const orbs = document.querySelectorAll('.gradient-orb');
    
    orbs.forEach((orb, index) => {
        const speed = 0.3 + (index * 0.1);
        const yPos = -(scrolled * speed);
        // Store base transform for mouse parallax
        orb.dataset.baseY = yPos;
    });
});

// Mouse Parallax Effect
let mouseX = 0;
let mouseY = 0;

document.addEventListener('mousemove', (e) => {
    mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
    mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
    
    // Apply parallax to hero orbs based on mouse position
    document.querySelectorAll('.gradient-orb').forEach((orb, index) => {
        const intensity = 30 + (index * 20);
        const x = mouseX * intensity;
        const y = mouseY * intensity;
        const baseY = orb.dataset.baseY || 0;
        orb.style.transform = `translateY(${baseY}px) translate(${x}px, ${y}px)`;
    });
    
    // Parallax for feature cards (only when hovering)
    document.querySelectorAll('.feature-card').forEach((card, index) => {
        const rect = card.getBoundingClientRect();
        const isHovering = e.clientX >= rect.left && e.clientX <= rect.right && 
                          e.clientY >= rect.top && e.clientY <= rect.bottom;
        
        if (isHovering && rect.top < window.innerHeight && rect.bottom > 0) {
            const cardCenterX = rect.left + rect.width / 2;
            const cardCenterY = rect.top + rect.height / 2;
            const deltaX = (e.clientX - cardCenterX) / rect.width;
            const deltaY = (e.clientY - cardCenterY) / rect.height;
            
            card.style.transform = `perspective(1000px) rotateY(${deltaX * 5}deg) rotateX(${-deltaY * 5}deg) translateZ(20px)`;
        }
    });
    
    // Parallax for showcase grid
    document.querySelectorAll('.grid-item').forEach((item, index) => {
        const rect = item.getBoundingClientRect();
        const itemCenterX = rect.left + rect.width / 2;
        const itemCenterY = rect.top + rect.height / 2;
        const deltaX = (e.clientX - itemCenterX) / window.innerWidth;
        const deltaY = (e.clientY - itemCenterY) / window.innerHeight;
        
        if (rect.top < window.innerHeight && rect.bottom > 0) {
            const intensity = 10;
            item.style.transform = `translate(${deltaX * intensity}px, ${deltaY * intensity}px) scale(1)`;
        }
    });
});

// Mobile Menu Toggle
const navToggle = document.querySelector('.nav-toggle');
const navLinks = document.querySelector('.nav-links');

if (navToggle) {
    navToggle.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        navToggle.classList.toggle('active');
    });
}

// Form Submission
const contactForm = document.querySelector('.contact-form');
if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Get form data
        const formData = new FormData(contactForm);
        const data = Object.fromEntries(formData);
        
        // Here you would normally send the data to a server
        console.log('Form submitted:', data);
        
        // Show success message
        const submitButton = contactForm.querySelector('button[type="submit"]');
        const originalText = submitButton.textContent;
        submitButton.textContent = 'Enviado! ✓';
        submitButton.style.background = 'var(--gradient-1)';
        submitButton.disabled = true;
        
        // Reset form
        contactForm.reset();
        
        // Reset button after 3 seconds
        setTimeout(() => {
            submitButton.textContent = originalText;
            submitButton.style.background = '';
            submitButton.disabled = false;
        }, 3000);
    });
}

// Advanced Custom Cursor
let cursor = null;
let cursorFollower = null;
let cursorText = null;

const createCursor = () => {
    // Only create cursor on desktop
    if (window.innerWidth <= 768) return;
    
    cursor = document.createElement('div');
    cursor.className = 'custom-cursor';
    cursorFollower = document.createElement('div');
    cursorFollower.className = 'cursor-follower';
    cursorText = document.createElement('div');
    cursorText.className = 'cursor-text';
    
    document.body.appendChild(cursor);
    document.body.appendChild(cursorFollower);
    document.body.appendChild(cursorText);
    
    // Inicializar posição do cursor no centro da tela
    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let followerX = mouseX;
    let followerY = mouseY;
    
    // Posicionar cursor inicialmente
    cursor.style.transform = `translate(${mouseX}px, ${mouseY}px) translate(-50%, -50%)`;
    cursorFollower.style.transform = `translate(${followerX}px, ${followerY}px) translate(-50%, -50%)`;
    cursorText.style.transform = `translate(${followerX}px, ${followerY}px) translate(-50%, -50%)`;
    
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        
        // Usar transform para melhor performance
        cursor.style.transform = `translate(${mouseX}px, ${mouseY}px) translate(-50%, -50%)`;
    });
    
    const animateFollower = () => {
        // Velocidade aumentada para 0.5 - movimento mais rápido e responsivo
        followerX += (mouseX - followerX) * 0.5;
        followerY += (mouseY - followerY) * 0.5;
        
        // Usar transform para melhor performance
        cursorFollower.style.transform = `translate(${followerX}px, ${followerY}px) translate(-50%, -50%)`;
        
        // Atualizar posição do texto também
        cursorText.style.transform = `translate(${followerX}px, ${followerY}px) translate(-50%, -50%)`;
        
        requestAnimationFrame(animateFollower);
    };
    
    animateFollower();
    
    // Hide default cursor
    document.body.style.cursor = 'none';
    
    // Hover effects for different elements
    const interactiveElements = document.querySelectorAll('a, button, .btn, .feature-card, .stat-item, .grid-item, .nav-link');
    
    interactiveElements.forEach(el => {
        el.addEventListener('mouseenter', () => {
            cursor.classList.add('hover');
            cursorFollower.classList.add('hover');
            
            // Special text for buttons
            if (el.classList.contains('btn') || el.tagName === 'BUTTON') {
                cursorText.textContent = 'Click';
                cursorText.style.opacity = '1';
            }
        });
        
        el.addEventListener('mouseleave', () => {
            cursor.classList.remove('hover');
            cursorFollower.classList.remove('hover');
            cursorText.style.opacity = '0';
        });
    });
    
    // Special hover for feature cards
    document.querySelectorAll('.feature-card').forEach(card => {
        card.addEventListener('mouseenter', () => {
            cursorFollower.classList.add('card-hover');
        });
        card.addEventListener('mouseleave', () => {
            cursorFollower.classList.remove('card-hover');
        });
    });
    
    // Text hover for links
    document.querySelectorAll('a').forEach(link => {
        link.addEventListener('mouseenter', () => {
            if (link.textContent.trim().length < 20) {
                cursorText.textContent = link.textContent.trim();
                cursorText.style.opacity = '1';
            }
        });
        link.addEventListener('mouseleave', () => {
            cursorText.style.opacity = '0';
        });
    });
};

// Initialize cursor
createCursor();

// Add custom cursor styles
const cursorStyle = document.createElement('style');
cursorStyle.textContent = `
    .custom-cursor {
        width: 8px;
        height: 8px;
        border-radius: 50%;
        background: var(--primary-color);
        position: fixed;
        pointer-events: none;
        z-index: 9999;
        left: 0;
        top: 0;
        transition: width 0.2s ease, height 0.2s ease;
        mix-blend-mode: difference;
        will-change: transform;
    }
    .custom-cursor.hover {
        width: 0;
        height: 0;
    }
    .cursor-follower {
        width: 40px;
        height: 40px;
        border: 2px solid var(--primary-color);
        border-radius: 50%;
        position: fixed;
        pointer-events: none;
        z-index: 9998;
        left: 0;
        top: 0;
        opacity: 0.6;
        transition: width 0.2s ease, height 0.2s ease, opacity 0.2s ease, border-width 0.2s ease, border-color 0.2s ease;
        mix-blend-mode: difference;
        will-change: transform;
    }
    .cursor-follower.hover {
        width: 60px;
        height: 60px;
        opacity: 0.8;
        border-width: 1px;
    }
    .cursor-follower.card-hover {
        width: 80px;
        height: 80px;
        border-color: var(--secondary-color);
    }
    .cursor-text {
        position: fixed;
        pointer-events: none;
        z-index: 9997;
        color: var(--primary-color);
        font-size: 0.75rem;
        font-weight: 600;
        text-transform: uppercase;
        letter-spacing: 2px;
        opacity: 0;
        left: 0;
        top: 0;
        transition: opacity 0.3s ease;
        white-space: nowrap;
    }
    @media (max-width: 768px) {
        .custom-cursor,
        .cursor-follower,
        .cursor-text {
            display: none !important;
        }
        body {
            cursor: auto !important;
        }
    }
`;
document.head.appendChild(cursorStyle);

// Scroll Progress Indicator
const createScrollProgress = () => {
    const progressBar = document.createElement('div');
    progressBar.className = 'scroll-progress';
    document.body.appendChild(progressBar);
    
    window.addEventListener('scroll', () => {
        const windowHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrolled = (window.pageYOffset / windowHeight) * 100;
        progressBar.style.width = scrolled + '%';
    });
};

createScrollProgress();

// Add scroll progress styles
const progressStyle = document.createElement('style');
progressStyle.textContent = `
    .scroll-progress {
        position: fixed;
        top: 0;
        left: 0;
        height: 3px;
        background: var(--gradient-1);
        z-index: 10000;
        transition: width 0.1s ease;
    }
`;
document.head.appendChild(progressStyle);

// Add active state to navigation links on scroll
const sections = document.querySelectorAll('section[id]');
const navLinksArray = document.querySelectorAll('.nav-link');

window.addEventListener('scroll', () => {
    let current = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (window.pageYOffset >= sectionTop - 200) {
            current = section.getAttribute('id');
        }
    });
    
    navLinksArray.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
});

// Add active link styles
const activeLinkStyle = document.createElement('style');
activeLinkStyle.textContent = `
    .nav-link.active {
        color: var(--text-primary);
    }
    .nav-link.active::after {
        width: 100%;
    }
`;
document.head.appendChild(activeLinkStyle);

// Performance optimization: Lazy load images if any are added later
if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                if (img.dataset.src) {
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                }
                observer.unobserve(img);
            }
        });
    });
    
    document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
    });
}

// Enhanced showcase grid animations
const showcaseGridItems = document.querySelectorAll('.grid-item');
const showcaseObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
            setTimeout(() => {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'scale(1) rotateY(0deg)';
                entry.target.classList.add('revealed');
            }, index * 100);
        }
    });
}, { threshold: 0.2 });

showcaseGridItems.forEach(item => {
    item.style.opacity = '0';
    item.style.transform = 'scale(0.9) rotateY(15deg)';
    item.style.transition = 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)';
    showcaseObserver.observe(item);
    
    // Add magnetic effect on hover
    item.addEventListener('mousemove', (e) => {
        const rect = item.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        
        item.style.transform = `translate(${x * 0.1}px, ${y * 0.1}px) scale(1.05)`;
    });
    
    item.addEventListener('mouseleave', () => {
        item.style.transform = 'translate(0, 0) scale(1)';
    });
});

// Magnetic effect for buttons
document.querySelectorAll('.btn, .nav-link').forEach(btn => {
    btn.addEventListener('mousemove', (e) => {
        const rect = btn.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        
        btn.style.transform = `translate(${x * 0.2}px, ${y * 0.2}px)`;
    });
    
    btn.addEventListener('mouseleave', () => {
        btn.style.transform = 'translate(0, 0)';
    });
});

// 3D Tilt Effect for Feature Cards
document.querySelectorAll('.feature-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const rotateX = (y - centerY) / 10;
        const rotateY = (centerX - x) / 10;
        
        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(20px)`;
    });
    
    card.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateZ(0)';
    });
});

// Ripple effect on click
document.querySelectorAll('.btn, .feature-card, .stat-item').forEach(element => {
    element.addEventListener('click', function(e) {
        const ripple = document.createElement('span');
        ripple.className = 'ripple';
        const rect = this.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;
        
        ripple.style.width = ripple.style.height = size + 'px';
        ripple.style.left = x + 'px';
        ripple.style.top = y + 'px';
        
        this.appendChild(ripple);
        
        setTimeout(() => ripple.remove(), 600);
    });
});

// Initialize GSAP ScrollTrigger when available
function initGSAP() {
    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
        if (!gsap.config) {
            gsap.config({ nullTargetWarn: false });
        }
        // ScrollTrigger will be registered in individual files
    }
}

// Ensure all animations work together
window.addEventListener('load', () => {
    initGSAP();
    
    // Refresh ScrollTrigger on load
    setTimeout(() => {
        if (typeof ScrollTrigger !== 'undefined') {
            ScrollTrigger.refresh();
        }
    }, 500);
    
    console.log('🚀 Modern Page loaded successfully!');
    console.log('✨ All features initialized:');
    console.log('  - 3D Real-time Rendering (WebGL)');
    console.log('  - Scrollytelling 2.0');
    console.log('  - Typography Animations');
    console.log('  - AR/VR Motion Graphics');
    console.log('  - Collaborative Animations');
    console.log('  - Ambient Background');
});

