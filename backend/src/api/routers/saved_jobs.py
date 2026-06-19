from fastapi import APIRouter, HTTPException
from typing import List
from src.schemas.job import SavedJobResponse, SavedJobCreate
from src.services.saved_job_service import get_saved_jobs, add_saved_job, delete_saved_job

router = APIRouter(prefix="/saved-jobs", tags=["Saved Jobs"])

@router.get("", response_model=List[SavedJobResponse])
def list_saved_jobs():
    return get_saved_jobs()

@router.post("", response_model=SavedJobResponse)
def save_job(job: SavedJobCreate):
    return add_saved_job(job.dict())

@router.delete("/{job_id}")
def remove_saved_job(job_id: str):
    success = delete_saved_job(job_id)
    if not success:
        raise HTTPException(status_code=404, detail="Saved job not found")
    return {"detail": "Successfully deleted"}
