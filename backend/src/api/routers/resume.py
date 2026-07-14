from fastapi import APIRouter, Depends, File, HTTPException, UploadFile
from sqlalchemy.orm import Session

from src.api.deps import get_current_user
from src.database.database import get_db
from src.models import models
from src.schemas import schemas

router = APIRouter(prefix="/resume", tags=["Resume"])


@router.post("/upload", response_model=schemas.ResumeResponse)
async def upload_resume(
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    # In a real app we'd upload the file to S3 or local storage and parse it.
    # Here we mock the parsing but save the DB record.
    new_resume = models.Resume(
        user_id=current_user.id,
        file_url=f"/uploads/{file.filename}",
        resume_score=85.0,  # Mock score
        ats_score=90.0,  # Mock ATS score
    )
    db.add(new_resume)
    db.commit()
    db.refresh(new_resume)
    return new_resume


@router.get("", response_model=schemas.ResumeResponse)
def get_resume(
    db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)
):
    resume = (
        db.query(models.Resume)
        .filter(models.Resume.user_id == current_user.id)
        .order_by(models.Resume.uploaded_at.desc())
        .first()
    )
    if not resume:
        raise HTTPException(status_code=404, detail="Resume not found")
    return resume
