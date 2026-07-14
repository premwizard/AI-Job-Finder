from datetime import datetime
from typing import Dict, List

import requests

from app.config import ADZUNA_APP_ID, ADZUNA_APP_KEY

from .base_scraper import BaseScraper


class AdzunaScraper(BaseScraper):
    def __init__(self):
        super().__init__(source_name="Adzuna")
        self.api_url = "https://api.adzuna.com/v1/api/jobs/in/search/1"

    def scrape(
        self, roles: List[str], locations: List[str], experience_levels: List[str]
    ) -> List[Dict]:
        jobs = []
        if not ADZUNA_APP_ID or not ADZUNA_APP_KEY:
            print("Skipping Adzuna Scraper: Missing ADZUNA_APP_ID or ADZUNA_APP_KEY.")
            return jobs

        params = {
            "app_id": ADZUNA_APP_ID,
            "app_key": ADZUNA_APP_KEY,
            "results_per_page": 50,
            "what": "software",
        }

        try:
            response = requests.get(self.api_url, params=params, timeout=15)
            response.raise_for_status()
            data = response.json()

            for item in data.get("results", []):
                jobs.append(
                    {
                        "company": item.get("company", {}).get(
                            "display_name", "Unknown"
                        ),
                        "role": item.get("title", ""),
                        "location": item.get("location", {}).get(
                            "display_name", "Unknown"
                        ),
                        "apply_link": item.get("redirect_url", ""),
                        "date_posted": item.get(
                            "created", datetime.now().strftime("%Y-%m-%d")
                        )[:10],
                        "description": item.get("description", ""),
                        "source": self.source_name,
                    }
                )
        except Exception as e:
            print(f"Error fetching from Adzuna: {e}")
            raise e

        return jobs
