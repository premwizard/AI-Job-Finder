from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from src.database.database import get_db
from src.models import models
from src.schemas import schemas
from src.api.deps import get_current_user

router = APIRouter(prefix="/jobs", tags=["Jobs"])

@router.get("", response_model=List[schemas.JobResponse])
def get_jobs(db: Session = Depends(get_db)):
    # In a real app we'd add pagination and filtering
    return db.query(models.Job).order_by(models.Job.created_at.desc()).limit(50).all()

@router.get("/recommended", response_model=List[schemas.JobResponse])
def recommended_jobs(db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    # Simplified recommended jobs logic: just get jobs that match user preferred role (case-insensitive substring)
    if not current_user.preferred_role:
        return db.query(models.Job).order_by(models.Job.created_at.desc()).limit(10).all()
        
    recommended = db.query(models.Job).filter(
        models.Job.job_title.ilike(f"%{current_user.preferred_role}%")
    ).order_by(models.Job.created_at.desc()).limit(10).all()
    
    return recommended

@router.get("/{job_id}", response_model=schemas.JobDetailResponse)
def get_job(job_id: int, db: Session = Depends(get_db)):
    job = db.query(models.Job).filter(models.Job.id == job_id).first()
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")
    return job

