// Initialize Feather Icons
feather.replace();

// 1. Clock (Live Time IST)
function updateTime() {
    const now = new Date();
    const timeString = now.toLocaleTimeString("en-IN", {
        hour: "2-digit", minute: "2-digit", hour12: true, timeZone: "Asia/Kolkata"
    });
    document.getElementById('live-time').innerText = timeString + " IST";
}
setInterval(updateTime, 1000);
updateTime();

// 2. Flip Words Animation
const words = ["Modern", "Scalable", "Dynamic", "Seamless"];
let wordIndex = 0;
const flipEl = document.getElementById('flip-word');
setInterval(() => {
    flipEl.style.opacity = 0;
    setTimeout(() => {
        wordIndex = (wordIndex + 1) % words.length;
        flipEl.innerText = words[wordIndex];
        flipEl.style.opacity = 1;
    }, 300);
}, 3000);

// 3. Navbar Scroll Blur & Mobile Menu
const navbar = document.getElementById('navbar-container');
window.addEventListener('scroll', () => {
    if (window.scrollY > 20) {
        navbar.classList.add('glass-nav');
        navbar.classList.remove('border-transparent', 'bg-transparent');
    } else {
        navbar.classList.remove('glass-nav');
        navbar.classList.add('border-transparent', 'bg-transparent');
    }
});

const menuBtn = document.getElementById('mobile-menu-btn');
const mobileMenu = document.getElementById('mobile-menu');
let menuOpen = false;

menuBtn.addEventListener('click', () => {
    menuOpen = !menuOpen;
    if (menuOpen) {
        mobileMenu.classList.remove('translate-y-[-100%]');
        mobileMenu.classList.add('translate-y-0');
        document.body.style.overflow = 'hidden';
        menuBtn.innerHTML = '<i data-feather="x"></i>';
    } else {
        mobileMenu.classList.add('translate-y-[-100%]');
        mobileMenu.classList.remove('translate-y-0');
        document.body.style.overflow = '';
        menuBtn.innerHTML = '<i data-feather="menu"></i>';
    }
    feather.replace();
});

document.querySelectorAll('.mobile-link').forEach(link => {
    link.addEventListener('click', () => {
        menuOpen = false;
        mobileMenu.classList.add('translate-y-[-100%]');
        document.body.style.overflow = '';
        menuBtn.innerHTML = '<i data-feather="menu"></i>';
        feather.replace();
    });
});

// 4. Custom Cursor Logic (Lerp + Magnetic)
const cursorRing = document.getElementById('cursor-ring');
const cursorDot = document.getElementById('cursor-dot');
let mouseX = -100, mouseY = -100;
let ringX = -100, ringY = -100;
let dotX = -100, dotY = -100;
let isHovering = false;
let activeMagnetic = null;

document.addEventListener('mousemove', (e) => {
    const target = e.target.closest('[data-magnetic], button, a');

    if (target && window.innerWidth >= 1024) {
        const rect = target.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        const distance = Math.hypot(e.clientX - centerX, e.clientY - centerY);

        if (distance < 60) {
            mouseX = centerX;
            mouseY = centerY;
            isHovering = true;
            activeMagnetic = target;
            return;
        }
    }

    mouseX = e.clientX;
    mouseY = e.clientY;
    isHovering = !!target;
    activeMagnetic = null;
});

function animateCursor() {
    ringX += (mouseX - ringX) * 0.15;
    ringY += (mouseY - ringY) * 0.15;
    dotX += (mouseX - dotX) * 0.4;
    dotY += (mouseY - dotY) * 0.4;

    cursorRing.style.transform = `translate(${ringX}px, ${ringY}px) translate(-50%, -50%)`;
    cursorDot.style.transform = `translate(${dotX}px, ${dotY}px) translate(-50%, -50%)`;

    if (isHovering && activeMagnetic) {
        cursorRing.style.width = (activeMagnetic.offsetWidth + 20) + 'px';
        cursorRing.style.height = (activeMagnetic.offsetHeight + 10) + 'px';
        cursorRing.style.borderRadius = '12px';
        cursorRing.style.backgroundColor = 'rgba(255,255,255,0.1)';
        cursorDot.style.opacity = 0;
    } else if (isHovering) {
        cursorRing.style.width = '60px';
        cursorRing.style.height = '60px';
        cursorRing.style.borderRadius = '999px';
        cursorRing.style.backgroundColor = 'transparent';
        cursorDot.style.opacity = 1;
        cursorDot.style.transform = `translate(${dotX}px, ${dotY}px) translate(-50%, -50%) scale(1.5)`;
    } else {
        cursorRing.style.width = '32px';
        cursorRing.style.height = '32px';
        cursorRing.style.borderRadius = '999px';
        cursorRing.style.backgroundColor = 'transparent';
        cursorDot.style.opacity = 1;
    }
    requestAnimationFrame(animateCursor);
}
if (window.innerWidth >= 1024) animateCursor();

