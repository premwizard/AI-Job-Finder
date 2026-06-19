import json
import os
from typing import List, Dict, Any

DB_FILE = os.path.join(os.path.dirname(__file__), "..", "saved_jobs_db.json")

def load_saved_jobs() -> List[Dict[str, Any]]:
    if not os.path.exists(DB_FILE):
        return []
    with open(DB_FILE, "r") as f:
        return json.load(f)

def save_saved_jobs(jobs: List[Dict[str, Any]]):
    with open(DB_FILE, "w") as f:
        json.dump(jobs, f, indent=2)

def get_saved_jobs() -> List[Dict[str, Any]]:
    return load_saved_jobs()

def add_saved_job(job: Dict[str, Any]) -> Dict[str, Any]:
    jobs = load_saved_jobs()
    # Check if exists
    if any(j.get("id") == job.get("id") for j in jobs):
        return job
    jobs.append(job)
    save_saved_jobs(jobs)
    return job

def delete_saved_job(job_id: str) -> bool:
    jobs = load_saved_jobs()
    initial_len = len(jobs)
    jobs = [j for j in jobs if j.get("id") != job_id]
    if len(jobs) < initial_len:
        save_saved_jobs(jobs)
        return True
    return False
