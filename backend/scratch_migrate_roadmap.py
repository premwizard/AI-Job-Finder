import logging
from app.database.database import engine, Base
from app.models.models import JobLearningRoadmap

logging.basicConfig(level=logging.INFO)

def migrate():
    # Only create tables that don't exist
    JobLearningRoadmap.__table__.create(bind=engine, checkfirst=True)
    logging.info("Created job_learning_roadmaps table.")

if __name__ == "__main__":
    migrate()
