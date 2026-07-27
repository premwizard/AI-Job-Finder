from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel
from typing import Dict, Any

from app.modules.queue.core.celery_app import celery_app
from app.modules.queue.dispatcher.job_dispatcher import JobDispatcher
from app.modules.queue.jobs.sample_ai_job import sample_heavy_ai_analysis

router = APIRouter(prefix="/api/jobs", tags=["Jobs & Queue"])

class JobRequest(BaseModel):
    document_text: str

@router.post("/test-dispatch", status_code=status.HTTP_202_ACCEPTED)
async def dispatch_test_job(request: JobRequest):
    """
    Test endpoint to dispatch a background job.
    """
    task = JobDispatcher.dispatch_immediate(sample_heavy_ai_analysis, request.document_text)
    return {"message": "Job dispatched successfully", "task_id": task.id}

@router.get("/{task_id}")
async def get_job_status(task_id: str):
    """
    Get the status of a dispatched job.
    """
    status_info = JobDispatcher.get_job_status(task_id, celery_app)
    return status_info

@router.get("/statistics/workers")
async def get_worker_statistics():
    """
    Inspect active workers (requires Flower or direct Celery inspection)
    """
    i = celery_app.control.inspect()
    return {
        "active": i.active(),
        "scheduled": i.scheduled(),
        "reserved": i.reserved(),
        "stats": i.stats()
    }
