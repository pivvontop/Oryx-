// 2. Interactive Canvas Background (Particle Constellation)
const canvas = document.getElementById('bg-canvas');
const ctx = canvas.getContext('2d');
let width, height;
let particles = [];

function initCanvas() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
}
window.addEventListener('resize', initCanvas);
initCanvas();

class Particle {
    constructor() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.vx = (Math.random() - 0.5) * 0.5;
        this.vy = (Math.random() - 0.5) * 0.5;
        this.radius = Math.random() * 1.5 + 0.5;
    }
    update() {
        this.x += this.vx;
        this.y += this.vy;
        if (this.x < 0 || this.x > width) this.vx *= -1;
        if (this.y < 0 || this.y > height) this.vy *= -1;
    }
    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
        ctx.fill();
    }
}

for (let i = 0; i < 80; i++) {
    particles.push(new Particle());
}

function animateParticles() {
    ctx.clearRect(0, 0, width, height);
    
    // Draw background gradient
    let grad = ctx.createLinearGradient(0, 0, width, height);
    grad.addColorStop(0, '#0a0a0a');
    grad.addColorStop(1, '#000000');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, width, height);

    particles.forEach(p => {
        p.update();
        p.draw();
    });

    // Draw lines between close particles
    for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
            const dx = particles[i].x - particles[j].x;
            const dy = particles[i].y - particles[j].y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            
            if (dist < 120) {
                ctx.beginPath();
                ctx.strokeStyle = `rgba(255, 85, 0, ${0.15 - dist/800})`;
                ctx.lineWidth = 0.5;
                ctx.moveTo(particles[i].x, particles[i].y);
                ctx.lineTo(particles[j].x, particles[j].y);
                ctx.stroke();
            }
        }
    }
    requestAnimationFrame(animateParticles);
}
animateParticles();


// 3. GSAP Animations with ScrollTrigger
gsap.registerPlugin(ScrollTrigger);

// Custom scroller for snap scrolling container
const container = document.querySelector('.container');

// Hero Animations (On load)
gsap.to('.hero .fade-up', {
    y: 0,
    opacity: 1,
    duration: 1,
    stagger: 0.2,
    ease: "power3.out",
    delay: 0.2
});

// Setup ScrollTriggers for each panel
const panels = document.querySelectorAll('.panel');

panels.forEach((panel, i) => {
    if (i === 0) return; // Skip hero, already animated

    const elements = panel.querySelectorAll('.fade-up');
    
    gsap.to(elements, {
        scrollTrigger: {
            trigger: panel,
            start: "top 70%", // when top of panel hits 70% of viewport
            toggleActions: "play none none reverse"
        },
        y: 0,
        opacity: 1,
        duration: 0.8,
        stagger: 0.15,
        ease: "power2.out"
    });
});

// 4. Vanilla Tilt initialization
VanillaTilt.init(document.querySelectorAll(".tilt-card"), {
    max: 15,
    speed: 400,
    glare: true,
    "max-glare": 0.15,
    perspective: 1000,
    scale: 1.05
});

// Navbar smooth scroll
document.querySelectorAll('.nav-links a, .nav-btn').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        // Only smooth scroll for anchor links
        const targetId = this.getAttribute('href');
        if (targetId.startsWith('#')) {
            e.preventDefault();
            const targetSection = document.querySelector(targetId);
            if (targetSection) {
                window.scrollTo({
                    top: targetSection.offsetTop,
                    behavior: 'smooth'
                });
            }
        }
    });
});

// 5. Cookie Banner Logic
const cookieBanner = document.getElementById('cookie-banner');
const acceptCookiesBtn = document.getElementById('accept-cookies');

// Check if user already accepted cookies
if (!localStorage.getItem('cookiesAccepted')) {
    // Show banner after a slight delay
    setTimeout(() => {
        cookieBanner.classList.add('show');
    }, 1000);
}

acceptCookiesBtn.addEventListener('click', () => {
    localStorage.setItem('cookiesAccepted', 'true');
    cookieBanner.classList.remove('show');
});
