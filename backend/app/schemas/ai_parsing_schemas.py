from pydantic import BaseModel, Field
from typing import List, Optional

class ConfidenceScores(BaseModel):
    skills: int = Field(default=0, ge=0, le=100)
    salary: int = Field(default=0, ge=0, le=100)
    experience: int = Field(default=0, ge=0, le=100)
    benefits: int = Field(default=0, ge=0, le=100)
    overall: int = Field(default=0, ge=0, le=100)

class SalaryInfo(BaseModel):
    min: Optional[int] = None
    max: Optional[int] = None
    currency: Optional[str] = None
    period: Optional[str] = None # hourly, monthly, yearly

class ExperienceInfo(BaseModel):
    min: Optional[int] = None
    max: Optional[int] = None
    career_level: Optional[str] = None # Junior, Mid, Senior, etc.

class Requirements(BaseModel):
    required: List[str] = []
    preferred: List[str] = []
    optional: List[str] = []

class SkillCategorization(BaseModel):
    programming_languages: List[str] = []
    frameworks: List[str] = []
    libraries: List[str] = []
    databases: List[str] = []
    cloud_platforms: List[str] = []
    devops: List[str] = []
    ai: List[str] = []
    llms: List[str] = []
    vector_databases: List[str] = []
    backend: List[str] = []
    frontend: List[str] = []
    mobile: List[str] = []
    security: List[str] = []
    testing: List[str] = []
    data_engineering: List[str] = []
    analytics: List[str] = []
    other: List[str] = []

class TechSummary(BaseModel):
    top_technologies: List[str] = []
    categories: List[str] = []

class JobParsingResponse(BaseModel):
    job_title: Optional[str] = None
    department: Optional[str] = None
    employment_type: Optional[str] = None
    work_mode: Optional[str] = None
    
    experience: ExperienceInfo
    salary: SalaryInfo
    
    technical_skills: SkillCategorization
    soft_skills: List[str] = []
    nice_to_have_skills: List[str] = []
    
    responsibilities: List[str] = []
    requirements: Requirements
    benefits: List[str] = []
    
    company_industry: Optional[str] = None
    company_size: Optional[str] = None
    company_stage: Optional[str] = None
    
    primary_keywords: List[str] = []
    secondary_keywords: List[str] = []
    ai_keywords: List[str] = []
    ats_keywords: List[str] = []
    
    tech_summary: TechSummary
    
    seniority: Optional[str] = None
    seniority_reason: Optional[str] = None
    
    ai_summary: Optional[str] = None
    confidence: ConfidenceScores
