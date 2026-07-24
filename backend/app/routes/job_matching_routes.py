import json
from fastapi import APIRouter, Depends, HTTPException, BackgroundTasks
from sqlalchemy.orm import Session
from app.database.database import get_db
from app.services.job_matching_service import JobMatchingService
from app.routes.auth_routes import get_current_user
from app.models.models import User

router = APIRouter(prefix="/api/jobs", tags=["job_matching"])

@router.get("/recommended")
def get_recommended_jobs(limit: int = 10, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    service = JobMatchingService(db)
    return service.get_recommended_jobs(current_user.id, limit)

@router.get("/{job_id}/match")
def get_job_match(job_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    service = JobMatchingService(db)
    try:
        match = service.evaluate_job_match(current_user.id, job_id)
        return {
            "overall_score": match.overall_score,
            "semantic_score": match.semantic_score,
            "skills_score": match.skills_score,
            "experience_score": match.experience_score,
            "matched_skills": json.loads(match.matched_skills_json or "[]"),
            "missing_skills": json.loads(match.missing_skills_json or "[]"),
            "explanation_summary": match.explanation_summary,
            "explanation_missing": match.explanation_missing
        }
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))

@router.post("/recalculate-matches")
def recalculate_matches(background_tasks: BackgroundTasks, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    user_id = current_user.id
    
    def process_queue():
        from app.database.database import SessionLocal
        bg_db = SessionLocal()
        try:
            bg_service = JobMatchingService(bg_db)
            bg_service.recalculate_matches(user_id)
        finally:
            bg_db.close()
            
    background_tasks.add_task(process_queue)
    return {"message": "Match recalculation started in the background"}
