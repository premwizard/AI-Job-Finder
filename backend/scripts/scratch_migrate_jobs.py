"""
Migration script for Jobs and dependent tables.

Safely drops and recreates job-related tables including SavedJob,
Application, JobLocation, JobSkill, JobRequirement, JobBenefit, and Job.
"""

import os
import sys

# Ensure backend directory is in sys.path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.database.database import engine, Base
from app.models.models import (
    Job,
    JobLocation,
    JobSkill,
    JobRequirement,
    JobBenefit,
    SavedJob,
    Application,
)


def migrate() -> None:
    """Drop dependent and job tables safely, then recreate all database schemas."""
    # Drop dependents first
    SavedJob.__table__.drop(engine, checkfirst=True)
    Application.__table__.drop(engine, checkfirst=True)
    JobLocation.__table__.drop(engine, checkfirst=True)
    JobSkill.__table__.drop(engine, checkfirst=True)
    JobRequirement.__table__.drop(engine, checkfirst=True)
    JobBenefit.__table__.drop(engine, checkfirst=True)

    # Drop jobs
    Job.__table__.drop(engine, checkfirst=True)

    # Recreate all
    Base.metadata.create_all(engine)
    print("Migration completed: Jobs and related tables dropped and recreated.")


if __name__ == "__main__":
    migrate()
