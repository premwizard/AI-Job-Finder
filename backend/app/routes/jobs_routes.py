from typing import List

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.controllers.jobs_controller import get_job as ctrl_get_job
from app.controllers.jobs_controller import get_jobs as ctrl_get_jobs
from app.controllers.jobs_controller import (
    get_recommended_jobs as ctrl_get_recommended_jobs,
)
from app.database.database import get_db
from app.middleware.auth_middleware import (
    get_current_user,
)  # Need to check if it's core.security or api.deps
from app.models import models
from app.schemas import schemas

router = APIRouter(prefix="/jobs", tags=["Jobs"])


@router.get("", response_model=List[schemas.JobResponse])
def get_jobs(db: Session = Depends(get_db)):
    return ctrl_get_jobs(db)


@router.get("/recommended", response_model=List[schemas.JobResponse])
def recommended_jobs(
    db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)
):
    return ctrl_get_recommended_jobs(db, current_user)


@router.get("/{job_id}", response_model=schemas.JobDetailResponse)
def get_job(job_id: int, db: Session = Depends(get_db)):
    return ctrl_get_job(job_id, db)
