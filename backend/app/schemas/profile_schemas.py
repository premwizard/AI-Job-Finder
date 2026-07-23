from datetime import datetime
from typing import Any, List, Optional

from pydantic import BaseModel, Field


# --- Languages ---
class LanguageCreate(BaseModel):
    name: str
    proficiency: str

class LanguageUpdate(BaseModel):
    name: Optional[str] = None
    proficiency: Optional[str] = None

class LanguageResponse(LanguageCreate):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True


# --- Personal Information ---
class PersonalInfoUpdate(BaseModel):
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    middle_name: Optional[str] = None
    preferred_name: Optional[str] = None
    date_of_birth: Optional[datetime] = None
    gender: Optional[str] = None
    alternate_phone_number: Optional[str] = None
    profile_picture_url: Optional[str] = None
    cover_banner_url: Optional[str] = None
    headline: Optional[str] = None
    bio: Optional[str] = None
    phone_number: Optional[str] = None
    country: Optional[str] = None
    state: Optional[str] = None
    city: Optional[str] = None
    postal_code: Optional[str] = None
    time_zone: Optional[str] = None
    languages: Optional[List[LanguageCreate]] = None


class PersonalInfoResponse(PersonalInfoUpdate):
    email: Optional[str] = None
    is_verified: Optional[bool] = None
    languages: List[LanguageResponse] = []
    
    class Config:
        from_attributes = True


# --- Professional Summary ---
class ProfessionalSummaryUpdate(BaseModel):
    headline: Optional[str] = Field(None, max_length=255)
    professional_summary: Optional[str] = Field(None, max_length=2000)
    career_objective: Optional[str] = Field(None, max_length=2000)
    years_of_experience_summary: Optional[str] = Field(None, max_length=2000)
    key_achievements: Optional[str] = Field(None, max_length=2000)
    career_highlights: Optional[str] = Field(None, max_length=2000)


class ProfessionalSummaryResponse(ProfessionalSummaryUpdate):
    pass

# --- Professional Information (New Module) ---
class ProfessionalInfoUpdate(BaseModel):
    # From UserProfile
    current_job_title: Optional[str] = None
    current_company: Optional[str] = None
    employment_status: Optional[str] = None
    years_of_experience: Optional[str] = None
    total_months_of_experience: Optional[int] = None
    industry: Optional[str] = None
    career_level: Optional[str] = None
    current_annual_salary: Optional[str] = None
    current_salary_currency: Optional[str] = None
    salary_type: Optional[str] = None
    notice_period: Optional[str] = None
    
    # From CareerPreference
    expected_salary: Optional[str] = None
    expected_joining_bonus: Optional[str] = None
    negotiable_salary: Optional[bool] = None
    preferred_currency: Optional[str] = None
    employment_types: Optional[str] = None # JSON/CSV
    work_setup: Optional[str] = None # JSON/CSV
    preferred_locations: Optional[str] = None # JSON/CSV
    preferred_time_zone: Optional[str] = None
    willing_to_relocate: Optional[bool] = None
    relocation_countries: Optional[str] = None
    visa_status: Optional[str] = None
    travel_willingness: Optional[str] = None

class ProfessionalInfoResponse(ProfessionalInfoUpdate):
    pass


# --- Skills ---
class SkillCreate(BaseModel):
    skill_name: str
    category: Optional[str] = None
    level: Optional[str] = None
    years_of_experience: Optional[int] = None
    last_used: Optional[int] = None
    currently_using: Optional[bool] = False
    featured_skill: Optional[bool] = False
    verified: Optional[bool] = False
    ai_skill_confidence: Optional[float] = None
    resume_extracted: Optional[bool] = False
    job_required: Optional[bool] = False
    skill_gap: Optional[bool] = False
    learning_priority: Optional[str] = None


