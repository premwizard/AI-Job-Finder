import logging
from app.database.database import engine, Base
from app.models.models import UserMemory

logging.basicConfig(level=logging.INFO)

def migrate():
    # Only create tables that don't exist
    UserMemory.__table__.create(bind=engine, checkfirst=True)
    logging.info("Created user_memories table.")

if __name__ == "__main__":
    migrate()
