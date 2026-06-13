import sys
import os

# Add project root to python path if not running from root
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from src.config import ROLES, LOCATIONS, EXPERIENCE_LEVELS, EMAIL, EMAIL_PASSWORD, RECEIVER_EMAIL, STATE_FILE, MAX_JOBS_PER_EMAIL
from src.scrapers.remotive import RemotiveScraper
from src.scrapers.arbeitnow import ArbeitnowScraper
from src.scrapers.remoteok import RemoteOKScraper
from src.scrapers.themuse import TheMuseScraper
from src.scrapers.adzuna import AdzunaScraper
from src.scrapers.greenhouse import GreenhouseScraper
from src.scrapers.lever import LeverScraper
from src.storage.state_manager import load_seen_jobs, save_seen_jobs, get_job_hashes
from src.filters.job_filter import filter_job
from src.notifications.email_sender import send_job_email

def run_diagnostics():
    print("=== AI JOB Finder V2 Diagnostics ===\n")
    print(f"EMAIL configured: {'YES' if EMAIL else 'NO'}")
    print(f"EMAIL_PASSWORD configured: {'YES' if EMAIL_PASSWORD else 'NO'}")
    print(f"Receiver email configured: {'YES' if RECEIVER_EMAIL else 'NO'}\n")
    print(f"Storage file exists: {'YES' if os.path.exists(STATE_FILE) else 'NO'}\n")
    print("====================================\n")

def main():
    run_diagnostics()
    print("Starting AI Job Finder V2 Pipeline...")
    
    seen_jobs = load_seen_jobs()
    new_jobs = []
    
    scrapers = [
        RemotiveScraper(),
        ArbeitnowScraper(),
        RemoteOKScraper(),
        TheMuseScraper(),
        AdzunaScraper(),
        GreenhouseScraper(),
        LeverScraper()
    ]
    
    stats = {
        "fetched": 0,
        "discarded_by_filter": 0,
        "discarded_by_duplicate": 0,
        "sent": 0
    }
    
    for scraper in scrapers:
        print(f"\nRunning {scraper.source_name} scraper...")
        try:
            raw_jobs = scraper.scrape(ROLES, LOCATIONS, EXPERIENCE_LEVELS)
            stats["fetched"] += len(raw_jobs)
            print(f"[{scraper.source_name}] Fetched {len(raw_jobs)} raw jobs.")
            
            for job in raw_jobs:
                # 1. Filter Job
                filtered_job = filter_job(job)
                if not filtered_job:
                    stats["discarded_by_filter"] += 1
                    continue
                    
                # 2. Check Duplicates
                job_hashes = get_job_hashes(filtered_job)
                is_duplicate = False
                for j_hash in job_hashes:
                    if j_hash in seen_jobs:
                        is_duplicate = True
                        break
                        
                if is_duplicate:
                    stats["discarded_by_duplicate"] += 1
                    continue
                    
                # 3. Accept Job
                for j_hash in job_hashes:
                    seen_jobs.add(j_hash)
                new_jobs.append(filtered_job)
                stats["sent"] += 1
                
                # Enforce Max Jobs Limit
                if len(new_jobs) >= MAX_JOBS_PER_EMAIL:
                    print(f"Reached MAX_JOBS_PER_EMAIL ({MAX_JOBS_PER_EMAIL}). Stopping search.")
                    break
                    
        except Exception as e:
            print(f"ERROR: Scraper {scraper.source_name} failed: {e}. Continuing with remaining scrapers...")
            
        if len(new_jobs) >= MAX_JOBS_PER_EMAIL:
            break
                
    print(f"\n=== V2 Pipeline Summary ===")
    print(f"Total RAW jobs fetched: {stats['fetched']}")
    print(f"Discarded by Fresher/Location Filters: {stats['discarded_by_filter']}")
    print(f"Discarded as Duplicates: {stats['discarded_by_duplicate']}")
    print(f"Total NEW jobs to send: {stats['sent']}")
    print("===========================\n")
    
    if new_jobs:
        print("Sending grouped email notification...")
        send_job_email(new_jobs)
        print("Saving updated seen jobs state...")
        save_seen_jobs(seen_jobs)
    else:
        print("No new jobs found. Skipping email.")

if __name__ == "__main__":
    main()
