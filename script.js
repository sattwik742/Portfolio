/* =========================================
   1. LENIS SMOOTH SCROLL (Momentum Scrolling)
========================================= */
const lenis = new Lenis({
  duration: 1.2,
  easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), 
  direction: 'vertical',
  gestureDirection: 'vertical',
  smooth: true,
  mouseMultiplier: 1,
  smoothTouch: false,
  touchMultiplier: 2,
});

lenis.on('scroll', ScrollTrigger.update);
gsap.ticker.add((time) => { lenis.raf(time * 1000); });
gsap.ticker.lagSmoothing(0);

/* =========================================
   2. THEME TOGGLE (LIGHT / DARK MODE)
========================================= */
const themeToggleBtn = document.getElementById("theme-toggle");
const body = document.body;

const currentTheme = localStorage.getItem("theme");
if (currentTheme === "light") {
  body.classList.add("light-mode");
}

themeToggleBtn.addEventListener("click", () => {
  body.classList.toggle("light-mode");
  if (body.classList.contains("light-mode")) {
    localStorage.setItem("theme", "light");
  } else {
    localStorage.setItem("theme", "dark");
  }
});

/* =========================================
   3. CUSTOM FLUID & MAGNETIC CURSOR 
========================================= */
const cursorDot = document.querySelector("[data-cursor-dot]");
const cursorOutline = document.querySelector("[data-cursor-outline]");
const interactiveElements = document.querySelectorAll("a, button, .magnetic, .hover-3d, input, textarea, .term-btns span");

let mouseX = window.innerWidth / 2, mouseY = window.innerHeight / 2;
let outlineX = window.innerWidth / 2, outlineY = window.innerHeight / 2;

window.addEventListener("mousemove", (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
  cursorDot.style.left = `${mouseX}px`;
  cursorDot.style.top = `${mouseY}px`;
});

function animateCursor() {
  outlineX += (mouseX - outlineX) * 0.15;
  outlineY += (mouseY - outlineY) * 0.15;
  cursorOutline.style.left = `${outlineX}px`;
  cursorOutline.style.top = `${outlineY}px`;
  requestAnimationFrame(animateCursor);
}
animateCursor();

interactiveElements.forEach(el => {
  el.addEventListener("mouseenter", () => cursorOutline.classList.add("hover-active"));
  el.addEventListener("mouseleave", () => cursorOutline.classList.remove("hover-active"));
});

/* =========================================
   4. MAGNETIC BUTTONS & LINKS (GSAP)
========================================= */
const magnets = document.querySelectorAll('.magnetic');

magnets.forEach(magnet => {
  magnet.addEventListener('mousemove', function(e) {
    const position = magnet.getBoundingClientRect();
    const x = e.clientX - position.left - position.width / 2;
    const y = e.clientY - position.top - position.height / 2;
    
    gsap.to(magnet, {
      x: x * 0.35,
      y: y * 0.35,
      duration: 0.8,
      ease: "power3.out"
    });
  });

  magnet.addEventListener('mouseleave', function() {
    gsap.to(magnet, {
      x: 0,
      y: 0,
      duration: 0.8,
      ease: "elastic.out(1, 0.3)"
    });
  });
});

/* =========================================
   5. GSAP SCROLL REVEAL ANIMATIONS
========================================= */
gsap.registerPlugin(ScrollTrigger);

const revealElements = document.querySelectorAll('.gs-reveal');
revealElements.forEach((el) => {
  gsap.fromTo(el, 
    { 
      autoAlpha: 0, 
      y: 80, 
      filter: "blur(12px)" 
    },
    {
      scrollTrigger: {
        trigger: el,
        start: "top 85%",
        toggleActions: "play none none reverse",
      },
      duration: 1.2,
      autoAlpha: 1,
      y: 0,
      filter: "blur(0px)",
      ease: "power3.out",
      stagger: 0.15
    }
  );
});

gsap.to("#hero-image", {
  yPercent: 20,
  ease: "none",
  scrollTrigger: {
    trigger: ".about-section",
    start: "top top", 
    end: "bottom top",
    scrub: true 
  }
});

/* =========================================
   6. NAVBAR SCROLL EFFECTS & PROGRESS BAR
========================================= */
const navbar = document.getElementById("navbar");
const progressBar = document.getElementById("progress-bar");
let lastScrollY = window.scrollY;

