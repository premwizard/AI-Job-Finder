"""
Migration script for ChatMessage table.

Ensures the chat_messages table exists in SQLite database.
"""

import logging
import os
import sys

# Ensure backend directory is in sys.path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.database.database import engine
from app.models.models import ChatMessage

logging.basicConfig(level=logging.INFO)


def migrate() -> None:
    """Create chat_messages table if it does not already exist."""
    ChatMessage.__table__.create(bind=engine, checkfirst=True)
    logging.info("Created chat_messages table.")


if __name__ == "__main__":
    migrate()
