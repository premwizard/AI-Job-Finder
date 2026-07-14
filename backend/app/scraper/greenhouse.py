from datetime import datetime
from typing import Dict, List

import requests

from app.config import TARGET_COMPANIES

from .base_scraper import BaseScraper


class GreenhouseScraper(BaseScraper):
    def __init__(self):
        super().__init__(source_name="Greenhouse")

    def scrape(
        self, roles: List[str], locations: List[str], experience_levels: List[str]
    ) -> List[Dict]:
        jobs = []

        for company in TARGET_COMPANIES:
            api_url = f"https://boards-api.greenhouse.io/v1/boards/{company}/jobs"
            try:
                response = requests.get(api_url, timeout=10)
                if response.status_code == 404:
                    continue
                response.raise_for_status()
                data = response.json()

                for item in data.get("jobs", []):
                    jobs.append(
                        {
                            "company": company.title(),
                            "role": item.get("title", ""),
                            "location": item.get("location", {}).get("name", "Unknown"),
                            "apply_link": item.get("absolute_url", ""),
                            "date_posted": item.get(
                                "updated_at", datetime.now().strftime("%Y-%m-%d")
                            )[:10],
                            "description": "",
                            "source": self.source_name,
                        }
                    )
            except Exception as e:
                print(f"Error fetching Greenhouse for {company}: {e}")

        return jobs
