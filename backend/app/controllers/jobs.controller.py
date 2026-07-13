from sqlalchemy.orm import Session
from fastapi import HTTPException
from app.repositories.jobs_repository import get_recent_jobs, get_recommended_jobs_for_role, get_job_by_id
from app.models import models

def get_jobs(db: Session):
    return get_recent_jobs(db)

def get_recommended_jobs(db: Session, current_user: models.User):
    return get_recommended_jobs_for_role(db, current_user.preferred_role)

def get_job(job_id: int, db: Session):
    job = get_job_by_id(db, job_id)
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")
    return job
