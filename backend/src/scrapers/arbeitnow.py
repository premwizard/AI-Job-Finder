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
                remote = item.get("remote", False)
                display_location = "Remote" if remote else item.get("location", "Unknown")
                
                jobs.append({
                    "company": item.get("company_name", "Unknown"),
                    "role": item.get("title", ""),
                    "location": display_location,
                    "apply_link": item.get("url", ""),
                    "date_posted": datetime.now().strftime("%Y-%m-%d"),
                    "description": item.get("description", ""),
                    "source": self.source_name
                })
        except Exception as e:
            print(f"Error fetching from Arbeitnow: {e}")
            raise e
            
        return jobs
