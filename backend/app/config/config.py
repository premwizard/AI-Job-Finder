import os
from typing import List
from dotenv import load_dotenv

load_dotenv()

# --- SCORING ENGINE CONFIGURATION ---

SCORE_THRESHOLD = 50

ACCEPT_ROLES: List[str] = [
    "AI Engineer",
    "Machine Learning Engineer",
    "ML Engineer",
    "Software Engineer",
    "Backend Developer",
    "Full Stack Developer",
    "Python Developer",
    "AI Developer",
    "Data Engineer",
    "Junior Developer",
    "Associate Developer"
]

REJECT_DOMAINS: List[str] = [
    "iOS", "Android", "Mobile", "DevOps", "SRE", "QA", "Embedded"
]

ACCEPT_EXPERIENCE: List[str] = [
    "Internship", "Fresher", "Entry Level", "Junior", "Graduate", "Associate", "0-2 years", "0-1 years"
]

REJECT_EXPERIENCE: List[str] = [
    "Senior", "Staff", "Principal", "Lead", "Manager", "Director", "Architect", 
    "3+ years", "4+ years", "5+ years", "6+ years", "7+ years", "8+ years", "10+ years", "3+", "4+", "5+"
]

ACCEPT_LOCATIONS: List[str] = [
    "India", "coimbatore", "Remote"
]

REJECT_LOCATIONS: List[str] = [
    "USA only", "Brazil only", "Germany only", "Europe only", "Americas only"
]

# --- SCRAPER CONFIGURATION ---

TARGET_COMPANIES: List[str] = [
    "openai", "anthropic", "huggingface", "scaleai", "cohere", "midjourney"
]

MAX_JOBS_PER_EMAIL = 100

ADZUNA_APP_ID = os.environ.get("ADZUNA_APP_ID", "")
ADZUNA_APP_KEY = os.environ.get("ADZUNA_APP_KEY", "")

# --- NOTIFICATION & STATE ---
EMAIL = os.environ.get("EMAIL", "")
EMAIL_PASSWORD = os.environ.get("EMAIL_PASSWORD", "")
RECEIVER_EMAIL = os.environ.get("RECEIVER_EMAIL", EMAIL)
SMTP_SERVER = "smtp.gmail.com"
SMTP_PORT = 587
STATE_FILE = "seen_jobs.json"

# --- AUTHENTICATION ---
SECRET_KEY = os.environ.get('SECRET_KEY', 'your-super-secret-key')
ALGORITHM = 'HS256'
ACCESS_TOKEN_EXPIRE_MINUTES = 15
REFRESH_TOKEN_EXPIRE_DAYS = 30
