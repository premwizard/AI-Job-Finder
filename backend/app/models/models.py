import enum
import uuid
from datetime import datetime
from typing import Any

from sqlalchemy import (
    Boolean,
    Column,
    DateTime,
    Enum,
    Float,
    ForeignKey,
    Integer,
    String,
    Text,
    Table,
    Date,
)
from sqlalchemy.orm import relationship

from app.database.database import Base

# --- Association Tables ---
experience_skills = Table(
    "experience_skills",
    Base.metadata,
    Column("experience_id", String, ForeignKey("experiences.id", ondelete="CASCADE"), primary_key=True),
    Column("skill_id", Integer, ForeignKey("skills.id", ondelete="CASCADE"), primary_key=True)
)

experience_projects = Table(
    "experience_projects",
    Base.metadata,
    Column("experience_id", String, ForeignKey("experiences.id", ondelete="CASCADE"), primary_key=True),
    Column("project_id", String, ForeignKey("projects.id", ondelete="CASCADE"), primary_key=True)
)

project_skills = Table(
    "project_skills",
    Base.metadata,
    Column("project_id", String, ForeignKey("projects.id", ondelete="CASCADE"), primary_key=True),
    Column("skill_id", Integer, ForeignKey("skills.id", ondelete="CASCADE"), primary_key=True)
)


class ApplicationStatus(str, enum.Enum):
    saved = "saved"
    applied = "applied"
    interview = "interview"
    rejected = "rejected"
    selected = "selected"


class AuthProvider(str, enum.Enum):
    email = "email"
    google = "google"
    github = "github"
    microsoft = "microsoft"
    linkedin = "linkedin"


class User(Base):
    __tablename__ = "users"

    id: Any = Column(
        String, primary_key=True, index=True, default=lambda: str(uuid.uuid4())
    )
    first_name: Any = Column(String, nullable=False)
    last_name: Any = Column(String, nullable=False)
    email: Any = Column(String, unique=True, index=True, nullable=False)
    password_hash: Any = Column(String, nullable=True)
    is_verified: Any = Column(Boolean, default=False)
    auth_provider: Any = Column(Enum(AuthProvider), default=AuthProvider.email)
    is_active: Any = Column(Boolean, default=True)
    is_deleted: Any = Column(Boolean, default=False)
    deleted_at: Any = Column(DateTime, nullable=True)
    verified_at: Any = Column(DateTime, nullable=True)
    created_at: Any = Column(DateTime, default=datetime.utcnow)
    updated_at: Any = Column(
        DateTime, default=datetime.utcnow, onupdate=datetime.utcnow
    )

    profile = relationship("UserProfile", back_populates="user", uselist=False)
    skills = relationship("Skill", back_populates="user")
    resumes = relationship("Resume", back_populates="user")
    saved_jobs = relationship("SavedJob", back_populates="user")
    applications = relationship("Application", back_populates="user")
    analytics = relationship("Analytics", back_populates="user", uselist=False)
    connected_accounts = relationship("ConnectedAccount", back_populates="user")
    education = relationship("Education", back_populates="user", cascade="all, delete-orphan")


