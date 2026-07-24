import logging
from app.database.database import engine, Base
from app.models.models import ResumeOptimization

logging.basicConfig(level=logging.INFO)

def migrate():
    # Only create tables that don't exist
    ResumeOptimization.__table__.create(bind=engine, checkfirst=True)
    logging.info("Created resume_optimizations table.")

if __name__ == "__main__":
    migrate()
