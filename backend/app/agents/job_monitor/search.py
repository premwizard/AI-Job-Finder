from sqlalchemy.orm import Session
from app.models.models import Job
from typing import List

class SearchStrategy:
    def __init__(self, db: Session):
        self.db = db

    def discover_jobs(self) -> List[Job]:
        # In a real system, this queries external providers or complex DB logic.
        # For this prototype, return recent jobs from the local database.
        return self.db.query(Job).order_by(Job.posted_date.desc()).limit(20).all()