class SkillUpdate(BaseModel):
    skill_name: Optional[str] = None
    category: Optional[str] = None
    level: Optional[str] = None
    years_of_experience: Optional[int] = None
    last_used: Optional[int] = None
    currently_using: Optional[bool] = None
    featured_skill: Optional[bool] = None
    verified: Optional[bool] = None
    ai_skill_confidence: Optional[float] = None
    resume_extracted: Optional[bool] = None
    job_required: Optional[bool] = None
    skill_gap: Optional[bool] = None
    learning_priority: Optional[str] = None


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
    department: Optional[str] = None
    work_model: Optional[str] = None
    start_date: Optional[datetime] = None
    end_date: Optional[datetime] = None
    is_current: bool = False
    description: Optional[str] = None
    achievements: Optional[str] = None
    technologies: Optional[str] = None
    manager_name: Optional[str] = None
    order: Optional[int] = 0
    skill_ids: Optional[List[int]] = []
    project_ids: Optional[List[str]] = []


class ExperienceUpdate(ExperienceCreate):
    company_name: Optional[str] = None  # type: ignore[assignment]
    role: Optional[str] = None  # type: ignore[assignment]


class ExperienceResponse(ExperienceCreate):
    id: str
    created_at: datetime
    updated_at: Optional[datetime] = None
    skills: List[SkillResponse] = []
    projects: List["ProjectResponse"] = []

    class Config:
        from_attributes = True


# --- Education ---
class EducationCreate(BaseModel):
    institution_name: str
    institution_logo_url: Optional[str] = None
    degree: str
    major: Optional[str] = None
    specialization: Optional[str] = None
    cgpa: Optional[str] = None
    grade: Optional[str] = None
    start_date: Optional[datetime] = None
    end_date: Optional[datetime] = None
    is_current: Optional[bool] = False
    activities: Optional[str] = None
    honors_awards: Optional[str] = None
    relevant_coursework: Optional[str] = None
    certificate_url: Optional[str] = None
    verification_status: Optional[str] = "unverified"
    order: Optional[int] = 0

    # Backwards compatibility property / alias if institution is passed
    @property
    def institution(self) -> str:
        return self.institution_name


class EducationUpdate(BaseModel):
    institution_name: Optional[str] = None
    institution_logo_url: Optional[str] = None
    degree: Optional[str] = None
    major: Optional[str] = None
    specialization: Optional[str] = None
    cgpa: Optional[str] = None
    grade: Optional[str] = None
    start_date: Optional[datetime] = None
    end_date: Optional[datetime] = None
    is_current: Optional[bool] = None
    activities: Optional[str] = None
    honors_awards: Optional[str] = None
    relevant_coursework: Optional[str] = None
    certificate_url: Optional[str] = None
    verification_status: Optional[str] = None
    order: Optional[int] = None


class EducationResponse(EducationCreate):
    id: str
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True


# --- Certifications ---
class CertificationCreate(BaseModel):
    name: str
    issuer: str
    credential_id: Optional[str] = None
    issue_date: Optional[datetime] = None
    expiry_date: Optional[datetime] = None
    does_not_expire: Optional[bool] = False
    verification_url: Optional[str] = None
    certificate_image_url: Optional[str] = None
    category: Optional[str] = None
    verification_status: Optional[str] = "unverified"


class CertificationUpdate(BaseModel):
    name: Optional[str] = None
    issuer: Optional[str] = None
    credential_id: Optional[str] = None
    issue_date: Optional[datetime] = None
    expiry_date: Optional[datetime] = None
    does_not_expire: Optional[bool] = None
    verification_url: Optional[str] = None
    certificate_image_url: Optional[str] = None
    category: Optional[str] = None
    verification_status: Optional[str] = None


class CertificationResponse(CertificationCreate):
    id: str
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True


