from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from src.database.database import get_db
from src.models import models
from src.schemas import schemas
from src.api.deps import get_current_user

router = APIRouter(prefix="/saved-jobs", tags=["Saved Jobs"])

@router.get("", response_model=List[schemas.SavedJobResponse])
def list_saved_jobs(db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    return db.query(models.SavedJob).filter(models.SavedJob.user_id == current_user.id).all()

@router.post("/{job_id}", response_model=schemas.SavedJobResponse)
def save_job(job_id: int, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    job = db.query(models.Job).filter(models.Job.id == job_id).first()
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")
        
    existing = db.query(models.SavedJob).filter(
        models.SavedJob.user_id == current_user.id,
        models.SavedJob.job_id == job_id
    ).first()
    if existing:
        raise HTTPException(status_code=400, detail="Job already saved")
        
    new_saved_job = models.SavedJob(user_id=current_user.id, job_id=job_id)
    db.add(new_saved_job)
    db.commit()
    db.refresh(new_saved_job)
    return new_saved_job

@router.delete("/{job_id}")
def remove_saved_job(job_id: int, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    saved_job = db.query(models.SavedJob).filter(
        models.SavedJob.user_id == current_user.id,
        models.SavedJob.job_id == job_id
    ).first()
    
    if not saved_job:
        raise HTTPException(status_code=404, detail="Saved job not found")
        
    db.delete(saved_job)
    db.commit()
    return {"detail": "Successfully deleted"}

