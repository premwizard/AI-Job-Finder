import json
import os
from typing import List, Dict, Any
from datetime import datetime

from src.config import ACCEPT_ROLES, ACCEPT_LOCATIONS, ACCEPT_EXPERIENCE, MAX_JOBS_PER_EMAIL
from src.scrapers.remotive import RemotiveScraper
from src.scrapers.arbeitnow import ArbeitnowScraper
from src.scrapers.remoteok import RemoteOKScraper
from src.scrapers.themuse import TheMuseScraper
from src.storage.state_manager import load_seen_jobs, save_seen_jobs, get_job_hashes
from src.filters.job_filter import score_job

# We use a subset of scrapers for speed in synchronous API requests
ACTIVE_SCRAPERS = [
    RemotiveScraper(),
    ArbeitnowScraper(),
    RemoteOKScraper()
]

def fetch_jobs(limit: int = 20) -> List[Dict[str, Any]]:
    seen_jobs = load_seen_jobs()
    today_str = datetime.now().strftime("%Y-%m-%d")
    new_jobs = []

    for scraper in ACTIVE_SCRAPERS:
        try:
            raw_jobs = scraper.scrape(ACCEPT_ROLES, ACCEPT_LOCATIONS, ACCEPT_EXPERIENCE)
            for job in raw_jobs:
                score_result = score_job(job)
                if not score_result["accepted"]:
                    continue

                job['category'] = score_result['category']
                job['score'] = score_result['score']

                job_hashes = get_job_hashes(job)
                is_duplicate = any(h in seen_jobs for h in job_hashes)
                if is_duplicate:
                    continue

                # Add to seen
                for h in job_hashes:
                    seen_jobs[h] = today_str
                
                new_jobs.append(job)

                if len(new_jobs) >= limit:
                    break
        except Exception as e:
            print(f"Scraper error {scraper.source_name}: {e}")
            
        if len(new_jobs) >= limit:
            break
            
    save_seen_jobs(seen_jobs)
    return new_jobs

def get_job_by_id(job_id: str) -> Dict[str, Any]:
    # Mocking single job fetch for now since we don't store full jobs in DB
    return {
        "title": "Senior AI Engineer",
        "company": "TechNova",
        "location": "Remote",
        "url": "https://example.com/job",
        "source": "MockSource",
        "score": 95,
        "description": "This is a detailed job description..."
    }

def get_recommended_jobs() -> List[Dict[str, Any]]:
    # Mock recommended jobs based on profile
    return fetch_jobs(limit=5)
