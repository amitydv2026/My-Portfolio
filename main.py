from fastapi import FastAPI, HTTPException
from fastapi.staticfiles import StaticFiles
from fastapi.responses import HTMLResponse, FileResponse
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import datetime
import sqlite3
import os

app = FastAPI(title="Amit Yadav Portfolio")

# ── Database setup ─────────────────────────────────────────────────────────────

# ── Resume config — auto-detects any PDF in static/resume/ ───────────────────
RESUME_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), "static", "resume")

def get_resume_file():
    """Return the first PDF found in static/resume/, or None."""
    print(f"[resume] Looking in: {RESUME_DIR}")
    if not os.path.isdir(RESUME_DIR):
        print(f"[resume] Directory does not exist: {RESUME_DIR}")
        return None, None
    files = os.listdir(RESUME_DIR)
    print(f"[resume] Files found: {files}")
    for f in files:
        if f.lower().endswith(".pdf"):
            full_path = os.path.join(RESUME_DIR, f)
            print(f"[resume] Serving: {full_path}")
            return full_path, f
    print("[resume] No PDF found.")
    return None, None


DB_PATH = os.path.join(os.getenv("DB_DIR", os.path.dirname(__file__)), "portfolio.db")

def get_db():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    conn = get_db()
    conn.execute("""
        CREATE TABLE IF NOT EXISTS messages (
            id        INTEGER PRIMARY KEY AUTOINCREMENT,
            name      TEXT    NOT NULL,
            email     TEXT    NOT NULL,
            subject   TEXT    NOT NULL DEFAULT 'No Subject',
            message   TEXT    NOT NULL,
            timestamp TEXT    NOT NULL
        )
    """)
    conn.commit()
    conn.close()

init_db()

# CORS — explicit origins allow credentials to be used safely
ALLOWED_ORIGINS = os.getenv(
    "ALLOWED_ORIGINS",
    "http://localhost:5500,http://127.0.0.1:5500,http://localhost:8000,http://127.0.0.1:8000,https://my-portfolio-opus.onrender.com"
).split(",")

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["GET", "POST", "OPTIONS"],
    allow_headers=["Content-Type", "Accept"],
)

# Static files
app.mount("/static", StaticFiles(directory="static"), name="static")


# ── Models ────────────────────────────────────────────────────────────────────

class ContactMessage(BaseModel):
    name: str
    email: str
    subject: str = "No Subject"
    message: str



# ── Portfolio data ─────────────────────────────────────────────────────────────

