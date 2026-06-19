from pydantic import BaseModel
from typing import List

class ResumeUploadResponse(BaseModel):
    filename: str
    message: str
    status: str
