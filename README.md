# Amit Yadav — Portfolio Website

A modern, responsive personal portfolio built with **FastAPI** (backend) and **HTML / CSS / JavaScript** (frontend).

---

## ✨ Features

- Animated hero section with particle canvas & typed text effect
- Skills grid populated from the FastAPI API
- Project showcase with tech tags & highlights
- Work experience and education timeline
- Contact form wired to `POST /api/contact`
- Custom cursor, scroll-reveal animations, mobile-responsive

---

## 🗂 Project Structure

```
AMIT_YADAV_PORTFOLIO/
├── main.py               ← FastAPI app
├── requirements.txt
├── templates/
│   └── index.html        ← Jinja2 template served at /
└── static/
    ├── css/
    │   └── styles.css
    └── js/
        └── script.js
```

---

## 🚀 Quick Start

### 1. Create & activate a virtual environment

```powershell
python -m venv venv
.\venv\Scripts\Activate.ps1
```

### 2. Install dependencies

```powershell
pip install -r requirements.txt
```

### 3. Run the server

```powershell
uvicorn main:app --reload
```

### 4. Open in browser

```
http://127.0.0.1:8000
```

---

## 📡 API Endpoints

| Method | Endpoint         | Description                     |
|--------|------------------|---------------------------------|
| GET    | `/`              | Serves the portfolio HTML page  |
| GET    | `/api/portfolio` | Returns all portfolio data JSON |
| POST   | `/api/contact`   | Accepts contact form submission |
| GET    | `/api/messages`  | Lists all contact messages      |

### Contact POST body example

```json
{
  "name":    "John Doe",
  "email":   "john@example.com",
  "subject": "Project Inquiry",
  "message": "Hi Amit, I'd love to work with you!"
}
```

---

## 🛠 Tech Stack

- **Backend:** FastAPI, Uvicorn, Jinja2, Pydantic
- **Frontend:** HTML5, CSS3 (custom properties, grid, animations), Vanilla JS
- **Icons:** Font Awesome 6
- **Fonts:** Inter, Fira Code (Google Fonts)

---

## 📬 Contact

- Email: ydvamit.me@gmail.com
- Phone: +91 7724949303
