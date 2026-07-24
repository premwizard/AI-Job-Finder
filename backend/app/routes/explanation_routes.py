import json
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database.database import get_db
from app.services.explanation_service import ExplanationService
from app.routes.auth_routes import get_current_user
from app.models.models import User

router = APIRouter(prefix="/api/explanations", tags=["explanations"])

@router.get("/{job_id}")
def get_job_explanation(job_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    service = ExplanationService(db)
    try:
        exp = service.get_explanation(current_user.id, job_id)
        return {
            "id": exp.id,
            "overall_summary": exp.overall_summary,
            "strengths": json.loads(exp.strengths_json or "[]"),
            "missing_skills_analysis": json.loads(exp.missing_skills_json or "[]"),
            "risk_factors": json.loads(exp.risk_factors_json or "[]"),
            "improvement_suggestions": json.loads(exp.improvement_suggestions_json or "[]"),
            "career_growth_analysis": exp.career_growth_analysis,
            "confidence_explanation": exp.confidence_explanation,
            "confidence_score": exp.confidence_score
        }
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
        
@router.post("/regenerate/{job_id}")
def regenerate_job_explanation(job_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    # Simple regenerate by invalidating cache and fetching
    service = ExplanationService(db)
    from app.models.models import JobExplanation
    existing = db.query(JobExplanation).filter_by(user_id=current_user.id, job_id=job_id).first()
    if existing:
        existing.is_stale = True
        db.commit()
    
    try:
        exp = service.get_explanation(current_user.id, job_id)
        return {"message": "Regenerated successfully"}
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
