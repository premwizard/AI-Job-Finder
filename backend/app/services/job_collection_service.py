import sys
import os

# To ensure we can import from src if needed
sys.path.append(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))

from sqlalchemy.orm import Session
from app.repositories.job_repository import JobRepository
from src.config import ACCEPT_EXPERIENCE, ACCEPT_LOCATIONS, ACCEPT_ROLES, MAX_JOBS_PER_EMAIL
from src.filters.job_filter import score_job
from src.notifications.email_sender import send_job_email
from src.scrapers.adzuna import AdzunaScraper
from src.scrapers.arbeitnow import ArbeitnowScraper
from src.scrapers.greenhouse import GreenhouseScraper
from src.scrapers.lever import LeverScraper
from src.scrapers.remoteok import RemoteOKScraper
from src.scrapers.remotive import RemotiveScraper
from src.scrapers.themuse import TheMuseScraper
import logging

logger = logging.getLogger(__name__)

class JobCollectionService:
    def __init__(self, db: Session):
        self.db = db
        self.repo = JobRepository(db)
        self.scrapers = [
            RemotiveScraper(),
            ArbeitnowScraper(),
            RemoteOKScraper(),
            TheMuseScraper(),
            AdzunaScraper(),
            GreenhouseScraper(),
            LeverScraper(),
        ]

    def _generate_job_hash(self, job: dict) -> str:
        company = job.get("company", "").lower().strip()
        role = job.get("role", "").lower().strip()
        link = job.get("apply_link", "").strip()
        if link:
            return f"link::{link}"
        return f"comprole::{company}::{role}"

    def run_collection(self):
        new_jobs_for_email = []
        
        for scraper in self.scrapers:
            try:
                raw_jobs = scraper.scrape(ACCEPT_ROLES, ACCEPT_LOCATIONS, ACCEPT_EXPERIENCE)
                for job in raw_jobs:
                    # Score Job
                    score_result = score_job(job)
                    score = score_result["score"]
                    accepted = score_result["accepted"]

                    if not accepted:
                        continue
                        
                    # Check duplicate
                    job_hash = self._generate_job_hash(job)
                    if self.repo.get_job_by_hash(job_hash):
                        continue
                        
                    # Save structured job
                    # Map raw dict to our structured model
                    job_data = {
                        "job_hash": job_hash,
                        "source": scraper.source_name,
                        "original_url": job.get("apply_link", ""),
                        "company_name": job.get("company", "Unknown"),
                        "job_title": job.get("role", "Unknown"),
                        "salary_available": True if job.get("salary") else False,
                        "description_clean": job.get("description", ""),
                        "employment_type": job.get("employment_type"), # If scrapers have it
                    }
                    
                    locations = [{"is_remote": True}] if job.get("location", "").lower() == "remote" else [{"city": job.get("location")}]
                    
                    skills = []
                    # In a real pipeline, we'd extract skills here using an AI Parser
                    # For now we'll just insert what we have
                    
                    new_job = self.repo.create_job(job_data, locations=locations, skills=skills)
                    
                    # Keep original format for email backward compatibility
                    job["category"] = score_result["category"]
                    job["score"] = score
                    new_jobs_for_email.append(job)
                    
                    if len(new_jobs_for_email) >= MAX_JOBS_PER_EMAIL:
                        break
            except Exception as e:
                logger.error(f"Scraper {scraper.source_name} failed: {e}")
                
            if len(new_jobs_for_email) >= MAX_JOBS_PER_EMAIL:
                break
                
        if new_jobs_for_email:
            send_job_email(new_jobs_for_email)
            
        return {"new_jobs_collected": len(new_jobs_for_email)}
