from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from app.database.database import get_db
from app.models.models import User, Resume, ResumeVersion
from app.middleware.auth_middleware import get_current_user
from app.services.version_service import VersionService

router = APIRouter(prefix="/api/profile/resume/{resume_id}/versions", tags=["resume-versions"])

@router.get("/")
def get_resume_versions(
    resume_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    resume = db.query(Resume).filter(Resume.id == resume_id, Resume.user_id == current_user.id).first()
    if not resume:
        raise HTTPException(status_code=404, detail="Resume not found")
        
    versions = db.query(ResumeVersion).filter(ResumeVersion.resume_id == resume_id).order_by(ResumeVersion.version_number.desc()).all()
    return versions

@router.get("/{version_id}")
def get_resume_version_details(
    resume_id: int,
    version_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    version = db.query(ResumeVersion).filter(ResumeVersion.id == version_id, ResumeVersion.resume_id == resume_id).first()
    if not version:
        raise HTTPException(status_code=404, detail="Version not found")
    return version

@router.post("/{version_id}/restore")
def restore_resume_version(
    resume_id: int,
    version_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    resume = db.query(Resume).filter(Resume.id == resume_id, Resume.user_id == current_user.id).first()
    if not resume:
        raise HTTPException(status_code=404, detail="Resume not found")
        
    try:
        VersionService.restore_version(resume, version_id, db)
        return {"message": "Resume restored successfully"}
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.delete("/{version_id}")
def delete_resume_version(
    resume_id: int,
    version_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    resume = db.query(Resume).filter(Resume.id == resume_id, Resume.user_id == current_user.id).first()
    if not resume:
        raise HTTPException(status_code=404, detail="Resume not found")
        
    version = db.query(ResumeVersion).filter(ResumeVersion.id == version_id, ResumeVersion.resume_id == resume_id).first()
    if not version:
        raise HTTPException(status_code=404, detail="Version not found")
        
    db.delete(version)
    db.commit()
    
    return {"message": "Version deleted successfully"}
