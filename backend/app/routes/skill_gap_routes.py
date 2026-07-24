from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Optional
from pydantic import BaseModel
import json
from datetime import datetime

from app.database.database import get_db
from app.models.models import User, Resume, SkillGapAnalysis
from app.middleware.auth_middleware import get_current_user
from app.services.skill_gap_service import SkillGapService

router = APIRouter(prefix="/api/profile/skill-gap", tags=["skill-gap"])

class AnalyzeSkillGapRequest(BaseModel):
    target_role: str
    target_industry: str
    resume_id: Optional[int] = None

@router.post("/analyze")
def analyze_skill_gap(
    req: AnalyzeSkillGapRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    if req.resume_id:
        resume = db.query(Resume).filter(Resume.id == req.resume_id, Resume.user_id == current_user.id).first()
    else:
        # Get the most recently uploaded or updated resume
        resume = db.query(Resume).filter(Resume.user_id == current_user.id).order_by(Resume.updated_at.desc()).first()

    if not resume:
        raise HTTPException(status_code=404, detail="No resume found to analyze against")

    resume_text = resume.clean_text or resume.raw_text or ""
    if not resume_text:
        raise HTTPException(status_code=400, detail="Selected resume has no parseable text")

    result = SkillGapService.analyze_skill_gap(
        resume_text=resume_text,
        target_role=req.target_role,
        target_industry=req.target_industry
    )

    # Save to history
    history_entry = SkillGapAnalysis(
        user_id=current_user.id,
        resume_id=resume.id,
        target_role=req.target_role,
        target_industry=req.target_industry,
        gap_percentage=result.gap_percentage,
        analysis_data_json=result.model_dump_json()
    )
    db.add(history_entry)
    db.commit()

    return result

@router.get("/history")
def get_skill_gap_history(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    history = db.query(SkillGapAnalysis).filter(SkillGapAnalysis.user_id == current_user.id).order_by(SkillGapAnalysis.created_at.desc()).all()
    return history
