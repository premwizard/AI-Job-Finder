from .duckduckgo_scraper import DuckDuckGoScraper

class GreenhouseScraper(DuckDuckGoScraper):
    def __init__(self):
        super().__init__(platform_domain="boards.greenhouse.io", source_name="Greenhouse")
