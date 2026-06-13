import sys
import os

# Add project root to python path if not running from root
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from src.config import ROLES, LOCATIONS, EXPERIENCE_LEVELS, EMAIL, EMAIL_PASSWORD, RECEIVER_EMAIL, STATE_FILE
from src.scrapers.wellfound import WellfoundScraper
from src.scrapers.greenhouse import GreenhouseScraper
from src.scrapers.lever import LeverScraper
from src.storage.state_manager import load_seen_jobs, save_seen_jobs
from src.notifications.email_sender import send_job_email

def run_diagnostics():
    print("=== AI JOB Finder Diagnostics ===\n")
    print(f"EMAIL configured: {'YES' if EMAIL else 'NO'}")
    print(f"EMAIL_PASSWORD configured: {'YES' if EMAIL_PASSWORD else 'NO'}")
    print(f"Receiver email configured: {'YES' if RECEIVER_EMAIL else 'NO'}\n")
    
    try:
        import duckduckgo_search
        print("DuckDuckGo available: YES\n")
    except ImportError:
        print("DuckDuckGo available: NO\n")
        
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
        WellfoundScraper(),
        GreenhouseScraper(),
        LeverScraper()
    ]
    
    for scraper in scrapers:
        print(f"Running {scraper.source_name} scraper...")
        try:
            jobs = scraper.scrape(ROLES, LOCATIONS, EXPERIENCE_LEVELS)
            for job in jobs:
                # We use the apply_link as the unique identifier for a job
                job_id = job['apply_link']
                if job_id not in seen_jobs:
                    seen_jobs.add(job_id)
                    new_jobs.append(job)
        except Exception as e:
            print(f"Scraper {scraper.source_name} failed: {e}")
                
    print(f"Found {len(new_jobs)} new jobs.")
    
    if new_jobs:
        print("Sending email notification...")
        send_job_email(new_jobs)
        print("Saving updated seen jobs state...")
        save_seen_jobs(seen_jobs)
    else:
        print("No new jobs found. Skipping email.")

if __name__ == "__main__":
    main()