class UserProfile(Base):
    __tablename__ = "user_profiles"

    id: Any = Column(
        String, primary_key=True, index=True, default=lambda: str(uuid.uuid4())
    )
    user_id: Any = Column(String, ForeignKey("users.id"), unique=True, nullable=False)

    # Personal Information
    profile_picture_url: Any = Column(String, nullable=True)
    cover_banner_url: Any = Column(String, nullable=True)
    headline: Any = Column(String, nullable=True)
    bio: Any = Column(Text, nullable=True)
    middle_name: Any = Column(String, nullable=True)
    preferred_name: Any = Column(String, nullable=True)
    phone_number: Any = Column(String, nullable=True)
    alternate_phone_number: Any = Column(String, nullable=True)
    date_of_birth: Any = Column(DateTime, nullable=True)
    gender: Any = Column(String, nullable=True)
    country: Any = Column(String, nullable=True)
    state: Any = Column(String, nullable=True)
    city: Any = Column(String, nullable=True)
    postal_code: Any = Column(String, nullable=True)
    time_zone: Any = Column(String, nullable=True)
    languages: Any = Column(String, nullable=True)  # Legacy Comma separated string

    # Professional Summary
    current_job_title: Any = Column(String, nullable=True)
    current_company: Any = Column(String, nullable=True)
    employment_status: Any = Column(String, nullable=True)
    years_of_experience: Any = Column(String, nullable=True)
    total_months_of_experience: Any = Column(Integer, nullable=True)
    industry: Any = Column(String, nullable=True)
    career_level: Any = Column(String, nullable=True)
    current_annual_salary: Any = Column(String, nullable=True)
    current_salary_currency: Any = Column(String, nullable=True)
    salary_type: Any = Column(String, nullable=True)
    expected_salary: Any = Column(String, nullable=True)
    preferred_currency: Any = Column(String, nullable=True)
    notice_period: Any = Column(String, nullable=True)
    professional_summary: Any = Column(Text, nullable=True)
    career_objective: Any = Column(Text, nullable=True)
    years_of_experience_summary: Any = Column(Text, nullable=True)
    key_achievements: Any = Column(Text, nullable=True)
    career_highlights: Any = Column(Text, nullable=True)

    created_at: Any = Column(DateTime, default=datetime.utcnow)
    updated_at: Any = Column(
        DateTime, default=datetime.utcnow, onupdate=datetime.utcnow
    )

    user = relationship("User", back_populates="profile")
    language_proficiencies = relationship("Language", back_populates="profile", cascade="all, delete-orphan")


class Language(Base):
    __tablename__ = "languages"

    id: Any = Column(Integer, primary_key=True, index=True)
    user_id: Any = Column(String, ForeignKey("users.id"), nullable=False)
    profile_id: Any = Column(String, ForeignKey("user_profiles.id"), nullable=False)
    name: Any = Column(String, nullable=False)
    proficiency: Any = Column(String, nullable=False)  # Native, Fluent, Professional, Intermediate, Beginner
    created_at: Any = Column(DateTime, default=datetime.utcnow)

    user = relationship("User")
    profile = relationship("UserProfile", back_populates="language_proficiencies")


class Skill(Base):
    __tablename__ = "skills"

    id: Any = Column(Integer, primary_key=True, index=True)
    user_id: Any = Column(String, ForeignKey("users.id"))
    skill_name: Any = Column(String, index=True)
    category: Any = Column(String, nullable=True)
    level: Any = Column(String, nullable=True)  # Beginner, Intermediate, Expert
    years_of_experience: Any = Column(Integer, nullable=True)
    
    # New Fields for Module 4
    last_used: Any = Column(Integer, nullable=True)  # Year
    currently_using: Any = Column(Boolean, default=False)
    featured_skill: Any = Column(Boolean, default=False)
    verified: Any = Column(Boolean, default=False)
    
    # Future AI Fields
    ai_skill_confidence: Any = Column(Float, nullable=True)
    resume_extracted: Any = Column(Boolean, default=False)
    job_required: Any = Column(Boolean, default=False)
    skill_gap: Any = Column(Boolean, default=False)
    learning_priority: Any = Column(String, nullable=True)

    user = relationship("User", back_populates="skills")
    experiences = relationship("Experience", secondary="experience_skills", back_populates="skills")
    projects = relationship("Project", secondary="project_skills", back_populates="skills")


class Resume(Base):
    __tablename__ = "resumes"

    id: Any = Column(Integer, primary_key=True, index=True)
    user_id: Any = Column(String, ForeignKey("users.id"))
    file_url: Any = Column(String)
    file_name: Any = Column(String, nullable=True)
    file_size: Any = Column(Integer, nullable=True)  # in bytes
    file_type: Any = Column(String, nullable=True)   # e.g. "PDF", "DOCX"
    version: Any = Column(Integer, default=1)
    is_active: Any = Column(Boolean, default=True)

    # Reserved — AI / Parsing fields (not implemented yet)
    resume_score: Any = Column(Float, nullable=True)
    ats_score: Any = Column(Float, nullable=True)
    parsing_status: Any = Column(String, default="Ready")  # Ready, Processing, Completed
    ai_summary: Any = Column(Text, nullable=True)

    uploaded_at: Any = Column(DateTime, default=datetime.utcnow)
    updated_at: Any = Column(
        DateTime, default=datetime.utcnow, onupdate=datetime.utcnow
    )

    user = relationship("User", back_populates="resumes")