PORTFOLIO_DATA = {
    "name": "Amit Yadav",
    "title": "Backend Developer",
    "email": "ydvamit.me@gmail.com",
    "phone": "+917724949303",
    "location": "Itarsi, MP, India",
    "summary": (
        "Backend Developer and B.Tech graduate (2026) trained in Software Development & Applied AI "
        "at Masai School. Built and deployed backend applications using Python, FastAPI, SQLAlchemy ORM, "
        "PostgreSQL, and JavaScript. Strong foundation in DSA (30+ LeetCode problems), modular REST APIs, "
        "JWT and owner-based authorization, automated pytest, Git workflows, and LLM API integration."
    ),
    "skills": {
        "Languages & DSA": ["Python", "JavaScript", "SQL", "Arrays", "Binary Search", "Sorting"],
        "Backend": ["FastAPI", "REST APIs", "SQLAlchemy ORM", "JWT Authentication", "Owner-Based Authorization", "Pydantic Validation", "Middleware", "Error Handling"],
        "Frontend": ["HTML5", "CSS3", "Vanilla JavaScript", "DOM Manipulation", "Async Fetch API", "LocalStorage", "Responsive UI"],
        "Databases": ["PostgreSQL (Supabase)", "Relational Schema Design", "Normalization", "Indexing", "Foreign Keys"],
        "AI": ["Groq API Integration", "Semantic Search", "Sentence Transformers", "AI Summarization"],
        "DevOps & Testing": ["Pytest", "GitHub Actions (CI/CD)", "Docker", "Postman", "Swagger UI", "Render", "GitHub Pages"],
    },
    "soft_skills": ["Problem-solving", "Adaptability"],
    "education": [
        {
            "degree": "Software Development & Applied AI",
            "institution": "Masai School",
            "period": "03/2026 – 07/2026",
            "location": "Remote",
        },
        {
            "degree": "B.Tech",
            "institution": "Rajiv Gandhi Proudyogiki Vishwavidyalaya (RGPV)",
            "period": "11/2022 – 04/2026",
            "location": "Bhopal",
        },
    ],
    "projects": [
        {
            "name": "Zomato Notes",
            "description": (
                "Internal knowledge base for on-call support engineers — JWT-protected CRUD APIs, "
                "keyword search, tag filtering, and AI summarization over an indexed Supabase (PostgreSQL) "
                "schema. Typical endpoints respond in 3–9 ms."
            ),
            "highlights": [
                "JWT-protected CRUD APIs with keyword search and tag filtering; typical endpoints respond in 3–9 ms.",
                "Normalized PostgreSQL users and notes tables with SQLAlchemy ORM and foreign-key constraints.",
                "Owner-based authorization: editing/deleting a note requires a matching x-user-id + token; verified with 401/403/200 tests.",
                "36 pytest integration tests; GitHub Actions runs them on every push/PR to gate Render deploys.",
                "Semantic search with sentence-transformers and cosine similarity; lazy-loaded model for 4.6 s startup and ~385 ms warm queries.",
                "Groq API integration to generate note content, suggest tags from titles, and summarize notes.",
            ],
            "tech": ["FastAPI", "PostgreSQL", "SQLAlchemy", "JWT", "Groq API", "Pytest", "GitHub Actions", "Render"],
            "icon": "📝",
        },
        {
            "name": "MY_LLM",
            "description": (
                "AI chat assistant built with FastAPI and JavaScript, storing messages and conversation IDs "
                "in Supabase (PostgreSQL) for persistent history. Responses streamed via Server-Sent Events."
            ),
            "highlights": [
                "Groq API called server-side through FastAPI; responses streamed to the frontend using Server-Sent Events (SSE).",
                "Persistent conversation history stored in Supabase (PostgreSQL) with conversation IDs.",
                "Pydantic request validation; API tested with Postman and Swagger UI.",
                "Automatic deployments from GitHub to GitHub Pages (frontend) and Render (backend) on every push.",
            ],
            "tech": ["FastAPI", "PostgreSQL", "Groq API", "SSE", "JavaScript", "Pydantic", "GitHub Actions"],
            "icon": "🤖",
        },
        {
            "name": "LinkSnap",
            "description": (
                "URL shortener that converts long URLs into short links and records every click with a timestamp. "
                "Dockerised with docker-compose and deployed on Render with Supabase."
            ),
            "highlights": [
                "Atomic click recording — INSERT + counter UPDATE in one transaction; rollback verified with a monkeypatched pytest failure (18 tests passing).",
                "Dockerised with docker-compose (API + PostgreSQL); CI via GitHub Actions; deployed on Render with Supabase.",
                "Feature-branch Git workflow: frontend built on a separate branch and merged via GitHub pull request.",
            ],
            "tech": ["FastAPI", "PostgreSQL", "Docker", "GitHub Actions", "Render", "JavaScript"],
            "icon": "🔗",
        },
    ],
    "experience": [
        {
            "company": "InternPe",
            "role": "Web Development Intern",
            "period": "03/2024 – 07/2024",
            "location": "Remote",
            "description": (
                "Built a responsive e-commerce website with HTML, CSS, and JavaScript, backed by a FastAPI "
                "REST API and PostgreSQL database serving category-wise product listings. Implemented "
                "shopping-cart functionality with quantity updates and automatic total-price recalculation, "
                "persisting cart data in PostgreSQL through FastAPI endpoints (add, update, remove), with "
                "validation to block negative quantities."
            ),
        },
    ],
}


# ── Routes ─────────────────────────────────────────────────────────────────────

@app.get("/", response_class=HTMLResponse)
async def index():
    return FileResponse("index.html")


@app.get("/api/portfolio")
async def get_portfolio():
    """Return all portfolio data as JSON."""
    return PORTFOLIO_DATA


@app.post("/api/contact")
async def contact(msg: ContactMessage):
    """Accept a contact form submission and persist to SQLite."""
    if not msg.name.strip() or not msg.email.strip() or not msg.message.strip():
        raise HTTPException(status_code=400, detail="Name, email, and message are required.")

    timestamp = datetime.datetime.now(datetime.timezone.utc).isoformat()
    conn = get_db()
    try:
        conn.execute(
            "INSERT INTO messages (name, email, subject, message, timestamp) VALUES (?, ?, ?, ?, ?)",
            (msg.name, msg.email, msg.subject, msg.message, timestamp),
        )
        conn.commit()
    finally:
        conn.close()

    return {"success": True, "message": f"Thanks {msg.name}! Your message has been received. I'll get back to you soon."}


@app.get("/resume")
async def download_resume():
    """Serve whatever PDF is in static/resume/ for download."""
    path, filename = get_resume_file()
    if not path:
        raise HTTPException(status_code=404, detail="Resume not found.")
    return FileResponse(
        path,
        media_type="application/pdf",
        filename=filename
    )


async def get_messages():
    """Retrieve all stored contact messages (admin use)."""
    conn = get_db()
    try:
        rows = conn.execute("SELECT * FROM messages ORDER BY id DESC").fetchall()
        messages = [dict(row) for row in rows]
    finally:
        conn.close()
    return {"total": len(messages), "messages": messages}
