"""
Migration script for UserMemory table.

Ensures the user_memories table exists in SQLite database.
"""

import logging
import os
import sys

# Ensure backend directory is in sys.path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.database.database import engine
from app.models.models import UserMemory

logging.basicConfig(level=logging.INFO)


def migrate() -> None:
    """Create user_memories table if it does not already exist."""
    UserMemory.__table__.create(bind=engine, checkfirst=True)
    logging.info("Created user_memories table.")


if __name__ == "__main__":
    migrate()