class Job(Base):
    __tablename__ = "jobs"

    id: Any = Column(Integer, primary_key=True, index=True)
    job_hash: Any = Column(
        String, unique=True, index=True, nullable=True
    )  # To deduplicate
    company_name: Any = Column(String, index=True)
    job_title: Any = Column(String, index=True)
    location: Any = Column(String)
    salary: Any = Column(String, nullable=True)
    description: Any = Column(Text, nullable=True)
    source: Any = Column(String)
    job_url: Any = Column(String)
    created_at: Any = Column(DateTime, default=datetime.utcnow)

    saved_by = relationship("SavedJob", back_populates="job")
    applications = relationship("Application", back_populates="job")


class SavedJob(Base):
    __tablename__ = "saved_jobs"

    id: Any = Column(Integer, primary_key=True, index=True)
    user_id: Any = Column(String, ForeignKey("users.id"))
    job_id: Any = Column(Integer, ForeignKey("jobs.id"))
    created_at: Any = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="saved_jobs")
    job = relationship("Job", back_populates="saved_by")


class Application(Base):
    __tablename__ = "applications"

    id: Any = Column(Integer, primary_key=True, index=True)
    user_id: Any = Column(String, ForeignKey("users.id"))
    job_id: Any = Column(Integer, ForeignKey("jobs.id"))
    status: Any = Column(Enum(ApplicationStatus), default=ApplicationStatus.applied)
    applied_at: Any = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="applications")
    job = relationship("Job", back_populates="applications")


class Analytics(Base):
    __tablename__ = "analytics"

    id: Any = Column(Integer, primary_key=True, index=True)
    user_id: Any = Column(String, ForeignKey("users.id"), unique=True)
    jobs_found: Any = Column(Integer, default=0)
    matched_jobs: Any = Column(Integer, default=0)
    applications_sent: Any = Column(Integer, default=0)
    created_at: Any = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="analytics")


class PasswordResetToken(Base):
    __tablename__ = "password_reset_tokens"

    id: Any = Column(
        String, primary_key=True, index=True, default=lambda: str(uuid.uuid4())
    )
    user_id: Any = Column(String, ForeignKey("users.id"), nullable=False, index=True)
    token_hash: Any = Column(String, nullable=False, unique=True, index=True)
    otp_hash: Any = Column(String, nullable=False)
    expires_at: Any = Column(DateTime, nullable=False)
    attempts: Any = Column(Integer, default=0)
    used: Any = Column(Boolean, default=False)
    created_at: Any = Column(DateTime, default=datetime.utcnow)

    user = relationship("User")


class RefreshToken(Base):
    __tablename__ = "refresh_tokens"

    id: Any = Column(
        String, primary_key=True, index=True, default=lambda: str(uuid.uuid4())
    )
    user_id: Any = Column(String, ForeignKey("users.id"), nullable=False, index=True)
    token_hash: Any = Column(String, nullable=False, unique=True, index=True)
    device_name: Any = Column(String, nullable=True)
    ip_address: Any = Column(String, nullable=True)
    user_agent: Any = Column(String, nullable=True)
    expires_at: Any = Column(DateTime, nullable=False)
    revoked: Any = Column(Boolean, default=False)
    created_at: Any = Column(DateTime, default=datetime.utcnow)
    last_used_at: Any = Column(DateTime, nullable=True)

    user = relationship("User")


class EmailVerificationToken(Base):
    __tablename__ = "email_verification_tokens"

    id: Any = Column(
        String, primary_key=True, index=True, default=lambda: str(uuid.uuid4())
    )
    user_id: Any = Column(String, ForeignKey("users.id"), nullable=False, index=True)
    token_hash: Any = Column(String, nullable=False, unique=True, index=True)
    expires_at: Any = Column(DateTime, nullable=False)
    used: Any = Column(Boolean, default=False)
    created_at: Any = Column(DateTime, default=datetime.utcnow)

    user = relationship("User")


class PasswordChangeRequest(Base):
    __tablename__ = "password_change_requests"

    id: Any = Column(
        String, primary_key=True, index=True, default=lambda: str(uuid.uuid4())
    )
    user_id: Any = Column(String, ForeignKey("users.id"), nullable=False, index=True)
    otp_hash: Any = Column(String, nullable=False)
    new_password_hash: Any = Column(String, nullable=False)
    expires_at: Any = Column(DateTime, nullable=False)
    attempts: Any = Column(Integer, default=0)
    used: Any = Column(Boolean, default=False)
    created_at: Any = Column(DateTime, default=datetime.utcnow)

    user = relationship("User")


