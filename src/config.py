import os
from typing import List

# Job Search Configuration
ROLES: List[str] = [
    "AI Engineer",
    "Machine Learning Engineer",
    "Software Engineer",
    "Full Stack Developer",
    "Backend Developer",
    "Python Developer",
    "AI Developer",
    "Data Engineer"
]

LOCATIONS: List[str] = [
    "India",
    "coimbatore",
    "Remote"
]

# Fresher Filtering Keywords
EXPERIENCE_LEVELS: List[str] = [
    "Internship",
    "Graduate",
    "Fresher",
    "Entry Level",
    "Junior",
    "Associate",
    "0-1 years",
    "0-2 years"
]

# Exclusion Keywords (Reject high experience)
EXCLUDE_KEYWORDS: List[str] = [
    "Senior", "Lead", "Principal", "Manager", "Director", "Staff", 
    "Head", "VP", "3+", "4+", "5+", "6+", "7+", "8+", "10+"
]

# Greenhouse & Lever Target Companies
TARGET_COMPANIES: List[str] = [
    "openai", "anthropic", "huggingface", "scaleai", "cohere", "midjourney"
]

MAX_JOBS_PER_EMAIL = 100

# Adzuna API
ADZUNA_APP_ID = os.environ.get("ADZUNA_APP_ID", "")
ADZUNA_APP_KEY = os.environ.get("ADZUNA_APP_KEY", "")

# SMTP Configuration
EMAIL = os.environ.get("EMAIL", "")
EMAIL_PASSWORD = os.environ.get("EMAIL_PASSWORD", "")
# Default to sending the email to yourself if RECEIVER_EMAIL is missing
RECEIVER_EMAIL = os.environ.get("RECEIVER_EMAIL", EMAIL)
SMTP_SERVER = "smtp.gmail.com"
SMTP_PORT = 587

# State
STATE_FILE = "seen_jobs.json"
