import json
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database.database import get_db
from app.services.learning_service import LearningService
from app.routes.auth_routes import get_current_user
from app.models.models import User

router = APIRouter(prefix="/api/learning", tags=["learning"])

@router.get("/job/{job_id}")
def get_job_learning_roadmap(job_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    service = LearningService(db)
    try:
        roadmap = service.get_roadmap(current_user.id, job_id)
        return {
            "id": roadmap.id,
            "roadmap": json.loads(roadmap.roadmap_json or "[]"),
            "projected_improvements": json.loads(roadmap.projected_improvements_json or "[]"),
            "career_growth_insights": json.loads(roadmap.career_growth_insights_json or "{}")
        }
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
        
@router.post("/regenerate/{job_id}")
def regenerate_job_roadmap(job_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    service = LearningService(db)
    from app.models.models import JobLearningRoadmap
    existing = db.query(JobLearningRoadmap).filter_by(user_id=current_user.id, job_id=job_id).first()
    if existing:
        existing.is_stale = True
        db.commit()
    
    try:
        roadmap = service.get_roadmap(current_user.id, job_id)
        return {"message": "Regenerated successfully"}
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
