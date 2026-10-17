"""
Migration script for CompanyProfile table.

Ensures the company_profiles table exists in SQLite database.
"""

import logging
import os
import sys

# Ensure backend directory is in sys.path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.database.database import engine
from app.models.models import CompanyProfile

logging.basicConfig(level=logging.INFO)


def migrate() -> None:
    """Create company_profiles table if it does not already exist."""
    CompanyProfile.__table__.create(bind=engine, checkfirst=True)
    logging.info("Created company_profiles table.")


if __name__ == "__main__":
    migrate()
