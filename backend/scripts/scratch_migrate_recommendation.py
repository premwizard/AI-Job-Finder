"""
Migration script for JobRecommendation table.

Ensures the job_recommendations table exists in SQLite database.
"""

import logging
from app.database.database import engine
from app.models.models import JobRecommendation

logging.basicConfig(level=logging.INFO)


def migrate() -> None:
    """Create job_recommendations table if it does not already exist."""
    JobRecommendation.__table__.create(bind=engine, checkfirst=True)
    logging.info("Created job_recommendations table.")


if __name__ == "__main__":
    migrate()
