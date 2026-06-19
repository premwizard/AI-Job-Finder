from fastapi import APIRouter, UploadFile, File
from src.schemas.resume import ResumeUploadResponse

router = APIRouter(prefix="/resume", tags=["Resume"])

@router.post("/upload", response_model=ResumeUploadResponse)
async def upload_resume(file: UploadFile = File(...)):
    # Mock upload logic
    return {
        "filename": file.filename,
        "message": "Resume uploaded and analyzed successfully",
        "status": "success"
    }
