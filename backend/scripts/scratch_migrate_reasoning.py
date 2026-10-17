"""
Migration script for Agent Reasoning and Reflection tables.

Creates AgentReflection and AgentDecision tables, and safely alters
agent_tasks to add retry tracking columns if missing.
"""

import logging
import os
import sys

# Ensure backend directory is in sys.path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.database.database import engine
from app.models.models import AgentReflection, AgentDecision
from sqlalchemy import text

logging.basicConfig(level=logging.INFO)


def migrate() -> None:
    """Create reflection and decision tables, and alter agent_tasks with retry columns."""
    AgentReflection.__table__.create(bind=engine, checkfirst=True)
    AgentDecision.__table__.create(bind=engine, checkfirst=True)

    with engine.begin() as conn:
        try:
            conn.execute(
                text("ALTER TABLE agent_tasks ADD COLUMN retries INTEGER DEFAULT 0")
            )
            conn.execute(
                text("ALTER TABLE agent_tasks ADD COLUMN max_retries INTEGER DEFAULT 3")
            )
        except Exception as e:
            logging.warning(f"Could not alter agent_tasks (might already exist): {e}")

    logging.info("Created reflection tables and updated agent_tasks.")


if __name__ == "__main__":
    migrate()