class AccountDeletionRequest(Base):
    __tablename__ = "account_deletion_requests"

    id: Any = Column(
        String, primary_key=True, index=True, default=lambda: str(uuid.uuid4())
    )
    user_id: Any = Column(String, ForeignKey("users.id"), nullable=False, index=True)
    otp_hash: Any = Column(String, nullable=False)
    expires_at: Any = Column(DateTime, nullable=False)
    attempts: Any = Column(Integer, default=0)
    otp_verified: Any = Column(Boolean, default=False)  # True after step 3 succeeds
    used: Any = Column(Boolean, default=False)
    created_at: Any = Column(DateTime, default=datetime.utcnow)

    user = relationship("User")


class ConnectedAccount(Base):
    __tablename__ = "connected_accounts"

    id: Any = Column(
        String, primary_key=True, index=True, default=lambda: str(uuid.uuid4())
    )
    user_id: Any = Column(String, ForeignKey("users.id"), nullable=False, index=True)
    provider: Any = Column(Enum(AuthProvider), nullable=False)
    provider_user_id: Any = Column(String, nullable=False, index=True)
    provider_email: Any = Column(String, nullable=True)
    connected_at: Any = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="connected_accounts")


# --- Career Profile Models ---


class Experience(Base):
    __tablename__ = "experiences"

    id: Any = Column(
        String, primary_key=True, index=True, default=lambda: str(uuid.uuid4())
    )
    user_id: Any = Column(String, ForeignKey("users.id"), nullable=False)
    company_name: Any = Column(String, nullable=False)
    company_logo_url: Any = Column(String, nullable=True)
    role: Any = Column(String, nullable=False)
    employment_type: Any = Column(String, nullable=True)
    location: Any = Column(String, nullable=True)
    department: Any = Column(String, nullable=True)
    work_model: Any = Column(String, nullable=True)
    start_date: Any = Column(DateTime, nullable=True)
    end_date: Any = Column(DateTime, nullable=True)
    is_current: Any = Column(Boolean, default=False)
    description: Any = Column(Text, nullable=True)
    achievements: Any = Column(Text, nullable=True)  # JSON or Text
    technologies: Any = Column(String, nullable=True)  # Comma separated
    manager_name: Any = Column(String, nullable=True)
    order: Any = Column(Integer, default=0)
    created_at: Any = Column(DateTime, default=datetime.utcnow)
    updated_at: Any = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    user = relationship("User")
    skills = relationship("Skill", secondary="experience_skills", back_populates="experiences")
    projects = relationship("Project", secondary="experience_projects", back_populates="experiences")




class Certification(Base):
    __tablename__ = "certifications"

    id: Any = Column(
        String, primary_key=True, index=True, default=lambda: str(uuid.uuid4())
    )
    user_id: Any = Column(String, ForeignKey("users.id"), nullable=False)
    name: Any = Column(String, nullable=False)
    issuer: Any = Column(String, nullable=False)
    credential_id: Any = Column(String, nullable=True)
    issue_date: Any = Column(DateTime, nullable=True)
    expiry_date: Any = Column(DateTime, nullable=True)
    does_not_expire: Any = Column(Boolean, default=False)
    verification_url: Any = Column(String, nullable=True)
    certificate_image_url: Any = Column(String, nullable=True)
    category: Any = Column(String, nullable=True)
    verification_status: Any = Column(String, default="unverified")
    created_at: Any = Column(DateTime, default=datetime.utcnow)
    updated_at: Any = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    user = relationship("User")