// 5. Spotlight Hover Effect & Hero Glow Tracking
const heroSection = document.getElementById('hero');
const heroGlow = document.getElementById('hero-glow');

heroSection.addEventListener('mousemove', (e) => {
    const rect = heroSection.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    heroGlow.style.background = `radial-gradient(400px circle at ${x}px ${y}px, rgba(255,255,255,0.05), transparent 80%)`;
});
heroSection.addEventListener('mouseenter', () => heroGlow.style.opacity = 1);
heroSection.addEventListener('mouseleave', () => heroGlow.style.opacity = 0);

document.querySelectorAll('.spotlight-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        card.style.setProperty('--mouse-x', `${e.clientX - rect.left}px`);
        card.style.setProperty('--mouse-y', `${e.clientY - rect.top}px`);
    });
});

// 6. Scroll Animations (Intersection Observer & Timeline)
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
        }
    });
}, { threshold: 0.1, rootMargin: "0px 0px -50px 0px" });

document.querySelectorAll('.fade-in-up').forEach(el => observer.observe(el));

// Education Timeline Progress
const educationSection = document.getElementById('education');
const timelineProgress = document.getElementById('timeline-progress');
window.addEventListener('scroll', () => {
    const rect = educationSection.getBoundingClientRect();
    const windowHeight = window.innerHeight;
    let progress = (windowHeight - rect.top) / (rect.height + windowHeight / 2);
    progress = Math.max(0, Math.min(1, progress));
    if (timelineProgress) {
        timelineProgress.style.transform = `scaleY(${progress})`;
    }
});

// 7. Scanner Line Animation (Projects)
const scanner = document.getElementById('scanner');
let scannerPos = 0;
let scannerDir = 1;
function animateScanner() {
    scannerPos += 0.5 * scannerDir;
    if (scannerPos > 100 || scannerPos < 0) scannerDir *= -1;
    scanner.style.top = `${scannerPos}%`;
    requestAnimationFrame(animateScanner);
}
animateScanner();

// 8. Contact Form Handling (Formspree Integration)
const form = document.getElementById('contactForm');
const submitBtn = document.getElementById('submitBtn');
const btnText = document.getElementById('btnText');
const btnIcon = document.getElementById('btnIcon');
const btnLoader = document.getElementById('btnLoader');
const contactContent = document.getElementById('contact-content');
const successMessage = document.getElementById('success-message');
const resetFormBtn = document.getElementById('resetFormBtn');

if (form) {
    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        // Show loading UI
        submitBtn.disabled = true;
        btnText.classList.add('hidden');
        btnIcon.classList.add('hidden');
        btnLoader.classList.remove('hidden');

        const formData = new FormData(form);

        try {
            const response = await fetch('https://formspree.io/f/xjgaaoeg', {
                method: 'POST',
                body: formData,
                headers: {
                    'Accept': 'application/json'
                }
            });

            if (response.ok) {
                // Hide form, show success message
                contactContent.classList.add('hidden');
                successMessage.classList.remove('hidden');
                successMessage.classList.add('flex');
                form.reset();
            } else {
                alert('Oops! There was a problem submitting your form');
            }
        } catch (error) {
            alert('Oops! There was a problem submitting your form');
        } finally {
            // Revert loading UI
            submitBtn.disabled = false;
            btnText.classList.remove('hidden');
            btnIcon.classList.remove('hidden');
            btnLoader.classList.add('hidden');
        }
    });
}

if (resetFormBtn) {
    resetFormBtn.addEventListener('click', () => {
        successMessage.classList.add('hidden');
        successMessage.classList.remove('flex');
        contactContent.classList.remove('hidden');
    });
}

// 9. Set Current Year in Footer
document.getElementById('current-year').textContent = new Date().getFullYear();