# --- Projects ---
class ProjectCreate(BaseModel):
    name: str
    short_description: Optional[str] = None
    description: Optional[str] = None
    project_type: Optional[str] = None
    role: Optional[str] = None
    team_size: Optional[str] = None
    duration: Optional[str] = None
    duration_months: Optional[int] = None
    tech_stack: Optional[str] = None
    ai_technologies: Optional[str] = None
    github_url: Optional[str] = None
    live_demo_url: Optional[str] = None
    video_demo_url: Optional[str] = None
    images: Optional[str] = None
    highlights: Optional[str] = None
    challenges: Optional[str] = None
    achievements: Optional[str] = None
    status: Optional[str] = "Completed"
    is_featured: Optional[bool] = False

    @property
    def title(self) -> str:
        return self.name


class ProjectUpdate(BaseModel):
    name: Optional[str] = None
    short_description: Optional[str] = None
    description: Optional[str] = None
    project_type: Optional[str] = None
    role: Optional[str] = None
    team_size: Optional[str] = None
    duration: Optional[str] = None
    duration_months: Optional[int] = None
    tech_stack: Optional[str] = None
    ai_technologies: Optional[str] = None
    github_url: Optional[str] = None
    live_demo_url: Optional[str] = None
    video_demo_url: Optional[str] = None
    images: Optional[str] = None
    highlights: Optional[str] = None
    challenges: Optional[str] = None
    achievements: Optional[str] = None
    status: Optional[str] = None
    is_featured: Optional[bool] = None


class ProjectResponse(ProjectCreate):
    id: str
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True


# --- Career Preferences ---
class CareerPreferenceUpdate(BaseModel):
    # Roles & Industries
    preferred_roles: Optional[str] = None           # CSV chips
    preferred_industries: Optional[str] = None      # CSV chips
    # Location
    preferred_countries: Optional[str] = None       # CSV chips
    preferred_cities: Optional[str] = None          # CSV chips
    preferred_locations: Optional[str] = None       # Legacy
    # Work Setup
    work_setup: Optional[str] = None                # CSV: "Remote,Hybrid,Onsite"
    # Compensation
    expected_salary: Optional[str] = None
    preferred_currency: Optional[str] = None
    negotiable_salary: Optional[bool] = None
    # Company Preferences
    employment_types: Optional[str] = None          # CSV
    company_size: Optional[str] = None              # CSV
    startup_or_enterprise: Optional[str] = None     # "Startup", "Enterprise", "Any"
    # Mobility
    visa_sponsorship: Optional[bool] = None
    willing_to_relocate: Optional[bool] = None
    # Schedule & Travel
    availability: Optional[str] = None
    travel_willingness: Optional[str] = None
    preferred_shift: Optional[str] = None


class CareerPreferenceResponse(CareerPreferenceUpdate):
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True


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

    @classmethod
    def validate_url(cls, v: Optional[str]) -> Optional[str]:
        if v is None or v.strip() == "":
            return None
        v = v.strip()
        if not v.startswith(("http://", "https://")):
            v = f"https://{v}"
        return v

    def model_post_init(self, __context: Any) -> None:
        for field in self.model_fields:
            val = getattr(self, field, None)
            if isinstance(val, str):
                setattr(self, field, self.validate_url(val))


class SocialProfileResponse(SocialProfileUpdate):
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True


# --- AI Preferences ---
class AIPreferenceUpdate(BaseModel):
    # Aspirations
    dream_companies: Optional[str] = None          # CSV chips
    dream_roles: Optional[str] = None              # CSV chips
    dream_technologies: Optional[str] = None       # CSV chips
    # AI & Learning
    preferred_ai_domains: Optional[str] = None     # CSV chips
    learning_goals: Optional[str] = None           # Free text
    preferred_learning_resources: Optional[str] = None  # CSV chips
    # Career Goals
    target_salary: Optional[str] = None
    target_countries: Optional[str] = None         # CSV chips
    career_objectives: Optional[str] = None        # Free text
    career_growth_priorities: Optional[str] = None  # CSV chips


class AIPreferenceResponse(AIPreferenceUpdate):
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True


# --- Resume ---
class ResumeCreate(BaseModel):
    file_url: str
    file_name: Optional[str] = None
    file_size: Optional[int] = None
    file_type: Optional[str] = None
    version: int = 1
    is_active: bool = True
    parsing_status: str = "Ready"


