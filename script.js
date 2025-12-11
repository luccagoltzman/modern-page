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

// Parallax Effect for Hero Orbs
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const orbs = document.querySelectorAll('.gradient-orb');
    
    orbs.forEach((orb, index) => {
        const speed = 0.3 + (index * 0.1);
        const yPos = -(scrolled * speed);
        orb.style.transform = `translateY(${yPos}px)`;
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

// Cursor Effect (Optional - Modern touch)
let cursor = null;
let cursorFollower = null;

const createCursor = () => {
    cursor = document.createElement('div');
    cursor.className = 'custom-cursor';
    cursorFollower = document.createElement('div');
    cursorFollower.className = 'cursor-follower';
    document.body.appendChild(cursor);
    document.body.appendChild(cursorFollower);
    
    let mouseX = 0;
    let mouseY = 0;
    let followerX = 0;
    let followerY = 0;
    
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        
        cursor.style.left = mouseX + 'px';
        cursor.style.top = mouseY + 'px';
    });
    
    const animateFollower = () => {
        followerX += (mouseX - followerX) * 0.1;
        followerY += (mouseY - followerY) * 0.1;
        
        cursorFollower.style.left = followerX + 'px';
        cursorFollower.style.top = followerY + 'px';
        
        requestAnimationFrame(animateFollower);
    };
    
    animateFollower();
    
    // Hover effects
    document.querySelectorAll('a, button, .feature-card, .stat-item').forEach(el => {
        el.addEventListener('mouseenter', () => {
            cursor.classList.add('hover');
            cursorFollower.classList.add('hover');
        });
        el.addEventListener('mouseleave', () => {
            cursor.classList.remove('hover');
            cursorFollower.classList.remove('hover');
        });
    });
};

// Uncomment to enable custom cursor (optional)
// createCursor();

// Add custom cursor styles if enabled
if (cursor) {
    const style = document.createElement('style');
    style.textContent = `
        .custom-cursor {
            width: 10px;
            height: 10px;
            border-radius: 50%;
            background: var(--primary-color);
            position: fixed;
            pointer-events: none;
            z-index: 9999;
            transform: translate(-50%, -50%);
            transition: transform 0.2s ease;
        }
        .custom-cursor.hover {
            transform: translate(-50%, -50%) scale(1.5);
        }
        .cursor-follower {
            width: 40px;
            height: 40px;
            border: 2px solid var(--primary-color);
            border-radius: 50%;
            position: fixed;
            pointer-events: none;
            z-index: 9998;
            transform: translate(-50%, -50%);
            opacity: 0.5;
        }
        .cursor-follower.hover {
            transform: translate(-50%, -50%) scale(1.2);
        }
    `;
    document.head.appendChild(style);
}

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

// Add smooth reveal animation for showcase grid items
const showcaseGridItems = document.querySelectorAll('.grid-item');
const showcaseObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
            setTimeout(() => {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'scale(1)';
            }, index * 100);
        }
    });
}, { threshold: 0.2 });

showcaseGridItems.forEach(item => {
    item.style.opacity = '0';
    item.style.transform = 'scale(0.9)';
    item.style.transition = 'all 0.5s ease';
    showcaseObserver.observe(item);
});

console.log('🚀 Modern Page loaded successfully!');

