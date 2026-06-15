import json
import os
from datetime import datetime, timedelta
from typing import List, Dict
from src.config import STATE_FILE

WEEKLY_STATS_FILE = "weekly_stats.json"

def load_seen_jobs() -> Dict[str, str]:
    """Load seen jobs and purge entries older than 30 days."""
    if not os.path.exists(STATE_FILE):
        return {}
        
    try:
        with open(STATE_FILE, "r") as f:
            data = json.load(f)
            
        # Legacy list support migration (from previous versions)
        if isinstance(data, list):
            today_str = datetime.now().strftime("%Y-%m-%d")
            data = {item: today_str for item in data}
            
        # Expiration logic
        cutoff_date = datetime.now() - timedelta(days=30)
        cleaned_data = {}
        for k, v in data.items():
            try:
                item_date = datetime.strptime(v, "%Y-%m-%d")
                if item_date >= cutoff_date:
                    cleaned_data[k] = v
            except ValueError:
                # If date format is broken, keep it and reset date
                cleaned_data[k] = datetime.now().strftime("%Y-%m-%d")
                
        return cleaned_data
    except Exception as e:
        print(f"Error loading seen jobs: {e}")
        return {}

def save_seen_jobs(seen_jobs: Dict[str, str]):
    """Save the seen jobs dictionary."""
    try:
        with open(STATE_FILE, "w") as f:
            json.dump(seen_jobs, f, indent=4)
    except Exception as e:
        print(f"Error saving seen jobs: {e}")

def get_job_hashes(job: dict) -> List[str]:
    """Generate duplicate detection hashes for a job (URL and Company+Role)."""
    company = job.get('company', '').lower().strip()
    role = job.get('role', '').lower().strip()
    link = job.get('apply_link', '').strip()
    
    hashes = []
    if link:
        hashes.append(f"link::{link}")
    if company and role and company != "unknown":
        hashes.append(f"comprole::{company}::{role}")
    return hashes

def load_weekly_stats() -> List[Dict]:
    if not os.path.exists(WEEKLY_STATS_FILE):
        return []
    try:
        with open(WEEKLY_STATS_FILE, "r") as f:
            return json.load(f)
    except Exception as e:
        print(f"Error loading weekly stats: {e}")
        return []

def save_weekly_stats(stats: List[Dict]):
    try:
        with open(WEEKLY_STATS_FILE, "w") as f:
            json.dump(stats, f, indent=4)
    except Exception as e:
        print(f"Error saving weekly stats: {e}")
