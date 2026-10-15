/* ═══════════════════════════════════════════════════════
   AMIT YADAV PORTFOLIO — script.js
   ═══════════════════════════════════════════════════════ */

"use strict";

// ── API base — works from both Live Server (:5500) and FastAPI (:8000) ────────
const API_BASE = window.location.port === "5500"
  ? "http://127.0.0.1:8000"
  : "";

// ── Loader ────────────────────────────────────────────────────────────────────
window.addEventListener("load", () => {
  const loader = document.getElementById("loader");
  setTimeout(() => loader.classList.add("hidden"), 600);
});

// ── Custom Cursor ─────────────────────────────────────────────────────────────
const cursor         = document.getElementById("cursor");
const cursorFollower = document.getElementById("cursor-follower");
let mouseX = 0, mouseY = 0, followerX = 0, followerY = 0;

document.addEventListener("mousemove", (e) => {
  mouseX = e.clientX; mouseY = e.clientY;
  cursor.style.left = mouseX + "px";
  cursor.style.top  = mouseY + "px";
});

(function animateCursor() {
  followerX += (mouseX - followerX) * 0.12;
  followerY += (mouseY - followerY) * 0.12;
  cursorFollower.style.left = followerX + "px";
  cursorFollower.style.top  = followerY + "px";
  requestAnimationFrame(animateCursor);
})();

document.querySelectorAll("a, button, .skill-tag, .project-link").forEach(el => {
  el.addEventListener("mouseenter", () => {
    cursor.style.transform         = "translate(-50%,-50%) scale(1.8)";
    cursorFollower.style.transform = "translate(-50%,-50%) scale(1.5)";
    cursorFollower.style.opacity   = "0.5";
  });
  el.addEventListener("mouseleave", () => {
    cursor.style.transform         = "translate(-50%,-50%) scale(1)";
    cursorFollower.style.transform = "translate(-50%,-50%) scale(1)";
    cursorFollower.style.opacity   = "1";
  });
});

// ── Navbar Scroll ─────────────────────────────────────────────────────────────
const navbar = document.getElementById("navbar");
window.addEventListener("scroll", () => {
  navbar.classList.toggle("scrolled", window.scrollY > 20);
  updateActiveNav();
  updateBackToTop();
});

// ── Mobile Menu ───────────────────────────────────────────────────────────────
const hamburger = document.getElementById("hamburger");
const navLinks  = document.getElementById("nav-links");

hamburger.addEventListener("click", () => {
  hamburger.classList.toggle("open");
  navLinks.classList.toggle("open");
});
document.querySelectorAll(".nav-link").forEach(link => {
  link.addEventListener("click", () => {
    hamburger.classList.remove("open");
    navLinks.classList.remove("open");
  });
});

// ── Active Nav Highlight ──────────────────────────────────────────────────────
function updateActiveNav() {
  const sections  = document.querySelectorAll("section[id]");
  const scrollPos = window.scrollY + 100;
  sections.forEach(sec => {
    const link = document.querySelector(`.nav-link[href="#${sec.id}"]`);
    if (!link) return;
    link.classList.toggle(
      "active",
      sec.offsetTop <= scrollPos && sec.offsetTop + sec.offsetHeight > scrollPos
    );
  });
}

// ── Back to Top ───────────────────────────────────────────────────────────────
const backToTop = document.getElementById("back-to-top");
function updateBackToTop() {
  backToTop.classList.toggle("visible", window.scrollY > 400);
}
backToTop.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));

// ── Typed Text ────────────────────────────────────────────────────────────────
const roles = [
  "Full Stack Developer",
  "FastAPI Expert",
  "Python Developer",
  "REST API Builder",
  "Cyber Security Enthusiast",
];
let roleIdx = 0, charIdx = 0, isDeleting = false;
const typedEl = document.getElementById("typed-text");

function typeText() {
  const current = roles[roleIdx];
  typedEl.textContent = isDeleting
    ? current.substring(0, charIdx--)
    : current.substring(0, charIdx++);

  let delay = isDeleting ? 60 : 110;
  if (!isDeleting && charIdx > current.length) { delay = 1800; isDeleting = true; }
  else if (isDeleting && charIdx < 0) { isDeleting = false; roleIdx = (roleIdx + 1) % roles.length; charIdx = 0; delay = 400; }
  setTimeout(typeText, delay);
}
typeText();

