from pydantic import BaseModel, HttpUrl
from typing import List, Optional, Any
from datetime import datetime

class JobLocationSchema(BaseModel):
    country: Optional[str] = None
    state: Optional[str] = None
    city: Optional[str] = None
    is_remote: bool = False
    is_hybrid: bool = False

    class Config:
        from_attributes = True

class JobSkillSchema(BaseModel):
    skill_name: str
    category: Optional[str] = None

    class Config:
        from_attributes = True

class JobRequirementSchema(BaseModel):
    requirement_text: str

    class Config:
        from_attributes = True

class JobBenefitSchema(BaseModel):
    benefit_text: str

    class Config:
        from_attributes = True

class JobSchema(BaseModel):
    id: int
    job_hash: Optional[str] = None
    source: Optional[str] = None
    original_url: Optional[str] = None
    company_name: Optional[str] = None
    company_logo: Optional[str] = None
    company_size: Optional[str] = None
    company_industry: Optional[str] = None
    company_website: Optional[str] = None
    job_title: Optional[str] = None
    employment_type: Optional[str] = None
    work_mode: Optional[str] = None
    industry: Optional[str] = None
    min_salary: Optional[int] = None
    max_salary: Optional[int] = None
    salary_currency: Optional[str] = None
    salary_period: Optional[str] = None
    salary_available: bool = False
    min_experience: Optional[int] = None
    max_experience: Optional[int] = None
    career_level: Optional[str] = None
    description_raw: Optional[str] = None
    description_clean: Optional[str] = None
    description_markdown: Optional[str] = None
    description_summary: Optional[str] = None
    posted_date: Optional[datetime] = None
    collected_date: Optional[datetime] = None
    expiry_date: Optional[datetime] = None
    language: Optional[str] = None
    source_confidence: Optional[float] = None
    parsing_status: Optional[str] = None
    embedding_status: bool = False
    ai_processed: bool = False

    locations: List[JobLocationSchema] = []
    skills: List[JobSkillSchema] = []
    requirements: List[JobRequirementSchema] = []
    benefits: List[JobBenefitSchema] = []

    class Config:
        from_attributes = True

class JobPaginationResponse(BaseModel):
    total: int
    page: int
    size: int
    pages: int
    items: List[JobSchema]

class JobStatisticsResponse(BaseModel):
    total_jobs: int
    jobs_today: int
    remote_jobs: int
    top_skills: List[dict]
    top_companies: List[dict]
    top_sources: List[dict]
