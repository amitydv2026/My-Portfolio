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
    "title": "Full Stack Developer",
    "email": "ydvamit.me@gmail.com",
    "phone": "+917724949303",
    "location": "Itarsi, District - Narmadapuram, MP",
    "summary": (
        "Dedicated Full Stack Developer skilled in FastAPI, SQL, HTML, CSS, and JavaScript. "
        "Experienced in building responsive web applications, developing REST APIs, and creating "
        "scalable backend solutions. Strong problem-solving, teamwork, and adaptability with a "
        "commitment to delivering secure, efficient, and high-quality software."
    ),
    "skills": {
        "Languages": ["Python", "JavaScript", "C++"],
        "Database": ["SQL", "Supabase"],
        "Backend": ["FastAPI", "REST APIs", "JWT Authentication", "CRUD Operations"],
        "Frontend": ["HTML", "CSS", "Tailwind CSS"],
        "Tools": ["Git", "GitHub"],
        "Cybersecurity": ["Ethical Hacking"],
    },
    "soft_skills": ["Problem-solving", "Adaptability"],
    "education": [
        {
            "degree": "Software Development",
            "institution": "Masai School",
            "period": "03/2026 – 07/2026",
            "location": "Bengaluru (Remote)",
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
                "A full-stack internal notes and knowledge base application for on-call support "
                "engineers using HTML, CSS, JavaScript, FastAPI, and Supabase."
            ),
            "highlights": [
                "Built REST APIs using FastAPI to create, update, retrieve, and delete (CRUD) incident notes.",
                "Structured and maintained the database to securely organize notes, tags, and related information for efficient retrieval.",
                "Enabled fast note discovery through keyword search and tag-based filtering during live incidents.",
                "Added lightweight AI-assisted note classification and retrieval to improve productivity and reduce time spent searching.",
            ],
            "tech": ["FastAPI", "Supabase", "HTML", "CSS", "JavaScript", "AI"],
            "icon": "📝",
        },
        {
            "name": "MY_LLM",
            "description": (
                "A full-stack AI-powered chat and content generation web application using "
                "HTML, CSS, JavaScript, FastAPI, and SQL database."
            ),
            "highlights": [
                "Built secure user authentication and account management for sign-up, login, and personalized access.",
                "Implemented multi-turn AI conversations, allowing users to interact with the AI while maintaining conversation context.",
                "Added AI-powered image generation from text descriptions and persistent conversation history accessible across devices.",
                "Designed and maintained backend APIs for AI requests, user data, conversations, and content generation with a responsive web interface.",
            ],
            "tech": ["FastAPI", "SQL", "HTML", "CSS", "JavaScript", "AI", "JWT"],
            "icon": "🤖",
        },
    ],
    "experience": [
        {
            "company": "INTERNSELITE",
            "role": "Cyber Security Intern",
            "period": "06/25 – 08/25",
            "location": "Remote",
            "description": "Worked on ethical hacking, vulnerability assessment, and cybersecurity best practices.",
        },
        {
            "company": "InternPe",
            "role": "Web Development Intern",
            "period": "03/24 – 07/24",
            "location": "Remote",
            "description": "Developed web interfaces and gained hands-on experience in frontend technologies.",
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