// ── Particles Canvas ──────────────────────────────────────────────────────────
(function initParticles() {
  const canvas = document.getElementById("particles-canvas");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  let W, H, particles = [];

  function resize() {
    W = canvas.width  = canvas.offsetWidth;
    H = canvas.height = canvas.offsetHeight;
  }
  function createParticles() {
    particles = [];
    const count = Math.floor((W * H) / 14000);
    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * W, y: Math.random() * H,
        r: Math.random() * 1.8 + 0.4,
        dx: (Math.random() - 0.5) * 0.4, dy: (Math.random() - 0.5) * 0.4,
        alpha: Math.random() * 0.5 + 0.15,
      });
    }
  }
  function draw() {
    ctx.clearRect(0, 0, W, H);
    particles.forEach(p => {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(99,102,241,${p.alpha})`;
      ctx.fill();
      particles.forEach(q => {
        const dist = Math.hypot(p.x - q.x, p.y - q.y);
        if (dist < 100) {
          ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(q.x, q.y);
          ctx.strokeStyle = `rgba(99,102,241,${0.07 * (1 - dist / 100)})`;
          ctx.lineWidth = 0.6; ctx.stroke();
        }
      });
      p.x += p.dx; p.y += p.dy;
      if (p.x < 0 || p.x > W) p.dx *= -1;
      if (p.y < 0 || p.y > H) p.dy *= -1;
    });
    requestAnimationFrame(draw);
  }
  window.addEventListener("resize", () => { resize(); createParticles(); });
  resize(); createParticles(); draw();
})();

// ── Scroll Reveal ─────────────────────────────────────────────────────────────
const revealObserver = new IntersectionObserver(
  (entries) => entries.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add("visible"); revealObserver.unobserve(e.target); }
  }),
  { threshold: 0.12 }
);
function addReveal(selector, delay = 0) {
  document.querySelectorAll(selector).forEach((el, i) => {
    el.classList.add("reveal");
    if (delay) el.style.transitionDelay = `${i * delay}s`;
    revealObserver.observe(el);
  });
}

// ── Fetch Portfolio Data & Render ─────────────────────────────────────────────
async function loadPortfolio() {
  try {
    const res = await fetch(`${API_BASE}/api/portfolio`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    renderSkills(data.skills);
    renderProjects(data.projects);
    renderExperience(data.experience);
    renderEducation(data.education);
    addReveal(".skill-card", 0.07);
    addReveal(".project-card", 0.1);
    addReveal(".timeline-item", 0.1);
    addReveal(".about-grid, .contact-grid", 0);
  } catch (err) {
    console.error("Failed to load portfolio data:", err);
  }
}

const skillIcons = {
  Languages: "fas fa-code", Database: "fas fa-database", Backend: "fas fa-server",
  Frontend: "fas fa-laptop-code", Tools: "fas fa-tools", Cybersecurity: "fas fa-shield-alt",
};

function renderSkills(skills) {
  const grid = document.getElementById("skills-grid");
  if (!grid) return;
  grid.innerHTML = Object.entries(skills).map(([category, items]) => `
    <div class="skill-card">
      <div class="skill-card-header">
        <div class="skill-card-icon"><i class="${skillIcons[category] || 'fas fa-star'}"></i></div>
        <h3 class="skill-card-title">${category}</h3>
      </div>
      <div class="skill-tags">${items.map(t => `<span class="skill-tag">${t}</span>`).join("")}</div>
    </div>
  `).join("");
}

function renderProjects(projects) {
  const grid = document.getElementById("projects-grid");
  if (!grid) return;
  grid.innerHTML = projects.map(p => `
    <div class="project-card">
      <div class="project-header">
        <span class="project-icon">${p.icon}</span>
        <div class="project-links">
          <a href="#" class="project-link" aria-label="Source Code" title="Source Code"><i class="fab fa-github"></i></a>
          <a href="#" class="project-link" aria-label="Live Demo" title="Live Demo"><i class="fas fa-external-link-alt"></i></a>
        </div>
      </div>
      <h3 class="project-name">${p.name}</h3>
      <p class="project-description">${p.description}</p>
      <ul class="project-highlights">${p.highlights.map(h => `<li>${h}</li>`).join("")}</ul>
      <div class="project-tech">${p.tech.map(t => `<span class="tech-tag">${t}</span>`).join("")}</div>
    </div>
  `).join("");
}

function renderExperience(experience) {
  const tl = document.getElementById("experience-timeline");
  if (!tl) return;
  tl.innerHTML = experience.map(e => `
    <div class="timeline-item">
      <div class="timeline-card">
        <div class="timeline-period">${e.period}</div>
        <div class="timeline-title">${e.company}</div>
        <div class="timeline-subtitle">${e.role}</div>
        <div class="timeline-location"><i class="fas fa-map-marker-alt"></i> ${e.location}</div>
        <p class="timeline-desc">${e.description}</p>
      </div>
    </div>
  `).join("");
}

function renderEducation(education) {
  const tl = document.getElementById("education-timeline");
  if (!tl) return;
  tl.innerHTML = education.map(e => `
    <div class="timeline-item">
      <div class="timeline-card">
        <div class="timeline-period">${e.period}</div>
        <div class="timeline-title">${e.degree}</div>
        <div class="timeline-subtitle">${e.institution}</div>
        <div class="timeline-location"><i class="fas fa-map-marker-alt"></i> ${e.location}</div>
      </div>
    </div>
  `).join("");
}

// ── Floating Label behaviour ──────────────────────────────────────────────────
function initFloatingLabels() {
  document.querySelectorAll(".float-group input, .float-group textarea").forEach(el => {
    const sync = () => el.parentElement.classList.toggle("has-value", el.value.trim() !== "");
    el.addEventListener("input", sync);
    el.addEventListener("focus",  () => el.parentElement.classList.add("focused"));
    el.addEventListener("blur",   () => { el.parentElement.classList.remove("focused"); sync(); });
    sync();
  });
}

// ── Contact Form ──────────────────────────────────────────────────────────────
const form        = document.getElementById("contact-form");
const submitBtn   = document.getElementById("submit-btn");
const btnText     = submitBtn.querySelector(".btn-text");
const btnLoading  = submitBtn.querySelector(".btn-loading");
const formSuccess = document.getElementById("form-success");
const formError   = document.getElementById("form-error");
const successMsg  = document.getElementById("success-message");
const errorMsg    = document.getElementById("error-message");

function validateField(id, errorId, condFn, msg) {
  const el  = document.getElementById(id);
  const err = document.getElementById(errorId);
  const grp = el.closest(".float-group");
  if (!condFn(el.value)) {
    err.textContent = msg;
    grp.classList.add("has-error");
    return false;
  }
  err.textContent = "";
  grp.classList.remove("has-error");
  return true;
}

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  formSuccess.hidden = true;
  formError.hidden   = true;

  const ok =
    validateField("name",    "name-error",    v => v.trim().length >= 2,                          "At least 2 characters required.") &
    validateField("email",   "email-error",   v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()),  "Enter a valid email address.") &
    validateField("message", "message-error", v => v.trim().length >= 10,                         "At least 10 characters required.");
  if (!ok) return;

  btnText.hidden = true; btnLoading.hidden = false; submitBtn.disabled = true;

  const payload = {
    name:    document.getElementById("name").value.trim(),
    email:   document.getElementById("email").value.trim(),
    subject: document.getElementById("subject").value.trim() || "No Subject",
    message: document.getElementById("message").value.trim(),
  };

  try {
    const res  = await fetch(`${API_BASE}/api/contact`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    if (res.ok && data.success) {
      successMsg.textContent = data.message;
      formSuccess.hidden = false;
      form.reset();
      document.querySelectorAll(".float-group").forEach(g => g.classList.remove("has-value", "has-error"));
      formSuccess.scrollIntoView({ behavior: "smooth", block: "nearest" });
    } else {
      throw new Error(data.detail || "Something went wrong. Please try again.");
    }
  } catch (err) {
    errorMsg.textContent = err.message || "Failed to send. Please try again.";
    formError.hidden = false;
  } finally {
    btnText.hidden = false; btnLoading.hidden = true; submitBtn.disabled = false;
  }
});

["name", "email", "message"].forEach(id => {
  const el = document.getElementById(id);
  if (!el) return;
  el.addEventListener("input", () => {
    document.getElementById(id + "-error").textContent = "";
    el.closest(".float-group").classList.remove("has-error");
  });
});

// ── Year ──────────────────────────────────────────────────────────────────────
document.getElementById("year").textContent = new Date().getFullYear();

// ── Download CV ───────────────────────────────────────────────────────────────
// The anchor href="/resume" in index.html handles the download directly.
// No JS override needed — FastAPI serves whatever PDF is in static/resume/.

// ── Init ──────────────────────────────────────────────────────────────────────
initFloatingLabels();
loadPortfolio();
