from fastapi import HTTPException
from sqlalchemy.orm import Session

from app.models import models
from app.repositories.jobs_repository import (
    get_job_by_id,
    get_recent_jobs,
    get_recommended_jobs_for_role,
)


def get_jobs(db: Session):
    return get_recent_jobs(db)


def get_recommended_jobs(db: Session, current_user: models.User):
    pref = db.query(models.CareerPreference).filter(models.CareerPreference.user_id == current_user.id).first()
    role = pref.preferred_roles if pref and pref.preferred_roles else None
    return get_recommended_jobs_for_role(db, role)


def get_job(job_id: int, db: Session):
    job = get_job_by_id(db, job_id)
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")
    return job
