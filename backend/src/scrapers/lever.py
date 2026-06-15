import requests
from typing import List, Dict
from datetime import datetime
from src.config import TARGET_COMPANIES
from .base_scraper import BaseScraper

class LeverScraper(BaseScraper):
    def __init__(self):
        super().__init__(source_name="Lever")

    def scrape(self, roles: List[str], locations: List[str], experience_levels: List[str]) -> List[Dict]:
        jobs = []
        
        for company in TARGET_COMPANIES:
            api_url = f"https://api.lever.co/v0/postings/{company}"
            try:
                response = requests.get(api_url, timeout=10)
                if response.status_code == 404:
                    continue
                response.raise_for_status()
                data = response.json()
                
                for item in data:
                    jobs.append({
                        "company": company.title(),
                        "role": item.get("text", ""),
                        "location": item.get("categories", {}).get("location", "Unknown"),
                        "apply_link": item.get("hostedUrl", ""),
                        "date_posted": datetime.now().strftime("%Y-%m-%d"),
                        "description": item.get("descriptionPlain", ""),
                        "source": self.source_name
                    })
            except Exception as e:
                print(f"Error fetching Lever for {company}: {e}")
                
        return jobs
