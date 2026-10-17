"""
Migration script for ToolExecutionLog table.

Ensures the tool_execution_logs table exists in SQLite database.
"""

import logging
from app.database.database import engine
from app.models.models import ToolExecutionLog

logging.basicConfig(level=logging.INFO)


def migrate() -> None:
    """Create tool_execution_logs table if it does not already exist."""
    ToolExecutionLog.__table__.create(bind=engine, checkfirst=True)
    logging.info("Created tool_execution_logs table.")


if __name__ == "__main__":
    migrate()
