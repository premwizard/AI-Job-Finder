from fastapi import APIRouter, HTTPException
from typing import List
from src.schemas.job import JobResponse, JobDetailResponse
from src.services.job_service import fetch_jobs, get_job_by_id, get_recommended_jobs

router = APIRouter(prefix="/jobs", tags=["Jobs"])

@router.get("", response_model=List[JobResponse])
def get_jobs():
    jobs = fetch_jobs(limit=10)
    return jobs

@router.get("/recommended", response_model=List[JobResponse])
def recommended_jobs():
    jobs = get_recommended_jobs()
    return jobs

@router.get("/{job_id}", response_model=JobDetailResponse)
def get_job(job_id: str):
    job = get_job_by_id(job_id)
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")
    return job
