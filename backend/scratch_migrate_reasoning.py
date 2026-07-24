import logging
from app.database.database import engine, Base
from app.models.models import AgentReflection, AgentDecision
from sqlalchemy import text

logging.basicConfig(level=logging.INFO)

def migrate():
    AgentReflection.__table__.create(bind=engine, checkfirst=True)
    AgentDecision.__table__.create(bind=engine, checkfirst=True)
    
    with engine.begin() as conn:
        try:
            conn.execute(text("ALTER TABLE agent_tasks ADD COLUMN retries INTEGER DEFAULT 0"))
            conn.execute(text("ALTER TABLE agent_tasks ADD COLUMN max_retries INTEGER DEFAULT 3"))
        except Exception as e:
            logging.warning(f"Could not alter agent_tasks (might already exist): {e}")

    logging.info("Created reflection tables and updated agent_tasks.")

if __name__ == "__main__":
    migrate()
