import requests
from typing import List, Dict
from datetime import datetime
from .base_scraper import BaseScraper

class RemotiveScraper(BaseScraper):
    def __init__(self):
        super().__init__(source_name="Remotive")
        self.api_url = "https://remotive.com/api/remote-jobs"

    def scrape(self, roles: List[str], locations: List[str], experience_levels: List[str]) -> List[Dict]:
        jobs = []
        # Remotive supports searching by category (software-dev) and search terms
        params = {
            "category": "software-dev",
            "limit": 100
        }
        
        try:
            response = requests.get(self.api_url, params=params, timeout=15)
            response.raise_for_status()
            data = response.json()
            
            for item in data.get("jobs", []):
                title = item.get("title", "")
                company = item.get("company_name", "Unknown")
                job_location = item.get("candidate_required_location", "Remote")
                apply_link = item.get("url", "")
                date_posted = item.get("publication_date", datetime.now().strftime("%Y-%m-%d"))[:10]
                
                # Match against requested roles
                role_match = False
                for role in roles:
                    # simplistic keyword matching
                    keywords = role.lower().split()
                    if any(kw in title.lower() for kw in keywords if len(kw) > 2):
                        role_match = True
                        break
                        
                # Match against requested locations
                loc_match = False
                for loc in locations:
                    if loc.lower() in job_location.lower() or job_location.lower() == "worldwide" or loc.lower() == "remote":
                        loc_match = True
                        break
                        
                if role_match and loc_match:
                    jobs.append({
                        "company": company,
                        "role": title,
                        "location": job_location,
                        "apply_link": apply_link,
                        "date_posted": date_posted,
                        "source": self.source_name
                    })
                    
        except Exception as e:
            print(f"Error fetching from Remotive: {e}")
            raise e
            
        return jobs
