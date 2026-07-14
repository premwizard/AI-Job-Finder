from typing import List

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from src.api.deps import get_current_user
from src.database.database import get_db
from src.models import models
from src.schemas import schemas

router = APIRouter(prefix="/applications", tags=["Applications"])


@router.get("", response_model=List[schemas.ApplicationResponse])
def get_applications(
    db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)
):
    return (
        db.query(models.Application)
        .filter(models.Application.user_id == current_user.id)
        .all()
    )


@router.post("/{job_id}", response_model=schemas.ApplicationResponse)
def apply_to_job(
    job_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    job = db.query(models.Job).filter(models.Job.id == job_id).first()
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")

    existing_application = (
        db.query(models.Application)
        .filter(
            models.Application.user_id == current_user.id,
            models.Application.job_id == job_id,
        )
        .first()
    )

    if existing_application:
        raise HTTPException(status_code=400, detail="Already applied to this job")

    new_application = models.Application(user_id=current_user.id, job_id=job_id)
    db.add(new_application)

    # Update analytics
    analytics = (
        db.query(models.Analytics)
        .filter(models.Analytics.user_id == current_user.id)
        .first()
    )
    if analytics:
        analytics.applications_sent += 1

    db.commit()
    db.refresh(new_application)
    return new_application
