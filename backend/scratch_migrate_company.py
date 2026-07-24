import logging
from app.database.database import engine, Base
from app.models.models import CompanyProfile

logging.basicConfig(level=logging.INFO)

def migrate():
    # Only create tables that don't exist
    CompanyProfile.__table__.create(bind=engine, checkfirst=True)
    logging.info("Created company_profiles table.")

if __name__ == "__main__":
    migrate()
