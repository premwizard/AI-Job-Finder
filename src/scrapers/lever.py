from .duckduckgo_scraper import DuckDuckGoScraper

class LeverScraper(DuckDuckGoScraper):
    def __init__(self):
        super().__init__(platform_domain="jobs.lever.co", source_name="Lever")
