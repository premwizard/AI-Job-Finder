from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database.database import get_db
from app.services.optimization_service import OptimizationService
from app.routes.auth_routes import get_current_user
from app.models.models import User
from pydantic import BaseModel
import json

router = APIRouter(prefix="/api/resume/optimize", tags=["resume_optimization"])

class OptimizeRequest(BaseModel):
    job_id: int

@router.post("")
def generate_optimization(req: OptimizeRequest, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    service = OptimizationService(db)
    opt = service.optimize_resume(current_user.id, req.job_id)
    return {
        "id": opt.id,
        "job_id": opt.job_id,
        "projected_ats_score": opt.projected_ats_score,
        "projected_match_score": opt.projected_match_score,
        "suggestions": json.loads(opt.suggestions_json),
        "status": opt.status
    }

@router.get("/history")
def get_history(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    service = OptimizationService(db)
    opts = service.get_optimizations(current_user.id)
    return [{
        "id": o.id,
        "job_id": o.job_id,
        "job_title": o.job.title if o.job else "Unknown Job",
        "projected_ats_score": o.projected_ats_score,
        "status": o.status,
        "created_at": o.created_at
    } for o in opts]

@router.post("/{id}/apply")
def apply_optimization(id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    service = OptimizationService(db)
    return service.apply_optimization(id, current_user.id)
