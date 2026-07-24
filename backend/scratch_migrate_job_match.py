import logging
from app.database.database import engine, Base
from app.models.models import JobMatchResult

logging.basicConfig(level=logging.INFO)

def migrate():
    # Only create tables that don't exist
    JobMatchResult.__table__.create(bind=engine, checkfirst=True)
    logging.info("Created job_match_results table.")

if __name__ == "__main__":
    migrate()
