from sqlalchemy.orm import Session
from app.models.models import Job, Opportunity

class DuplicateDetector:
    def __init__(self, db: Session):
        self.db = db

    def is_duplicate(self, user_id: str, job_id: int) -> bool:
        # Simple duplicate detection: has this user already been evaluated for this exact job ID?
        exists = self.db.query(Opportunity).filter(
            Opportunity.user_id == user_id,
            Opportunity.job_id == job_id
        ).first()
        return exists is not None
