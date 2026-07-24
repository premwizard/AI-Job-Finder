import logging
from app.database.database import engine, Base
from app.models.models import JobExplanation

logging.basicConfig(level=logging.INFO)

def migrate():
    # Only create tables that don't exist
    JobExplanation.__table__.create(bind=engine, checkfirst=True)
    logging.info("Created job_explanations table.")

if __name__ == "__main__":
    migrate()
