// Main JavaScript for Woffy.ai Website

// Wait for the DOM to be fully loaded
// Add particles animation
function createParticleCanvas() {
    const canvas = document.createElement('canvas');
    canvas.id = 'particle-canvas';
    canvas.style.position = 'fixed';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.style.pointerEvents = 'none';
    canvas.style.zIndex = '0';
    canvas.style.opacity = '0.5';
    document.body.prepend(canvas);
    return canvas;
}

function setupParticles() {
    const canvas = createParticleCanvas();
    const ctx = canvas.getContext('2d');
    
    // Make canvas full screen
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    // Check if we're on mobile
    const isMobile = window.innerWidth < 768;
    
    // Reduce particle count on mobile for better performance
    const particleCount = isMobile ? 25 : 50;
    
    // Particle settings
    const particles = [];
    const colors = [
        'rgba(123, 104, 238, 0.4)', // primary
        'rgba(255, 154, 139, 0.4)', // secondary
        'rgba(78, 219, 208, 0.4)'   // accent
    ];
    
    // Create particles
    for (let i = 0; i < particleCount; i++) {
        particles.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            radius: Math.random() * (isMobile ? 2 : 3) + 1,
            color: colors[Math.floor(Math.random() * colors.length)],
            speedX: Math.random() * (isMobile ? 0.3 : 0.5) - (isMobile ? 0.15 : 0.25),
            speedY: Math.random() * (isMobile ? 0.3 : 0.5) - (isMobile ? 0.15 : 0.25),
            opacity: Math.random() * 0.5 + 0.2
        });
    }
    
    // Optional performance optimization: reduce animation frame rate on mobile
    let lastTime = 0;
    const frameThrottle = isMobile ? 40 : 0; // ms between frames on mobile (40ms ≈ 25fps)
    
    // Animation loop
    function animateParticles(timestamp) {
        // Apply frame throttling on mobile
        if (isMobile) {
            if (timestamp - lastTime < frameThrottle) {
                requestAnimationFrame(animateParticles);
                return;
            }
            lastTime = timestamp;
        }
        
        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Draw and update particles
        particles.forEach(p => {
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
            ctx.fillStyle = p.color;
            ctx.fill();
            
            // On mobile, only update position every other frame
            if (!isMobile || Math.random() > 0.5) {
                // Update position
                p.x += p.speedX;
                p.y += p.speedY;
                
                // Bounce off edges
                if (p.x < 0 || p.x > canvas.width) p.speedX = -p.speedX;
                if (p.y < 0 || p.y > canvas.height) p.speedY = -p.speedY;
            }
        });
        
        requestAnimationFrame(animateParticles);
    }
    
    // Handle resize - debounce for better performance on mobile
    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            
            // Update mobile detection on resize
            const newIsMobile = window.innerWidth < 768;
            if (newIsMobile !== isMobile) {
                // Reload the page to reset particle count and speeds
                // This is optional but provides better performance adaptation
                if (Math.random() > 0.5) { // Only do this 50% of the time to avoid constant reloads
                    window.location.reload();
                }
            }
        }, 250);
    });
    
    // Start animation
    requestAnimationFrame(animateParticles);
}