lenis.on("scroll", (e) => {
  const currentScrollY = window.scrollY;
  
  if (currentScrollY > 50) navbar.classList.add("scrolled");
  else navbar.classList.remove("scrolled");

  if (currentScrollY > lastScrollY && currentScrollY > 100) navbar.classList.add("hidden");
  else navbar.classList.remove("hidden");
  
  lastScrollY = currentScrollY;

  const totalHeight = document.body.scrollHeight - window.innerHeight;
  const progressPercentage = (currentScrollY / totalHeight) * 100;
  progressBar.style.width = `${progressPercentage}%`;
});

/* =========================================
   7. SCROLLSPY
========================================= */
const sections = document.querySelectorAll("section");
const navLinks = document.querySelectorAll(".nav-links .nav-link");
const scrollSpyOptions = { root: null, rootMargin: "-40% 0px -60% 0px", threshold: 0 };

const scrollSpyObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      navLinks.forEach(link => link.classList.remove("active"));
      const activeId = entry.target.getAttribute("id");
      const activeLink = document.querySelector(`.nav-link[href="#${activeId}"]`);
      if (activeLink) activeLink.classList.add("active");
    }
  });
}, scrollSpyOptions);

sections.forEach(section => scrollSpyObserver.observe(section));

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const targetId = this.getAttribute('href');
    if (targetId === '#') return;
    
    lenis.scrollTo(targetId, { offset: -50, duration: 1.5 });
    
    hamburger.classList.remove("active-hamburger");
    navMenu.classList.remove("active-menu");
  });
});

/* =========================================
   8. MOBILE HAMBURGER MENU
========================================= */
const hamburger = document.getElementById("hamburger");
const navMenu = document.getElementById("nav-links");

hamburger.addEventListener("click", () => {
  hamburger.classList.toggle("active-hamburger");
  navMenu.classList.toggle("active-menu");
});

/* =========================================
   9. BENTO GRID SPOTLIGHT EFFECT
========================================= */
window.addEventListener("mousemove", (e) => {
  const cards = document.getElementsByClassName("bento-card");
  for (const card of cards) {
    const rect = card.getBoundingClientRect(),
          x = e.clientX - rect.left,
          y = e.clientY - rect.top;
    card.style.setProperty("--mouse-x", `${x}px`);
    card.style.setProperty("--mouse-y", `${y}px`);
  }
});

/* =========================================
   10. UNIVERSAL 3D CARD EFFECT
========================================= */
const cardContainers = document.querySelectorAll('.hover-3d');
cardContainers.forEach(container => {
  const card = container.querySelector('.card-3d-inner') || container;
  const zElements = container.querySelectorAll('[data-translate-z]');
  
  container.addEventListener('mousemove', (e) => {
    const rect = container.getBoundingClientRect();
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    
    const rotateX = ((mouseY - centerY) / centerY) * -15; 
    const rotateY = ((mouseX - centerX) / centerX) * 15;

    gsap.to(card, { rotateX: rotateX, rotateY: rotateY, duration: 0.4, ease: "power2.out", transformPerspective: 1400 });
    
    zElements.forEach(el => {
      const zValue = el.getAttribute('data-translate-z');
      gsap.to(el, { z: zValue, duration: 0.4, ease: "power2.out" });
    });
  });

  container.addEventListener('mouseleave', () => {
    gsap.to(card, { rotateX: 0, rotateY: 0, duration: 0.8, ease: "power3.out" });
    zElements.forEach(el => { gsap.to(el, { z: 0, duration: 0.8, ease: "power3.out" }); });
  });
});

