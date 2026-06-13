from .duckduckgo_scraper import DuckDuckGoScraper

class WellfoundScraper(DuckDuckGoScraper):
    def __init__(self):
        super().__init__(platform_domain="wellfound.com/jobs", source_name="Wellfound")
