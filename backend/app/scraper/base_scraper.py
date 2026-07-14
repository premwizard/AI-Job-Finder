from abc import ABC, abstractmethod
from typing import Dict, List


class BaseScraper(ABC):
    """
    Base class for all job scrapers.
    """

    def __init__(self, source_name: str):
        self.source_name = source_name

    @abstractmethod
    def scrape(
        self, roles: List[str], locations: List[str], experience_levels: List[str]
    ) -> List[Dict]:
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