class ResumeResponse(BaseModel):
    id: int
    file_url: str
    file_name: Optional[str] = None
    file_size: Optional[int] = None
    file_type: Optional[str] = None
    version: int
    is_active: bool = True
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

# --- Career Profile Overview ---
class ProfileStrengthResponse(BaseModel):
    score: int
    category: str
    explanation: str

class ProfileCompletionResponse(BaseModel):
    completion_percentage: int
    missing_sections: List[str]

class SectionCompletionItem(BaseModel):
    section: str
    completed: bool
    weight: int

class RecentUpdateItem(BaseModel):
    section: str
    updated_at: str

class ProfileAnalyticsResponse(BaseModel):
    profile_completion: int
    skills_count: int
    experience_count: int
    experience_years: float
    certifications_count: int
    projects_count: int
    resume_status: str
    career_readiness_score: int
    section_breakdown: List[SectionCompletionItem]
    recent_updates: List[RecentUpdateItem]


class ImageUploadResponse(BaseModel):
    url: str

ExperienceResponse.model_rebuild()


# --- Achievements ---
ACHIEVEMENT_TYPES = [
    "Award",
    "Scholarship",
    "Publication",
    "Open Source Contribution",
    "Hackathon",
    "Competition",
    "Patent",
    "Speaking Engagement",
]


class AchievementCreate(BaseModel):
    type: str
    title: str
    organization: Optional[str] = None
    date: Optional[datetime] = None
    description: Optional[str] = None
    url: Optional[str] = None


class AchievementUpdate(BaseModel):
    type: Optional[str] = None
    title: Optional[str] = None
    organization: Optional[str] = None
    date: Optional[datetime] = None
    description: Optional[str] = None
    url: Optional[str] = None


class AchievementResponse(BaseModel):
    id: str
    type: str
    title: str
    organization: Optional[str] = None
    date: Optional[datetime] = None
    description: Optional[str] = None
    url: Optional[str] = None
    file_url: Optional[str] = None
    file_name: Optional[str] = None
    order: int = 0
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True


# --- Job Search Preferences ---
class JobSearchPreferenceUpdate(BaseModel):
    search_frequency: Optional[str] = None
    email_notifications: Optional[bool] = None
    digest_frequency: Optional[str] = None
    job_alert_keywords: Optional[str] = None
    min_match_score: Optional[int] = None
    preferred_sources: Optional[str] = None
    ignore_companies: Optional[str] = None
    ignore_keywords: Optional[str] = None
    blocked_locations: Optional[str] = None


class JobSearchPreferenceResponse(JobSearchPreferenceUpdate):
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True


# --- Privacy Settings ---
class PrivacySettingUpdate(BaseModel):
    is_public_profile: Optional[bool] = None
    hide_email: Optional[bool] = None
    hide_phone: Optional[bool] = None
    resume_visibility: Optional[str] = None
    recruiter_visibility: Optional[bool] = None
    search_engine_indexing: Optional[bool] = None
    account_visibility: Optional[str] = None


class PrivacySettingResponse(PrivacySettingUpdate):
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True


# --- Notification Settings ---
class NotificationSettingUpdate(BaseModel):
    job_matches: Optional[bool] = None
    daily_digest: Optional[bool] = None
    weekly_digest: Optional[bool] = None
    resume_tips: Optional[bool] = None
    career_tips: Optional[bool] = None
    interview_reminders: Optional[bool] = None
    product_updates: Optional[bool] = None
    security_alerts: Optional[bool] = None

    email_channel: Optional[bool] = None
    in_app_channel: Optional[bool] = None
    push_channel: Optional[bool] = None

    notification_frequency: Optional[str] = None
    quiet_hours_enabled: Optional[bool] = None
    quiet_hours_start: Optional[str] = None
    quiet_hours_end: Optional[str] = None


class NotificationSettingResponse(NotificationSettingUpdate):
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True




