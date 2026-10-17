"""
Migration script for JobMatchResult table.

Ensures the job_match_results table exists in SQLite database.
"""

import logging
import os
import sys

# Ensure backend directory is in sys.path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.database.database import engine
from app.models.models import JobMatchResult

logging.basicConfig(level=logging.INFO)


def migrate() -> None:
    """Create job_match_results table if it does not already exist."""
    JobMatchResult.__table__.create(bind=engine, checkfirst=True)
    logging.info("Created job_match_results table.")


if __name__ == "__main__":
    migrate()
