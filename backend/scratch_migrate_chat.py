"""
Migration script for ChatMessage table.

Ensures the chat_messages table exists in SQLite database.
"""

import logging
from app.database.database import engine
from app.models.models import ChatMessage

logging.basicConfig(level=logging.INFO)


def migrate() -> None:
    """Create chat_messages table if it does not already exist."""
    ChatMessage.__table__.create(bind=engine, checkfirst=True)
    logging.info("Created chat_messages table.")


if __name__ == "__main__":
    migrate()
