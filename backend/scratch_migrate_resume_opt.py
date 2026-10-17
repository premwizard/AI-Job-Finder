"""
Migration script for ResumeOptimization table.

Ensures the resume_optimizations table exists in SQLite database.
"""

import logging
from app.database.database import engine
from app.models.models import ResumeOptimization

logging.basicConfig(level=logging.INFO)


def migrate() -> None:
    """Create resume_optimizations table if it does not already exist."""
    ResumeOptimization.__table__.create(bind=engine, checkfirst=True)
    logging.info("Created resume_optimizations table.")


if __name__ == "__main__":
    migrate()
