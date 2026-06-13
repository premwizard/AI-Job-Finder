import os
from typing import List

# Job Search Configuration
ROLES: List[str] = [
    "AI Engineer",
    "Machine Learning Engineer",
    "Full Stack Developer",
    "Software Engineer"
]

LOCATIONS: List[str] = [
    "India",
    "Remote"
]

EXPERIENCE_LEVELS: List[str] = [
    "Internship",
    "Fresher",
    "0-2 years"
]

# SMTP Configuration
SMTP_EMAIL = os.environ.get("SMTP_EMAIL", "")
SMTP_PASSWORD = os.environ.get("SMTP_PASSWORD", "")
RECEIVER_EMAIL = os.environ.get("RECEIVER_EMAIL", "")
SMTP_SERVER = "smtp.gmail.com"
SMTP_PORT = 465

# State
STATE_FILE = "seen_jobs.json"
