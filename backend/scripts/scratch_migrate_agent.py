"""
Migration script for AgentGoal and AgentTask tables.

Ensures agent_goals and agent_tasks tables exist in SQLite database.
"""

import logging
from app.database.database import engine
from app.models.models import AgentGoal, AgentTask

logging.basicConfig(level=logging.INFO)


def migrate() -> None:
    """Create agent_goals and agent_tasks tables if they do not already exist."""
    AgentGoal.__table__.create(bind=engine, checkfirst=True)
    AgentTask.__table__.create(bind=engine, checkfirst=True)
    logging.info("Created agent tables.")


if __name__ == "__main__":
    migrate()
