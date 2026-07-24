import logging
from app.database.database import engine, Base
from app.models.models import AgentGoal, AgentTask

logging.basicConfig(level=logging.INFO)

def migrate():
    # Only create tables that don't exist
    AgentGoal.__table__.create(bind=engine, checkfirst=True)
    AgentTask.__table__.create(bind=engine, checkfirst=True)
    logging.info("Created agent tables.")

if __name__ == "__main__":
    migrate()
