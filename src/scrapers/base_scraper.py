from abc import ABC, abstractmethod
from typing import List, Dict

class BaseScraper(ABC):
    """
    Base class for all job scrapers.
    """
    def __init__(self):
        self.jobs: List[Dict] = []

    @abstractmethod
    def scrape(self, roles: List[str], locations: List[str], experience_levels: List[str]) -> List[Dict]:
        """
        Scrape jobs based on given criteria.
        Returns a list of dictionaries with keys:
        - company
        - role
        - location
        - apply_link
        - date_posted
        - source
        """
        pass
