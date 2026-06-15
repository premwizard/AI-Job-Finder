import requests
from typing import List, Dict
from datetime import datetime
from .base_scraper import BaseScraper

class TheMuseScraper(BaseScraper):
    def __init__(self):
        super().__init__(source_name="TheMuse")
        self.api_url = "https://www.themuse.com/api/public/jobs"

    def scrape(self, roles: List[str], locations: List[str], experience_levels: List[str]) -> List[Dict]:
        jobs = []
        params = {"page": 1, "category": "Software Engineer"}
        
        try:
            response = requests.get(self.api_url, params=params, timeout=15)
            response.raise_for_status()
            data = response.json()
            
            for item in data.get("results", []):
                company = item.get("company", {}).get("name", "Unknown")
                locations_list = item.get("locations", [])
                location = locations_list[0].get("name", "Unknown") if locations_list else "Unknown"
                
                jobs.append({
                    "company": company,
                    "role": item.get("name", ""),
                    "location": location,
                    "apply_link": item.get("refs", {}).get("landing_page", ""),
                    "date_posted": item.get("publication_date", datetime.now().strftime("%Y-%m-%d"))[:10],
                    "description": item.get("contents", ""),
                    "source": self.source_name
                })
        except Exception as e:
            print(f"Error fetching from TheMuse: {e}")
            raise e
            
        return jobs
