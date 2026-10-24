/* ═══════════════════════════════════════════════════════
   AMIT YADAV PORTFOLIO — script.js
   Pure frontend — works on GitHub Pages with no backend.
   Contact form uses Formspree. Resume is a direct PDF link.
   ═══════════════════════════════════════════════════════ */

"use strict";

// ── Backend URL — only used for contact form ──────────────────────────────────
// On GitHub Pages, point to your Render backend.
// Locally, points to FastAPI on port 8000.
const BACKEND_URL = window.location.hostname === "127.0.0.1" || window.location.hostname === "localhost"
  ? "http://127.0.0.1:8000"
  : "https://my-portfolio-opus.onrender.com";

// ── Resume — direct link to PDF (relative, works on GitHub Pages) ─────────────
const RESUME_URL = "static/resume/Amit-Yadav-Resume.pdf";

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
  "Backend Developer",
  "FastAPI Expert",
  "Python Developer",
  "REST API Builder",
  "AI Integration Engineer",
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

// ── Portfolio Data (hardcoded — no backend needed) ────────────────────────────
const PORTFOLIO_DATA = {
  skills: {
    "Languages & DSA": ["Python", "JavaScript", "SQL", "Arrays", "Binary Search", "Sorting"],
    "Backend":         ["FastAPI", "REST APIs", "SQLAlchemy ORM", "JWT Authentication", "Owner-Based Authorization", "Pydantic Validation", "Middleware", "Error Handling"],
    "Frontend":        ["HTML5", "CSS3", "Vanilla JavaScript", "DOM Manipulation", "Async Fetch API", "LocalStorage", "Responsive UI"],
    "Databases":       ["PostgreSQL (Supabase)", "Relational Schema Design", "Normalization", "Indexing", "Foreign Keys"],
    "AI":              ["Groq API Integration", "Semantic Search", "Sentence Transformers", "AI Summarization"],
    "DevOps & Testing":["Pytest", "GitHub Actions (CI/CD)", "Docker", "Postman", "Swagger UI", "Render", "GitHub Pages"],
  },
  projects: [
    {
      name: "Zomato Notes",
      icon: "📝",
      description:
        "Internal knowledge base for on-call support engineers — JWT-protected CRUD APIs, keyword search, tag filtering, and AI summarization over an indexed Supabase (PostgreSQL) schema. Typical endpoints respond in 3–9 ms.",
      highlights: [
        "JWT-protected CRUD APIs with keyword search and tag filtering; typical endpoints respond in 3–9 ms.",
        "Owner-based authorization: editing/deleting a note requires a matching x-user-id + token; verified with 401/403/200 tests.",
        "36 pytest integration tests; GitHub Actions runs them on every push/PR to gate Render deploys.",
        "Semantic search with sentence-transformers and cosine similarity; lazy-loaded model for 4.6 s startup and ~385 ms warm queries.",
        "Groq API integration to generate note content, suggest tags from titles, and summarize notes.",
      ],
      tech: ["FastAPI", "PostgreSQL", "SQLAlchemy", "JWT", "Groq API", "Pytest", "GitHub Actions", "Render"],
      github: "#",
      demo: "#",
    },
    {
      name: "MY_LLM",
      icon: "🤖",
      description:
        "AI chat assistant built with FastAPI and JavaScript, storing messages and conversation IDs in Supabase (PostgreSQL) for persistent history. Responses streamed via Server-Sent Events.",
      highlights: [
        "Groq API called server-side through FastAPI; responses streamed to the frontend using Server-Sent Events (SSE).",
        "Persistent conversation history stored in Supabase (PostgreSQL) with conversation IDs.",
        "Pydantic request validation; API tested with Postman and Swagger UI.",
        "Automatic deployments from GitHub to GitHub Pages (frontend) and Render (backend) on every push.",
      ],
      tech: ["FastAPI", "PostgreSQL", "Groq API", "SSE", "JavaScript", "Pydantic", "GitHub Actions"],
      github: "#",
      demo: "#",
    },
    {
      name: "LinkSnap",
      icon: "🔗",
      description:
        "URL shortener that converts long URLs into short links and records every click with a timestamp. Dockerised with docker-compose and deployed on Render with Supabase.",
      highlights: [
        "Atomic click recording — INSERT + counter UPDATE in one transaction; rollback verified with a monkeypatched pytest failure (18 tests passing).",
        "Dockerised with docker-compose (API + PostgreSQL); CI via GitHub Actions; deployed on Render with Supabase.",
        "Feature-branch Git workflow: frontend built on a separate branch and merged via GitHub pull request.",
      ],
      tech: ["FastAPI", "PostgreSQL", "Docker", "GitHub Actions", "Render", "JavaScript"],
      github: "#",
      demo: "#",
    },
  ],
  experience: [
    {
      company:     "InternPe",
      role:        "Web Development Intern",
      period:      "03/2024 – 07/2024",
      location:    "Remote",
      description: "Built a responsive e-commerce website (HTML, CSS, JS) backed by a FastAPI REST API and PostgreSQL database. Implemented shopping-cart functionality with quantity updates and automatic total-price recalculation.",
    },
  ],
  education: [
    {
      degree:      "Software Development & Applied AI",
      institution: "Masai School",
      period:      "03/2026 – 07/2026",
      location:    "Remote",
    },
    {
      degree:      "B.Tech",
      institution: "Rajiv Gandhi Proudyogiki Vishwavidyalaya (RGPV)",
      period:      "11/2022 – 04/2026",
      location:    "Bhopal",
    },
  ],
};