class Project(Base):
    __tablename__ = "projects"

    id: Any = Column(
        String, primary_key=True, index=True, default=lambda: str(uuid.uuid4())
    )
    user_id: Any = Column(String, ForeignKey("users.id"), nullable=False)
    name: Any = Column(String, nullable=False)
    short_description: Any = Column(String, nullable=True)
    description: Any = Column(Text, nullable=True)
    project_type: Any = Column(String, nullable=True)
    role: Any = Column(String, nullable=True)
    team_size: Any = Column(String, nullable=True)
    duration: Any = Column(String, nullable=True)
    duration_months: Any = Column(Integer, nullable=True)
    tech_stack: Any = Column(String, nullable=True)
    ai_technologies: Any = Column(String, nullable=True)
    github_url: Any = Column(String, nullable=True)
    live_demo_url: Any = Column(String, nullable=True)
    video_demo_url: Any = Column(String, nullable=True)
    images: Any = Column(Text, nullable=True)
    highlights: Any = Column(Text, nullable=True)
    challenges: Any = Column(Text, nullable=True)
    achievements: Any = Column(Text, nullable=True)
    status: Any = Column(String, default="Completed")
    is_featured: Any = Column(Boolean, default=False)
    created_at: Any = Column(DateTime, default=datetime.utcnow)
    updated_at: Any = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    user = relationship("User")
    skills = relationship("Skill", secondary="project_skills", back_populates="projects")
    experiences = relationship("Experience", secondary="experience_projects", back_populates="projects")


class CareerPreference(Base):
    __tablename__ = "career_preferences"

    id: Any = Column(
        String, primary_key=True, index=True, default=lambda: str(uuid.uuid4())
    )
    user_id: Any = Column(String, ForeignKey("users.id"), unique=True, nullable=False)
    # Role & Industry
    preferred_roles: Any = Column(String, nullable=True)
    preferred_industries: Any = Column(String, nullable=True)
    # Location
    preferred_locations: Any = Column(String, nullable=True)  # Legacy combined
    preferred_countries: Any = Column(String, nullable=True)  # CSV e.g. "India,USA"
    preferred_cities: Any = Column(String, nullable=True)     # CSV e.g. "Bangalore,Remote"
    # Work Setup
    work_setup: Any = Column(String, nullable=True)           # CSV: "Remote,Hybrid,Onsite"
    # Compensation
    expected_salary: Any = Column(String, nullable=True)
    preferred_currency: Any = Column(String, nullable=True)
    negotiable_salary: Any = Column(Boolean, default=False)
    expected_joining_bonus: Any = Column(String, nullable=True)
    # Company
    employment_types: Any = Column(String, nullable=True)     # CSV: "Full-Time,Contract"
    company_size: Any = Column(String, nullable=True)         # CSV: "1-50,51-200"
    startup_or_enterprise: Any = Column(String, nullable=True)  # "Startup","Enterprise","Any"
    # Mobility
    visa_sponsorship: Any = Column(Boolean, default=False)
    visa_status: Any = Column(String, nullable=True)
    willing_to_relocate: Any = Column(Boolean, default=False)
    relocation_countries: Any = Column(String, nullable=True)
    # Schedule & Travel
    travel_willingness: Any = Column(String, nullable=True)
    preferred_shift: Any = Column(String, nullable=True)
    preferred_time_zone: Any = Column(String, nullable=True)
    availability: Any = Column(String, nullable=True)
    updated_at: Any = Column(
        DateTime, default=datetime.utcnow, onupdate=datetime.utcnow
    )

    user = relationship("User")


class SocialProfile(Base):
    __tablename__ = "social_profiles"

    id: Any = Column(
        String, primary_key=True, index=True, default=lambda: str(uuid.uuid4())
    )
    user_id: Any = Column(String, ForeignKey("users.id"), unique=True, nullable=False)
    github_url: Any = Column(String, nullable=True)
    linkedin_url: Any = Column(String, nullable=True)
    portfolio_url: Any = Column(String, nullable=True)
    kaggle_url: Any = Column(String, nullable=True)
    leetcode_url: Any = Column(String, nullable=True)
    codeforces_url: Any = Column(String, nullable=True)
    hackerrank_url: Any = Column(String, nullable=True)
    medium_url: Any = Column(String, nullable=True)
    devto_url: Any = Column(String, nullable=True)
    youtube_url: Any = Column(String, nullable=True)
    twitter_url: Any = Column(String, nullable=True)
    updated_at: Any = Column(
        DateTime, default=datetime.utcnow, onupdate=datetime.utcnow
    )

    user = relationship("User")


