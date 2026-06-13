import sys
import os
from datetime import datetime

# Add project root to python path if not running from root
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from src.config import ACCEPT_ROLES, ACCEPT_LOCATIONS, ACCEPT_EXPERIENCE, EMAIL, EMAIL_PASSWORD, RECEIVER_EMAIL, STATE_FILE, MAX_JOBS_PER_EMAIL
from src.scrapers.remotive import RemotiveScraper
from src.scrapers.arbeitnow import ArbeitnowScraper
from src.scrapers.remoteok import RemoteOKScraper
from src.scrapers.themuse import TheMuseScraper
from src.scrapers.adzuna import AdzunaScraper
from src.scrapers.greenhouse import GreenhouseScraper
from src.scrapers.lever import LeverScraper
from src.storage.state_manager import load_seen_jobs, save_seen_jobs, get_job_hashes, load_weekly_stats, save_weekly_stats
from src.filters.job_filter import score_job
from src.notifications.email_sender import send_job_email, send_weekly_email

class AnalyticsTracker:
    def __init__(self):
        self.raw_jobs = 0
        self.duplicates = 0
        self.new_jobs = 0
        self.rejection_reasons = {
            "Score too low": 0,
            "Penalty: Rejected Experience": 0,
            "Penalty: Rejected Domain": 0,
            "Penalty: Rejected Location": 0,
            "No accepted role matched": 0,
            "Location not in accepted list": 0
        }
        self.source_health = {}

    def log_source_health(self, source: str, fetched: int, status: str):
        self.source_health[source] = {"fetched": fetched, "status": status}

    def record_rejection(self, reason: str):
        if "Score" in reason and "<" in reason:
            self.rejection_reasons["Score too low"] += 1
        elif "Penalty: Rejected Experience" in reason:
            self.rejection_reasons["Penalty: Rejected Experience"] += 1
        elif "Penalty: Rejected Domain" in reason:
            self.rejection_reasons["Penalty: Rejected Domain"] += 1
        elif "Penalty: Rejected Location" in reason:
            self.rejection_reasons["Penalty: Rejected Location"] += 1
        elif "No accepted role matched" in reason:
            self.rejection_reasons["No accepted role matched"] += 1
        elif "Location not in accepted list" in reason:
            self.rejection_reasons["Location not in accepted list"] += 1
        else:
            if reason not in self.rejection_reasons:
                self.rejection_reasons[reason] = 0
            self.rejection_reasons[reason] += 1
            
    def print_summary(self):
        print("\n" + "="*40)
        print("V3.1 Analytics & Monitoring Report")
        print("="*40)
        
        print("\nPipeline Statistics:")
        print(f"Total RAW jobs fetched: {self.raw_jobs}")
        total_filtered = sum(self.rejection_reasons.values())
        print(f"Discarded by Filters/Score: {total_filtered}")
        print(f"Discarded as Duplicates: {self.duplicates}")
        print(f"Total NEW jobs to send: {self.new_jobs}")
        
        print("\nDetailed Rejection Reasons:")
        for reason, count in sorted(self.rejection_reasons.items(), key=lambda x: x[1], reverse=True):
            if count > 0:
                print(f"  - {reason}: {count}")
                
        print("\nSource Health Monitoring:")
        for source, health in self.source_health.items():
            status_icon = "[OK]" if health['status'] == 'OK' else "[FAIL]"
            print(f"  {status_icon} {source.ljust(15)} | Fetched: {health['fetched']} | Status: {health['status']}")
            
        print("="*40 + "\n")

def run_diagnostics():
    print("=== AI JOB Finder V3.1 Diagnostics ===\n")
    print(f"EMAIL configured: {'YES' if EMAIL else 'NO'}")
    print(f"EMAIL_PASSWORD configured: {'YES' if EMAIL_PASSWORD else 'NO'}")
    print(f"Receiver email configured: {'YES' if RECEIVER_EMAIL else 'NO'}\n")
    print(f"Storage file exists: {'YES' if os.path.exists(STATE_FILE) else 'NO'}\n")
    print("======================================\n")

def main():
    run_diagnostics()
    print("Starting AI Job Finder V3.1 Pipeline...")
    
    seen_jobs = load_seen_jobs()
    today_str = datetime.now().strftime("%Y-%m-%d")
    new_jobs = []
    tracker = AnalyticsTracker()
    
    scrapers = [
        RemotiveScraper(),
        ArbeitnowScraper(),
        RemoteOKScraper(),
        TheMuseScraper(),
        AdzunaScraper(),
        GreenhouseScraper(),
        LeverScraper()
    ]
    
    for scraper in scrapers:
        print(f"\nRunning {scraper.source_name} scraper...")
        try:
            raw_jobs = scraper.scrape(ACCEPT_ROLES, ACCEPT_LOCATIONS, ACCEPT_EXPERIENCE)
            tracker.raw_jobs += len(raw_jobs)
            tracker.log_source_health(scraper.source_name, len(raw_jobs), "OK")
            print(f"[{scraper.source_name}] Fetched {len(raw_jobs)} raw jobs.")
            
            for job in raw_jobs:
                # 1. Score Job
                score_result = score_job(job)
                score = score_result["score"]
                accepted = score_result["accepted"]
                reason = score_result["reason"]
                
                if not accepted:
                    tracker.record_rejection(reason)
                    continue
                    
                job['category'] = score_result['category']
                job['score'] = score
                    
                # 2. Check Duplicates
                job_hashes = get_job_hashes(job)
                is_duplicate = False
                for j_hash in job_hashes:
                    if j_hash in seen_jobs:
                        is_duplicate = True
                        break
                        
                if is_duplicate:
                    tracker.duplicates += 1
                    continue
                    
                # 3. Accept Job
                for j_hash in job_hashes:
                    seen_jobs[j_hash] = today_str
                new_jobs.append(job)
                tracker.new_jobs += 1
                
                if len(new_jobs) >= MAX_JOBS_PER_EMAIL:
                    print(f"\nReached MAX_JOBS_PER_EMAIL ({MAX_JOBS_PER_EMAIL}). Stopping search.")
                    break
                    
        except Exception as e:
            print(f"ERROR: Scraper {scraper.source_name} failed: {e}. Continuing with remaining scrapers...")
            tracker.log_source_health(scraper.source_name, 0, f"Error: {e}")
            
        if len(new_jobs) >= MAX_JOBS_PER_EMAIL:
            break
                
    tracker.print_summary()
    
    # Save Weekly Stats
    weekly_stats = load_weekly_stats()
    daily_stat = {
        "date": today_str,
        "raw_jobs": tracker.raw_jobs,
        "new_jobs": tracker.new_jobs,
        "source_health": tracker.source_health
    }
    weekly_stats.append(daily_stat)
    save_weekly_stats(weekly_stats)
    
    # Check if Sunday
    is_sunday = datetime.now().weekday() == 6
    if is_sunday:
        print("It's Sunday! Sending Weekly Summary Email...")
        send_weekly_email(weekly_stats)
        save_weekly_stats([]) # Reset
    
    if new_jobs:
        print("Sending ranked email notification...")
        send_job_email(new_jobs)
        print("Saving updated seen jobs state...")
        save_seen_jobs(seen_jobs)
    else:
        print("No new jobs found. Skipping daily email.")
        save_seen_jobs(seen_jobs)

if __name__ == "__main__":
    main()