// ── Render all sections instantly ─────────────────────────────────────────────
function loadPortfolio() {
  renderSkills(PORTFOLIO_DATA.skills);
  renderProjects(PORTFOLIO_DATA.projects);
  renderExperience(PORTFOLIO_DATA.experience);
  renderEducation(PORTFOLIO_DATA.education);
  addReveal(".skill-card", 0.07);
  addReveal(".project-card", 0.1);
  addReveal(".timeline-item", 0.1);
  addReveal(".about-grid, .contact-grid", 0);
}

const skillIcons = {
  "Languages & DSA": "fas fa-code",
  "Backend":         "fas fa-server",
  "Frontend":        "fas fa-laptop-code",
  "Databases":       "fas fa-database",
  "AI":              "fas fa-brain",
  "DevOps & Testing":"fas fa-tools",
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
          <a href="${p.github}" class="project-link" aria-label="Source Code" title="Source Code"><i class="fab fa-github"></i></a>
          <a href="${p.demo}" class="project-link" aria-label="Live Demo" title="Live Demo"><i class="fas fa-external-link-alt"></i></a>
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

// ── Contact Form — Formspree (no backend needed) ──────────────────────────────
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
    validateField("name",    "name-error",    v => v.trim().length >= 2,                         "At least 2 characters required.") &
    validateField("email",   "email-error",   v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()), "Enter a valid email address.") &
    validateField("message", "message-error", v => v.trim().length >= 10,                        "At least 10 characters required.");
  if (!ok) return;

  btnText.hidden = true; btnLoading.hidden = false; submitBtn.disabled = true;

  const payload = {
    name:    document.getElementById("name").value.trim(),
    email:   document.getElementById("email").value.trim(),
    subject: document.getElementById("subject").value.trim() || "No Subject",
    message: document.getElementById("message").value.trim(),
  };

  try {
    const res  = await fetch(`${BACKEND_URL}/api/contact`, {
      method:  "POST",
      headers: { "Content-Type": "application/json" },
      body:    JSON.stringify(payload),
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

// ── Download CV — direct PDF link, no backend ─────────────────────────────────
document.getElementById("download-resume")?.addEventListener("click", (e) => {
  e.preventDefault();
  const a = document.createElement("a");
  a.href     = RESUME_URL;
  a.download = RESUME_URL.split("/").pop();
  a.click();
});

// ── Init ──────────────────────────────────────────────────────────────────────
initFloatingLabels();
loadPortfolio();