class AIPreference(Base):
    __tablename__ = "ai_preferences"

    id: Any = Column(
        String, primary_key=True, index=True, default=lambda: str(uuid.uuid4())
    )
    user_id: Any = Column(String, ForeignKey("users.id"), unique=True, nullable=False)
    # Aspirations
    dream_companies: Any = Column(String, nullable=True)         # CSV chips
    dream_roles: Any = Column(String, nullable=True)             # CSV chips
    dream_technologies: Any = Column(String, nullable=True)      # CSV chips
    # AI & Learning
    preferred_ai_domains: Any = Column(String, nullable=True)    # CSV chips
    learning_goals: Any = Column(Text, nullable=True)
    preferred_learning_resources: Any = Column(String, nullable=True)  # CSV: "Coursera,YouTube"
    # Career Goals
    target_salary: Any = Column(String, nullable=True)
    target_country: Any = Column(String, nullable=True)          # Legacy single
    target_countries: Any = Column(String, nullable=True)        # CSV chips
    career_objectives: Any = Column(Text, nullable=True)
    career_growth_priorities: Any = Column(String, nullable=True)  # CSV chips
    # Meta
    interview_level: Any = Column(String, nullable=True)
    job_search_frequency: Any = Column(String, nullable=True)
    updated_at: Any = Column(
        DateTime, default=datetime.utcnow, onupdate=datetime.utcnow
    )

    user = relationship("User")


class Education(Base):
    __tablename__ = "education"

    id: Any = Column(
        String, primary_key=True, index=True, default=lambda: str(uuid.uuid4())
    )
    user_id: Any = Column(String, ForeignKey("users.id"), nullable=False)
    institution_name: Any = Column(String, nullable=False)
    institution_logo_url: Any = Column(String, nullable=True)
    degree: Any = Column(String, nullable=False)
    major: Any = Column(String, nullable=True)
    specialization: Any = Column(String, nullable=True)
    cgpa: Any = Column(String, nullable=True)
    grade: Any = Column(String, nullable=True)
    start_date: Any = Column(DateTime, nullable=True)
    end_date: Any = Column(DateTime, nullable=True)
    is_current: Any = Column(Boolean, default=False)
    activities: Any = Column(Text, nullable=True)
    honors_awards: Any = Column(Text, nullable=True)
    relevant_coursework: Any = Column(Text, nullable=True)
    certificate_url: Any = Column(String, nullable=True)
    verification_status: Any = Column(String, default="unverified")
    order: Any = Column(Integer, default=0)
    created_at: Any = Column(DateTime, default=datetime.utcnow)
    updated_at: Any = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    user = relationship("User", back_populates="education")


class Achievement(Base):
    __tablename__ = "achievements"

    id: Any = Column(
        String, primary_key=True, index=True, default=lambda: str(uuid.uuid4())
    )
    user_id: Any = Column(String, ForeignKey("users.id"), nullable=False)
    type: Any = Column(String, nullable=False)          # Award, Scholarship, Publication, etc.
    title: Any = Column(String, nullable=False)
    organization: Any = Column(String, nullable=True)   # Issuing org / event name
    date: Any = Column(Date, nullable=True)
    description: Any = Column(Text, nullable=True)
    url: Any = Column(String, nullable=True)             # Reference / proof link
    file_url: Any = Column(String, nullable=True)        # Supporting document
    file_name: Any = Column(String, nullable=True)
    order: Any = Column(Integer, default=0)
    created_at: Any = Column(DateTime, default=datetime.utcnow)
    updated_at: Any = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    user = relationship("User")


class JobSearchPreference(Base):
    __tablename__ = "job_search_preferences"

    id: Any = Column(
        String, primary_key=True, index=True, default=lambda: str(uuid.uuid4())
    )
    user_id: Any = Column(String, ForeignKey("users.id"), unique=True, nullable=False)
    search_frequency: Any = Column(String, default="Daily")          # Daily, Weekly, Instant, Manual
    email_notifications: Any = Column(Boolean, default=True)
    digest_frequency: Any = Column(String, default="Daily")           # Daily, Weekly, Never
    job_alert_keywords: Any = Column(String, nullable=True)          # CSV chips
    min_match_score: Any = Column(Integer, default=70)               # Percentage integer (0-100)
    preferred_sources: Any = Column(String, nullable=True)           # CSV chips (e.g. LinkedIn, Indeed, Glassdoor)
    ignore_companies: Any = Column(String, nullable=True)            # CSV chips
    ignore_keywords: Any = Column(String, nullable=True)             # CSV chips
    blocked_locations: Any = Column(String, nullable=True)           # CSV chips
    updated_at: Any = Column(
        DateTime, default=datetime.utcnow, onupdate=datetime.utcnow
    )

    user = relationship("User")

