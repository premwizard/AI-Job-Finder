from pydantic import BaseModel
from typing import List, Optional

class JobBase(BaseModel):
    title: str
    company: str
    location: Optional[str] = None
    url: str
    date_posted: Optional[str] = None
    source: str

class JobResponse(JobBase):
    score: Optional[int] = None
    category: Optional[str] = None
    
    class Config:
        from_attributes = True

class JobDetailResponse(JobResponse):
    description: Optional[str] = None

class SavedJobCreate(BaseModel):
    id: str
    title: str
    company: str
    location: str
    salary: Optional[str] = None
    matchScore: Optional[int] = None

class SavedJobResponse(SavedJobCreate):
    pass
