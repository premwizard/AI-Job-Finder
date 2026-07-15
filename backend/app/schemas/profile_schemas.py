from datetime import datetime
from typing import List, Optional

from pydantic import BaseModel


# --- Personal Information ---
class PersonalInfoUpdate(BaseModel):
    profile_picture_url: Optional[str] = None
    cover_banner_url: Optional[str] = None
    headline: Optional[str] = None
    bio: Optional[str] = None
    phone_number: Optional[str] = None
    country: Optional[str] = None
    state: Optional[str] = None
    city: Optional[str] = None
    time_zone: Optional[str] = None
    languages: Optional[str] = None


class PersonalInfoResponse(PersonalInfoUpdate):
    pass


# --- Professional Summary ---
class ProfessionalSummaryUpdate(BaseModel):
    current_job_title: Optional[str] = None
    current_company: Optional[str] = None
    employment_status: Optional[str] = None
    years_of_experience: Optional[str] = None
    industry: Optional[str] = None
    career_level: Optional[str] = None
    expected_salary: Optional[str] = None
    preferred_currency: Optional[str] = None
    notice_period: Optional[str] = None
    professional_summary: Optional[str] = None


class ProfessionalSummaryResponse(ProfessionalSummaryUpdate):
    pass


# --- Skills ---
class SkillCreate(BaseModel):
    skill_name: str
    category: Optional[str] = None
    level: Optional[str] = None
    years_of_experience: Optional[int] = None


class SkillUpdate(BaseModel):
    skill_name: Optional[str] = None
    category: Optional[str] = None
    level: Optional[str] = None
    years_of_experience: Optional[int] = None


class SkillResponse(SkillCreate):
    id: int

    class Config:
        from_attributes = True


# --- Experience ---
class ExperienceCreate(BaseModel):
    company_name: str
    company_logo_url: Optional[str] = None
    role: str
    employment_type: Optional[str] = None
    location: Optional[str] = None
    start_date: Optional[datetime] = None
    end_date: Optional[datetime] = None
    is_current: bool = False
    description: Optional[str] = None
    achievements: Optional[str] = None
    technologies: Optional[str] = None


class ExperienceUpdate(ExperienceCreate):
    company_name: Optional[str] = None  # type: ignore[assignment]
    role: Optional[str] = None  # type: ignore[assignment]


class ExperienceResponse(ExperienceCreate):
    id: str
    created_at: datetime

    class Config:
        from_attributes = True


# --- Education ---
class EducationCreate(BaseModel):
    institution: str
    degree: str
    major: Optional[str] = None
    specialization: Optional[str] = None
    cgpa: Optional[str] = None
    start_date: Optional[datetime] = None
    end_date: Optional[datetime] = None
    activities: Optional[str] = None
    achievements: Optional[str] = None


class EducationUpdate(EducationCreate):
    institution: Optional[str] = None  # type: ignore[assignment]
    degree: Optional[str] = None  # type: ignore[assignment]


class EducationResponse(EducationCreate):
    id: str
    created_at: datetime

    class Config:
        from_attributes = True


# --- Certifications ---
class CertificationCreate(BaseModel):
    name: str
    issuer: str
    credential_id: Optional[str] = None
    issue_date: Optional[datetime] = None
    expiry_date: Optional[datetime] = None
    verification_url: Optional[str] = None
    certificate_image_url: Optional[str] = None


class CertificationUpdate(CertificationCreate):
    name: Optional[str] = None  # type: ignore[assignment]
    issuer: Optional[str] = None  # type: ignore[assignment]


class CertificationResponse(CertificationCreate):
    id: str
    created_at: datetime

    class Config:
        from_attributes = True


# --- Projects ---
class ProjectCreate(BaseModel):
    name: str
    description: Optional[str] = None
    project_type: Optional[str] = None
    role: Optional[str] = None
    team_size: Optional[int] = None
    duration_months: Optional[int] = None
    tech_stack: Optional[str] = None
    ai_technologies: Optional[str] = None
    github_url: Optional[str] = None
    live_demo_url: Optional[str] = None
    video_demo_url: Optional[str] = None
    highlights: Optional[str] = None
    challenges: Optional[str] = None
    achievements: Optional[str] = None


class ProjectUpdate(ProjectCreate):
    name: Optional[str] = None  # type: ignore[assignment]


class ProjectResponse(ProjectCreate):
    id: str
    created_at: datetime

    class Config:
        from_attributes = True


# --- Career Preferences ---
class CareerPreferenceUpdate(BaseModel):
    preferred_roles: Optional[str] = None
    preferred_industries: Optional[str] = None
    preferred_locations: Optional[str] = None
    work_setup: Optional[str] = None
    expected_salary: Optional[str] = None
    preferred_currency: Optional[str] = None
    employment_types: Optional[str] = None
    company_size: Optional[str] = None
    visa_sponsorship: Optional[bool] = None
    willing_to_relocate: Optional[bool] = None
    travel_willingness: Optional[str] = None
    preferred_shift: Optional[str] = None
    availability: Optional[str] = None


class CareerPreferenceResponse(CareerPreferenceUpdate):
    pass


# --- Social Profiles ---
class SocialProfileUpdate(BaseModel):
    github_url: Optional[str] = None
    linkedin_url: Optional[str] = None
    portfolio_url: Optional[str] = None
    kaggle_url: Optional[str] = None
    leetcode_url: Optional[str] = None
    codeforces_url: Optional[str] = None
    hackerrank_url: Optional[str] = None
    medium_url: Optional[str] = None
    devto_url: Optional[str] = None
    youtube_url: Optional[str] = None
    twitter_url: Optional[str] = None


class SocialProfileResponse(SocialProfileUpdate):
    pass


# --- AI Preferences ---
class AIPreferenceUpdate(BaseModel):
    dream_companies: Optional[str] = None
    dream_roles: Optional[str] = None
    dream_technologies: Optional[str] = None
    preferred_ai_domains: Optional[str] = None
    learning_goals: Optional[str] = None
    interview_level: Optional[str] = None
    target_salary: Optional[str] = None
    target_country: Optional[str] = None
    career_objectives: Optional[str] = None
    job_search_frequency: Optional[str] = None
    career_growth_priorities: Optional[str] = None


class AIPreferenceResponse(AIPreferenceUpdate):
    pass


# --- Resume Metadata ---
class ResumeResponse(BaseModel):
    id: int
    file_url: str
    file_name: Optional[str] = None
    file_size: Optional[int] = None
    version: int
    resume_score: Optional[float] = None
    ats_score: Optional[float] = None
    parsing_status: str
    ai_summary: Optional[str] = None
    uploaded_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


# --- Comprehensive Profile Response ---
class FullProfileResponse(BaseModel):
    completion_percentage: int
    personal_info: Optional[PersonalInfoResponse] = None
    professional_summary: Optional[ProfessionalSummaryResponse] = None
    skills: List[SkillResponse] = []
    experiences: List[ExperienceResponse] = []
    educations: List[EducationResponse] = []
    certifications: List[CertificationResponse] = []
    projects: List[ProjectResponse] = []
    career_preferences: Optional[CareerPreferenceResponse] = None
    social_profiles: Optional[SocialProfileResponse] = None
    ai_preferences: Optional[AIPreferenceResponse] = None
    resumes: List[ResumeResponse] = []
