"""
Migration script for JobLearningRoadmap table.

Ensures the job_learning_roadmaps table exists in SQLite database.
"""

import logging
from app.database.database import engine
from app.models.models import JobLearningRoadmap

logging.basicConfig(level=logging.INFO)


def migrate() -> None:
    """Create job_learning_roadmaps table if it does not already exist."""
    JobLearningRoadmap.__table__.create(bind=engine, checkfirst=True)
    logging.info("Created job_learning_roadmaps table.")


if __name__ == "__main__":
    migrate()
