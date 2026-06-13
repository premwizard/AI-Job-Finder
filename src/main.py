import sys
import os

# Add project root to python path if not running from root
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from src.config import ROLES, LOCATIONS, EXPERIENCE_LEVELS, EMAIL, EMAIL_PASSWORD, RECEIVER_EMAIL, STATE_FILE
from src.scrapers.remotive import RemotiveScraper
from src.scrapers.arbeitnow import ArbeitnowScraper
from src.storage.state_manager import load_seen_jobs, save_seen_jobs
from src.notifications.email_sender import send_job_email

def run_diagnostics():
    print("=== AI JOB Finder Diagnostics ===\n")
    print(f"EMAIL configured: {'YES' if EMAIL else 'NO'}")
    print(f"EMAIL_PASSWORD configured: {'YES' if EMAIL_PASSWORD else 'NO'}")
    print(f"Receiver email configured: {'YES' if RECEIVER_EMAIL else 'NO'}\n")
    
    try:
        import requests
        print("Requests module available: YES\n")
    except ImportError:
        print("Requests module available: NO\n")
        
    print(f"Storage file exists: {'YES' if os.path.exists(STATE_FILE) else 'NO'}\n")
    
    if os.environ.get('GITHUB_ACTIONS'):
        print("GitHub Actions environment: OK\n")
    else:
        print("GitHub Actions environment: NO (Running locally)\n")
        
    print("=================================\n")

def main():
    run_diagnostics()
    print("Starting AI Job Finder...")
    
    seen_jobs = load_seen_jobs()
    new_jobs = []
    
    scrapers = [
        RemotiveScraper(),
        ArbeitnowScraper()
    ]
    
    total_fetched = 0
    total_duplicates = 0
    
    for scraper in scrapers:
        print(f"Running {scraper.source_name} scraper...")
        try:
            jobs = scraper.scrape(ROLES, LOCATIONS, EXPERIENCE_LEVELS)
            fetched_count = len(jobs)
            total_fetched += fetched_count
            print(f"[{scraper.source_name}] Fetched {fetched_count} potential matches.")
            
            for job in jobs:
                job_id = job['apply_link']
                if job_id in seen_jobs:
                    total_duplicates += 1
                else:
                    seen_jobs.add(job_id)
                    new_jobs.append(job)
        except Exception as e:
            print(f"ERROR: Scraper {scraper.source_name} failed: {e}. Continuing with remaining scrapers...")
                
    print(f"\n=== Summary ===")
    print(f"Total RAW matches fetched: {total_fetched}")
    print(f"Total duplicates skipped: {total_duplicates}")
    print(f"Total NEW jobs to send: {len(new_jobs)}")
    print("===============\n")
    
    if new_jobs:
        print("Sending email notification...")
        send_job_email(new_jobs)
        print("Saving updated seen jobs state...")
        save_seen_jobs(seen_jobs)
    else:
        print("No new jobs found. Skipping email.")

if __name__ == "__main__":
    main()
