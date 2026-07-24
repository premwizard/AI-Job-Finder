from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from app.database.database import get_db
from app.schemas.job_schemas import JobPaginationResponse, JobSchema, JobStatisticsResponse
from app.repositories.job_repository import JobRepository
from app.services.job_collection_service import JobCollectionService
from typing import Optional

router = APIRouter(prefix="/api/jobs", tags=["jobs"])

@router.get("", response_model=JobPaginationResponse)
def get_jobs(
    page: int = Query(1, ge=1),
    size: int = Query(20, ge=1, le=100),
    search: Optional[str] = None,
    company: Optional[str] = None,
    role: Optional[str] = None,
    location: Optional[str] = None,
    is_remote: Optional[bool] = None,
    source: Optional[str] = None,
    db: Session = Depends(get_db)
):
    repo = JobRepository(db)
    skip = (page - 1) * size
    total, items = repo.get_jobs(
        skip=skip, limit=size, search=search, company=company, 
        role=role, location=location, is_remote=is_remote, source=source
    )
    pages = (total + size - 1) // size
    return JobPaginationResponse(
        total=total,
        page=page,
        size=size,
        pages=pages,
        items=items
    )

@router.get("/statistics", response_model=JobStatisticsResponse)
def get_job_statistics(db: Session = Depends(get_db)):
    repo = JobRepository(db)
    return repo.get_statistics()

@router.get("/{job_id}", response_model=JobSchema)
def get_job(job_id: int, db: Session = Depends(get_db)):
    repo = JobRepository(db)
    return repo.get_job_by_id(job_id)

@router.post("/refresh")
def refresh_jobs(db: Session = Depends(get_db)):
    service = JobCollectionService(db)
    result = service.run_collection()
    return {"message": "Job collection triggered", "result": result}
