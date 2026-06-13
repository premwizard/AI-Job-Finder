import requests
from typing import List, Dict
from datetime import datetime
from .base_scraper import BaseScraper

class ArbeitnowScraper(BaseScraper):
    def __init__(self):
        super().__init__(source_name="Arbeitnow")
        self.api_url = "https://www.arbeitnow.com/api/job-board-api"

    def scrape(self, roles: List[str], locations: List[str], experience_levels: List[str]) -> List[Dict]:
        jobs = []
        
        try:
            response = requests.get(self.api_url, timeout=15)
            response.raise_for_status()
            data = response.json()
            
            for item in data.get("data", []):
                title = item.get("title", "")
                company = item.get("company_name", "Unknown")
                job_location = item.get("location", "Unknown")
                remote = item.get("remote", False)
                apply_link = item.get("url", "")
                
                # Format location based on remote flag
                display_location = "Remote" if remote else job_location
                
                # Match against requested roles
                role_match = False
                for role in roles:
                    keywords = role.lower().split()
                    if any(kw in title.lower() for kw in keywords if len(kw) > 2):
                        role_match = True
                        break
                        
                # Match against requested locations
                loc_match = False
                for loc in locations:
                    if loc.lower() in display_location.lower() or (loc.lower() == "remote" and remote):
                        loc_match = True
                        break
                        
                if role_match and loc_match:
                    jobs.append({
                        "company": company,
                        "role": title,
                        "location": display_location,
                        "apply_link": apply_link,
                        "date_posted": datetime.now().strftime("%Y-%m-%d"),
                        "source": self.source_name
                    })
                    
        except Exception as e:
            print(f"Error fetching from Arbeitnow: {e}")
            raise e
            
        return jobs
