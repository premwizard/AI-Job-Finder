import logging
from app.database.database import engine
from app.models.models import Opportunity

logging.basicConfig(level=logging.INFO)

def migrate():
    Opportunity.__table__.create(bind=engine, checkfirst=True)
    logging.info("Created opportunities table.")

if __name__ == "__main__":
    migrate()
