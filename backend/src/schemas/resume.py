from pydantic import BaseModel


class ResumeUploadResponse(BaseModel):
    filename: str
    message: str
    status: str
