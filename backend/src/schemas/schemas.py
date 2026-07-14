from datetime import datetime
from typing import Optional

from pydantic import BaseModel, EmailStr

from src.models.models import ApplicationStatus


# Common generic properties
class BaseSchema(BaseModel):
    class Config:
        from_attributes = True


# --- User Schemas ---
class UserBase(BaseSchema):
    email: EmailStr
    full_name: str
    preferred_role: Optional[str] = None
    experience: Optional[str] = None
    education: Optional[str] = None
    work_preference: Optional[str] = None


class UserCreate(UserBase):
    password: str


class UserResponse(UserBase):
    id: int
    created_at: datetime


class Token(BaseModel):
    access_token: str
    token_type: str


class TokenData(BaseModel):
    email: Optional[str] = None


# --- Skill Schemas ---
class SkillBase(BaseSchema):
    skill_name: str


class SkillCreate(SkillBase):
    pass


class SkillResponse(SkillBase):
    id: int
    user_id: int


# --- Resume Schemas ---
class ResumeBase(BaseSchema):
    file_url: str
    resume_score: Optional[float] = None
    ats_score: Optional[float] = None


class ResumeResponse(ResumeBase):
    id: int
    user_id: int
    uploaded_at: datetime


# --- Job Schemas ---
class JobBase(BaseSchema):
    company_name: str
    job_title: str
    location: str
    salary: Optional[str] = None
    description: Optional[str] = None
    source: str
    job_url: str
    job_hash: Optional[str] = None


class JobResponse(JobBase):
    id: int
    created_at: datetime


class JobDetailResponse(JobResponse):
    pass


# --- SavedJob Schemas ---
class SavedJobResponse(BaseSchema):
    id: int
    user_id: int
    job_id: int
    created_at: datetime
    job: JobResponse


# --- Application Schemas ---
class ApplicationBase(BaseSchema):
    status: ApplicationStatus = ApplicationStatus.applied


class ApplicationResponse(ApplicationBase):
    id: int
    user_id: int
    job_id: int
    applied_at: datetime
    job: JobResponse


# --- Analytics Schemas ---
class AnalyticsResponse(BaseSchema):
    id: int
    user_id: int
    jobs_found: int
    matched_jobs: int
    applications_sent: int
    created_at: datetime
