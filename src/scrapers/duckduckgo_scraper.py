import time
from typing import List, Dict
from duckduckgo_search import DDGS
from .base_scraper import BaseScraper
from datetime import datetime

class DuckDuckGoScraper(BaseScraper):
    def __init__(self, platform_domain: str, source_name: str):
        super().__init__()
        self.platform_domain = platform_domain
        self.source_name = source_name

    def scrape(self, roles: List[str], locations: List[str], experience_levels: List[str]) -> List[Dict]:
        jobs = []
        ddgs = DDGS()
        
        for role in roles:
            for location in locations:
                query = f"site:{self.platform_domain} \"{role}\" \"{location}\""
                print(f"Searching {self.source_name} for: {query}")
                try:
                    results = ddgs.text(query, max_results=10)
                    if not results:
                        continue
                        
                    for r in results:
                        title = r.get("title", "")
                        href = r.get("href", "")
                        
                        company = "Unknown"
                        if " at " in title:
                            company = title.split(" at ")[-1].split(" |")[0].split("-")[0].strip()
                        elif " - " in title:
                            company = title.split(" - ")[0].strip()
                            
                        job = {
                            "company": company,
                            "role": role,
                            "location": location,
                            "apply_link": href,
                            "date_posted": datetime.now().strftime("%Y-%m-%d"),
                            "source": self.source_name
                        }
                        jobs.append(job)
                    time.sleep(2)  # Avoid rate limits
                except Exception as e:
                    print(f"Error searching {self.source_name} for {role}: {e}")
                    
        return jobs
