from fastapi import APIRouter, Depends, HTTPException, BackgroundTasks
from sqlalchemy.orm import Session
from app.database.database import get_db
from app.services.job_parser_service import JobParserService

router = APIRouter(prefix="/api/jobs", tags=["job_parsing"])

@router.get("/parsing/statistics")
def get_parsing_statistics(db: Session = Depends(get_db)):
    service = JobParserService(db)
    return service.get_parsing_statistics()

@router.get("/{job_id}/parsed")
def get_parsed_job(job_id: int, db: Session = Depends(get_db)):
    from app.models.models import Job
    job = db.query(Job).filter(Job.id == job_id).first()
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")
    
    if not job.ai_processed or not job.parsed_data_json:
        raise HTTPException(status_code=400, detail="Job has not been successfully parsed yet")
        
    import json
    return json.loads(job.parsed_data_json)

@router.post("/{job_id}/parse")
def parse_single_job(job_id: int, db: Session = Depends(get_db)):
    service = JobParserService(db)
    try:
        result = service.parse_job(job_id)
        return {"message": "Job successfully parsed", "data": result}
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception:
        raise HTTPException(status_code=500, detail="Internal server error during parsing")

@router.post("/parse-all")
def parse_all_jobs_background(background_tasks: BackgroundTasks, db: Session = Depends(get_db)):
    # In a real app we'd pass a separate DB session or ensure thread safety.
    # For now, we instantiate inside a wrapper function for the background task
    def process_queue():
        # Get a fresh session for the background task
        from app.database.database import SessionLocal
        bg_db = SessionLocal()
        try:
            bg_service = JobParserService(bg_db)
            bg_service.parse_all_unprocessed()
        finally:
            bg_db.close()
            
    background_tasks.add_task(process_queue)
    return {"message": "Bulk parsing started in the background"}
