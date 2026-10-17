"""
Migration script for JobExplanation table.

Ensures the job_explanations table exists in SQLite database.
"""

import logging
from app.database.database import engine
from app.models.models import JobExplanation

logging.basicConfig(level=logging.INFO)


def migrate() -> None:
    """Create job_explanations table if it does not already exist."""
    JobExplanation.__table__.create(bind=engine, checkfirst=True)
    logging.info("Created job_explanations table.")


if __name__ == "__main__":
    migrate()