/* =========================================
   11. SMALLER DOT DISTORTION BACKGROUND (Canvas)
========================================= */
const dotCanvas = document.getElementById('dotCanvas');
if (dotCanvas) {
  const ctx = dotCanvas.getContext('2d');
  const aboutSection = document.getElementById('about');

  let dots = [];
  const spacing = 22; 
  let mouseOnGrid = { x: -1000, y: -1000 };

  function initDots() {
    const rect = aboutSection.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    dotCanvas.width = rect.width * dpr;
    dotCanvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);
    dotCanvas.style.width = `${rect.width}px`;
    dotCanvas.style.height = `${rect.height}px`;

    dots = [];
    for (let x = -spacing; x < rect.width + spacing; x += spacing) {
      for (let y = -spacing; y < rect.height + spacing; y += spacing) {
        dots.push({ x: x, y: y, baseX: x, baseY: y });
      }
    }
  }

  aboutSection.addEventListener('mousemove', (e) => {
    const rect = dotCanvas.getBoundingClientRect();
    mouseOnGrid.x = e.clientX - rect.left;
    mouseOnGrid.y = e.clientY - rect.top;
  });

  aboutSection.addEventListener('mouseleave', () => { mouseOnGrid.x = -1000; mouseOnGrid.y = -1000; });
  window.addEventListener('resize', initDots);

  function animateDots() {
    const rect = aboutSection.getBoundingClientRect();
    ctx.clearRect(0, 0, rect.width, rect.height);

    const computedStyle = getComputedStyle(document.body);
    const dotColorRGB = computedStyle.getPropertyValue('--canvas-dot-rgb').trim() || '255, 255, 255';

    for (let i = 0; i < dots.length; i++) {
      let dot = dots[i];
      let dx = mouseOnGrid.x - dot.baseX;
      let dy = mouseOnGrid.y - dot.baseY;
      let distance = Math.sqrt(dx * dx + dy * dy);
      
      let maxDist = 200; 
      let targetX = dot.baseX; let targetY = dot.baseY;
      
      let size = 0.6; 
      let opacity = 0.15; 

      if (distance < maxDist) {
        let force = (maxDist - distance) / maxDist;
        let angle = Math.atan2(dy, dx);
        let pushAmount = Math.sin(force * Math.PI) * 16; 
        targetX = dot.baseX - Math.cos(angle) * pushAmount;
        targetY = dot.baseY - Math.sin(angle) * pushAmount;
        
        size = 0.6 + force * 0.9;
        opacity = 0.15 + force * 0.4;
      }
      dot.x += (targetX - dot.x) * 0.15; dot.y += (targetY - dot.y) * 0.15;
      ctx.beginPath(); ctx.arc(dot.x, dot.y, size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${dotColorRGB}, ${opacity})`; ctx.fill();
    }
    requestAnimationFrame(animateDots);
  }
  initDots(); animateDots();
}

/* =========================================
   12. INTERACTIVE TERMINAL LOGIC
========================================= */
const termTrigger = document.getElementById("term-trigger");
const termOverlay = document.getElementById("terminal-overlay");
const termClose = document.getElementById("term-close");
const termBody = document.getElementById("terminal-body");
const termOutput = document.getElementById("term-output");
const termInput = document.getElementById("term-input");

termTrigger.addEventListener("click", () => {
  termOverlay.classList.add("active");
  setTimeout(() => termInput.focus(), 100);
});
termClose.addEventListener("click", () => termOverlay.classList.remove("active"));
termOverlay.addEventListener("click", (e) => {
  if (e.target === termOverlay) termOverlay.classList.remove("active");
});
termBody.addEventListener("click", () => termInput.focus());

const commands = {
  help: `Available commands:<br>
    <span style="color: var(--term-blue)">whoami</span>    - Display summary about me<br>
    <span style="color: var(--term-blue)">skills</span>    - List core technical skills<br>
    <span style="color: var(--term-blue)">date</span>      - Show current system date<br>
    <span style="color: var(--term-blue)">clear</span>     - Clear terminal output<br>
    <span style="color: var(--term-blue)">exit</span>      - Close the terminal`,
  whoami: `Sattwik<br>MCA Student & Web Developer<br>Passionate about Linux, modern UI, and backend architecture.`,
  skills: `Languages : Java, Python, JavaScript, HTML, CSS<br>
           Databases : Oracle SQL, MySQL, MongoDB<br>
           Tools     : Git, GitHub, Ubuntu, Vim, Node.js`,
  date: new Date().toString(),
  sudo: `<span style="color: var(--term-red)">sattwik is not in the sudoers file. This incident will be reported.</span>`
};

termInput.addEventListener("keydown", function(e) {
  if (e.key === "Enter") {
    const val = this.value.trim().toLowerCase();
    this.value = "";
    
    const cmdLine = document.createElement("p");
    cmdLine.innerHTML = `<span style="color: var(--term-green);">sattwik@ubuntu</span>:<span style="color: var(--term-blue);">~</span>$ ${val}`;
    termOutput.appendChild(cmdLine);

    if (val === "clear") {
      termOutput.innerHTML = "";
    } else if (val === "exit") {
      termOverlay.classList.remove("active");
    } else if (val !== "") {
      const responseLine = document.createElement("p");
      if (val.startsWith("sudo")) {
        responseLine.innerHTML = commands.sudo;
      } else if (commands[val]) {
        responseLine.innerHTML = commands[val];
      } else {
        responseLine.innerHTML = `<span style="color: var(--term-red)">bash: ${val}: command not found</span><br>Type 'help' for available commands.`;
      }
      termOutput.appendChild(responseLine);
    }
    termBody.scrollTop = termBody.scrollHeight;
  }
});