document.addEventListener('DOMContentLoaded', function() {
    // Initialize particles (only on pages with hero section)
    if (document.querySelector('.hero')) {
        setupParticles();
    }
    
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === "#") return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
    
    // Form submission for newsletter/updates
    const signupForms = document.querySelectorAll('.signup-form');
    
    signupForms.forEach(form => {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const emailInput = this.querySelector('input[type="email"]');
            const email = emailInput.value.trim();
            
            if (validateEmail(email)) {
                // Show success message (in a real site, you'd submit to a backend)
                const button = this.querySelector('button');
                const originalText = button.textContent;
                
                button.textContent = "Thank You!";
                button.style.backgroundColor = "#2ecc71";
                emailInput.value = "";
                
                // Reset button after 3 seconds
                setTimeout(() => {
                    button.textContent = originalText;
                    button.style.backgroundColor = "";
                }, 3000);
                
                // In a real implementation, you would send this to your backend:
                console.log("Email submitted:", email);
            } else {
                // Simple error handling
                emailInput.style.borderColor = "#e74c3c";
                emailInput.setAttribute("placeholder", "Please enter a valid email");
                
                setTimeout(() => {
                    emailInput.style.borderColor = "";
                    emailInput.setAttribute("placeholder", "Your email address");
                }, 3000);
            }
        });
    });
    
    // Email validation helper function
    function validateEmail(email) {
        const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());
    }
    
    // Enhanced animations for timeline markers (roadmap page)
    const timelineItems = document.querySelectorAll('.timeline-item');
    
    if (timelineItems.length > 0) {
        // Add intersection observer to animate timeline items when they come into view
        const timelineObserver = new IntersectionObserver((entries) => {
            entries.forEach((entry, index) => {
                if (entry.isIntersecting) {
                    // Add delay based on item index for staggered animation
                    setTimeout(() => {
                        entry.target.classList.add('visible');
                    }, index * 150);
                    
                    // Additional animation for the timeline marker
                    const marker = entry.target.querySelector('.timeline-marker');
                    if (marker) {
                        marker.style.transform = 'translateX(-50%) scale(1.2)';
                        setTimeout(() => {
                            marker.style.transform = 'translateX(-50%) scale(1)';
                        }, 500 + index * 150);
                    }
                    
                    timelineObserver.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.2,
            rootMargin: '0px 0px -100px 0px'
        });
        
        timelineItems.forEach(item => {
            timelineObserver.observe(item);
        });
        
        // Add sequential reveal animation to timeline details
        timelineItems.forEach(item => {
            const details = item.querySelectorAll('.timeline-details li');
            item.addEventListener('mouseenter', () => {
                details.forEach((detail, i) => {
                    detail.style.opacity = '0';
                    detail.style.transform = 'translateY(10px)';
                    detail.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
                    detail.style.transitionDelay = `${i * 0.1}s`;
                    
                    setTimeout(() => {
                        detail.style.opacity = '1';
                        detail.style.transform = 'translateY(0)';
                    }, 50);
                });
            });
        });
    }
    
    // Enhanced hover effects for feature cards with 3D tilt effect
    const featureCards = document.querySelectorAll('.feature-card, .format-card, .platform-card, .use-case-card');
    
    featureCards.forEach(card => {
        // Check if we're on mobile/touch device
        const isMobile = window.innerWidth < 768 || 'ontouchstart' in window;
        
        if (!isMobile) {
            // Only add these effects on non-touch devices
            // Create shine overlay element for each card
            const shineOverlay = document.createElement('div');
            shineOverlay.classList.add('shine-overlay');
            shineOverlay.style.position = 'absolute';
            shineOverlay.style.top = '0';
            shineOverlay.style.left = '0';
            shineOverlay.style.right = '0';
            shineOverlay.style.bottom = '0';
            shineOverlay.style.backgroundImage = 'linear-gradient(135deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.05) 50%, rgba(255,255,255,0) 100%)';
            shineOverlay.style.opacity = '0';
            shineOverlay.style.transition = 'opacity 0.3s ease';
            shineOverlay.style.pointerEvents = 'none';
            shineOverlay.style.zIndex = '1';
            
            // Only add if card doesn't already have position relative
            if (getComputedStyle(card).position !== 'relative') {
                card.style.position = 'relative';
            }
            
            card.appendChild(shineOverlay);
            
            // 3D tilt effect
            card.addEventListener('mousemove', function(e) {
                const rect = this.getBoundingClientRect();
                const x = e.clientX - rect.left; // x position within the element
                const y = e.clientY - rect.top; // y position within the element
                
                // Calculate rotation based on mouse position
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                
                const moveX = (x - centerX) / (rect.width / 2) * 5; // Max 5 degrees
                const moveY = (y - centerY) / (rect.height / 2) * 5; // Max 5 degrees
                
                // Apply the transform
                this.style.transform = `perspective(1000px) translateY(-7px) rotateX(${-moveY}deg) rotateY(${moveX}deg)`;
                this.style.boxShadow = '0 15px 35px rgba(0, 0, 0, 0.2)';
                
                // Position shine effect based on mouse
                shineOverlay.style.opacity = '1';
                shineOverlay.style.backgroundPosition = `${x}px ${y}px`;
            });
            
            card.addEventListener('mouseleave', function() {
                this.style.transform = '';
                this.style.boxShadow = '';
                shineOverlay.style.opacity = '0';
            });
        } else {
            // Simple mobile hover effect
            card.addEventListener('touchstart', function() {
                this.style.transform = 'translateY(-5px)';
                this.style.boxShadow = '0 10px 20px rgba(0, 0, 0, 0.15)';
            }, {passive: true});
            
            card.addEventListener('touchend', function() {
                setTimeout(() => {
                    this.style.transform = '';
                    this.style.boxShadow = '';
                }, 200);
            }, {passive: true});
        }
    });
    
    // Enhanced mobile menu toggle functionality
    const mobileMenuToggle = document.createElement('button');
    mobileMenuToggle.className = 'mobile-menu-toggle';
    mobileMenuToggle.innerHTML = '<span></span><span></span><span></span>';
    mobileMenuToggle.style.display = 'none';
    mobileMenuToggle.style.background = 'transparent';
    mobileMenuToggle.style.border = 'none';
    mobileMenuToggle.style.cursor = 'pointer';
    mobileMenuToggle.style.width = '30px';
    mobileMenuToggle.style.height = '25px';
    mobileMenuToggle.style.position = 'relative';
    mobileMenuToggle.style.zIndex = '1000';
    
    // Style the burger icon lines
    const spans = mobileMenuToggle.querySelectorAll('span');
    spans.forEach((span, index) => {
        span.style.position = 'absolute';
        span.style.width = '100%';
        span.style.height = '3px';
        span.style.borderRadius = '3px';
        span.style.background = 'linear-gradient(to right, var(--primary-color), var(--secondary-color))';
        span.style.left = '0';
        span.style.transformOrigin = 'left center';
        span.style.transition = 'transform 0.3s ease, opacity 0.3s ease';
        
        // Position each line
        if (index === 0) span.style.top = '0';
        if (index === 1) span.style.top = '50%';
        if (index === 2) span.style.top = '100%';
        
        if (index === 1) span.style.transform = 'translateY(-50%)';
        if (index === 2) span.style.transform = 'translateY(-100%)';
    });
    
    const nav = document.querySelector('nav');
    const navLinks = document.querySelector('.nav-links');
    const header = document.querySelector('header');
    
    // Add scroll effect for header
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });
    
    if (nav && navLinks) {
        nav.insertBefore(mobileMenuToggle, navLinks);
        
        // Style mobile nav
        navLinks.style.transition = 'transform 0.4s ease, opacity 0.3s ease';
        
        mobileMenuToggle.addEventListener('click', function() {
            const isOpen = navLinks.classList.toggle('show-mobile-menu');
            
            // Animate burger to X
            if (isOpen) {
                spans[0].style.transform = 'rotate(45deg)';
                spans[1].style.opacity = '0';
                spans[2].style.transform = 'translateY(-100%) rotate(-45deg)';
                
                // Disable scrolling when menu is open
                document.body.style.overflow = 'hidden';
            } else {
                spans[0].style.transform = '';
                spans[1].style.opacity = '1';
                spans[2].style.transform = 'translateY(-100%)';
                
                // Re-enable scrolling
                document.body.style.overflow = '';
            }
        });
        
        // Add CSS for mobile menu
        const style = document.createElement('style');
        style.textContent = `
            .mobile-nav {
                position: fixed;
                top: 0;
                right: 0;
                width: 100%;
                height: 100vh;
                background-color: rgba(18, 18, 18, 0.95);
                flex-direction: column;
                justify-content: center;
                align-items: center;
                gap: 2rem;
                z-index: 999;
                transform: translateX(100%);
                opacity: 0;
                backdrop-filter: blur(10px);
                -webkit-backdrop-filter: blur(10px);
            }
            
            .mobile-nav a {
                font-size: 1.5rem;
                opacity: 0;
                transform: translateY(20px);
                transition: opacity 0.3s ease, transform 0.3s ease;
            }
            
            .show-mobile-menu {
                transform: translateX(0) !important;
                opacity: 1 !important;
            }
            
            .show-mobile-menu a {
                opacity: 1;
                transform: translateY(0);
            }
            
            .show-mobile-menu a:nth-child(1) { transition-delay: 0.1s; }
            .show-mobile-menu a:nth-child(2) { transition-delay: 0.2s; }
            .show-mobile-menu a:nth-child(3) { transition-delay: 0.3s; }
            .show-mobile-menu a:nth-child(4) { transition-delay: 0.4s; }
        `;
        document.head.appendChild(style);
        
        // Show mobile menu toggle on small screens
        function adjustForScreenSize() {
            if (window.innerWidth <= 768) {
                mobileMenuToggle.style.display = 'block';
                navLinks.classList.add('mobile-nav');
            } else {
                mobileMenuToggle.style.display = 'none';
                navLinks.classList.remove('mobile-nav', 'show-mobile-menu');
                
                // Reset burger icon
                spans[0].style.transform = '';
                spans[1].style.opacity = '1';
                spans[2].style.transform = 'translateY(-100%)';
                
                // Re-enable scrolling
                document.body.style.overflow = '';
            }
        }
        
        // Run on load and resize
        adjustForScreenSize();
        window.addEventListener('resize', adjustForScreenSize);
    }
});