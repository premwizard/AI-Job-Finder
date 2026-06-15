import requests
from typing import List, Dict
from datetime import datetime
from .base_scraper import BaseScraper

class RemoteOKScraper(BaseScraper):
    def __init__(self):
        super().__init__(source_name="RemoteOK")
        self.api_url = "https://remoteok.com/api"

    def scrape(self, roles: List[str], locations: List[str], experience_levels: List[str]) -> List[Dict]:
        jobs = []
        headers = {'User-Agent': 'Mozilla/5.0'}
        try:
            response = requests.get(self.api_url, headers=headers, timeout=15)
            response.raise_for_status()
            data = response.json()
            
            # The first item in remoteok API is often a legal notice, skip it
            for item in data[1:]:
                jobs.append({
                    "company": item.get("company", "Unknown"),
                    "role": item.get("position", ""),
                    "location": item.get("location", "Remote"),
                    "apply_link": item.get("url", ""),
                    "date_posted": item.get("date", datetime.now().strftime("%Y-%m-%d"))[:10],
                    "description": item.get("description", ""),
                    "source": self.source_name
                })
        except Exception as e:
            print(f"Error fetching from RemoteOK: {e}")
            raise e
            
        return jobs
