from sqlalchemy.orm import Session
from app.models import models

def get_recent_jobs(db: Session, limit: int = 50):
    return db.query(models.Job).order_by(models.Job.created_at.desc()).limit(limit).all()

def get_recommended_jobs_for_role(db: Session, preferred_role: str, limit: int = 10):
    if not preferred_role:
        return db.query(models.Job).order_by(models.Job.created_at.desc()).limit(limit).all()
        
    return db.query(models.Job).filter(
        models.Job.job_title.ilike(f"%{preferred_role}%")
    ).order_by(models.Job.created_at.desc()).limit(limit).all()

def get_job_by_id(db: Session, job_id: int):
    return db.query(models.Job).filter(models.Job.id == job_id).first()
