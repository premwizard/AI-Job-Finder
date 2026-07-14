from datetime import datetime
from typing import Dict, List

import requests

from .base_scraper import BaseScraper


class RemotiveScraper(BaseScraper):
    def __init__(self):
        super().__init__(source_name="Remotive")
        self.api_url = "https://remotive.com/api/remote-jobs"

    def scrape(
        self, roles: List[str], locations: List[str], experience_levels: List[str]
    ) -> List[Dict]:
        jobs = []
        params = {"category": "software-dev", "limit": 150}

        try:
            response = requests.get(self.api_url, params=params, timeout=15)
            response.raise_for_status()
            data = response.json()

            for item in data.get("jobs", []):
                jobs.append(
                    {
                        "company": item.get("company_name", "Unknown"),
                        "role": item.get("title", ""),
                        "location": item.get("candidate_required_location", "Remote"),
                        "apply_link": item.get("url", ""),
                        "date_posted": item.get(
                            "publication_date", datetime.now().strftime("%Y-%m-%d")
                        )[:10],
                        "description": item.get("description", ""),
                        "source": self.source_name,
                    }
                )
        except Exception as e:
            print(f"Error fetching from Remotive: {e}")
            raise e

        return jobs
