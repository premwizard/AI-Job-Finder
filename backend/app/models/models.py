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
)
from sqlalchemy.orm import relationship

from app.database.database import Base


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

    id: Any = Column(String, primary_key=True, index=True, default=lambda: str(uuid.uuid4()))
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
    updated_at: Any = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    profile = relationship("UserProfile", back_populates="user", uselist=False)
    skills = relationship("Skill", back_populates="user")
    resumes = relationship("Resume", back_populates="user")
    saved_jobs = relationship("SavedJob", back_populates="user")
    applications = relationship("Application", back_populates="user")
    analytics = relationship("Analytics", back_populates="user", uselist=False)
    connected_accounts = relationship("ConnectedAccount", back_populates="user")


class UserProfile(Base):
    __tablename__ = "user_profiles"

    id: Any = Column(String, primary_key=True, index=True, default=lambda: str(uuid.uuid4()))
    user_id: Any = Column(String, ForeignKey("users.id"), unique=True, nullable=False)

    # Personal Information
    profile_picture_url: Any = Column(String, nullable=True)
    cover_banner_url: Any = Column(String, nullable=True)
    headline: Any = Column(String, nullable=True)
    bio: Any = Column(Text, nullable=True)
    phone_number: Any = Column(String, nullable=True)
    country: Any = Column(String, nullable=True)
    state: Any = Column(String, nullable=True)
    city: Any = Column(String, nullable=True)
    time_zone: Any = Column(String, nullable=True)
    languages: Any = Column(String, nullable=True)  # Comma separated

    # Professional Summary
    current_job_title: Any = Column(String, nullable=True)
    current_company: Any = Column(String, nullable=True)
    employment_status: Any = Column(String, nullable=True)
    years_of_experience: Any = Column(String, nullable=True)
    industry: Any = Column(String, nullable=True)
    career_level: Any = Column(String, nullable=True)
    expected_salary: Any = Column(String, nullable=True)
    preferred_currency: Any = Column(String, nullable=True)
    notice_period: Any = Column(String, nullable=True)
    professional_summary: Any = Column(Text, nullable=True)

    created_at: Any = Column(DateTime, default=datetime.utcnow)
    updated_at: Any = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    user = relationship("User", back_populates="profile")


class Skill(Base):
    __tablename__ = "skills"

    id: Any = Column(Integer, primary_key=True, index=True)
    user_id: Any = Column(String, ForeignKey("users.id"))
    skill_name: Any = Column(String, index=True)
    category: Any = Column(String, nullable=True)
    level: Any = Column(String, nullable=True)  # Beginner, Intermediate, Expert
    years_of_experience: Any = Column(Integer, nullable=True)

    user = relationship("User", back_populates="skills")


class Resume(Base):
    __tablename__ = "resumes"

    id: Any = Column(Integer, primary_key=True, index=True)
    user_id: Any = Column(String, ForeignKey("users.id"))
    file_url: Any = Column(String)
    file_name: Any = Column(String, nullable=True)
    file_size: Any = Column(Integer, nullable=True)  # in bytes
    version: Any = Column(Integer, default=1)

    # Metadata and Parsing
    resume_score: Any = Column(Float, nullable=True)
    ats_score: Any = Column(Float, nullable=True)
    parsing_status: Any = Column(String, default="pending")  # pending, completed, failed
    ai_summary: Any = Column(Text, nullable=True)

    uploaded_at: Any = Column(DateTime, default=datetime.utcnow)
    updated_at: Any = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    user = relationship("User", back_populates="resumes")


class Job(Base):
    __tablename__ = "jobs"

    id: Any = Column(Integer, primary_key=True, index=True)
    job_hash: Any = Column(String, unique=True, index=True, nullable=True)  # To deduplicate
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

    id: Any = Column(String, primary_key=True, index=True, default=lambda: str(uuid.uuid4()))
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

    id: Any = Column(String, primary_key=True, index=True, default=lambda: str(uuid.uuid4()))
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

    id: Any = Column(String, primary_key=True, index=True, default=lambda: str(uuid.uuid4()))
    user_id: Any = Column(String, ForeignKey("users.id"), nullable=False, index=True)
    token_hash: Any = Column(String, nullable=False, unique=True, index=True)
    expires_at: Any = Column(DateTime, nullable=False)
    used: Any = Column(Boolean, default=False)
    created_at: Any = Column(DateTime, default=datetime.utcnow)

    user = relationship("User")


class PasswordChangeRequest(Base):
    __tablename__ = "password_change_requests"

    id: Any = Column(String, primary_key=True, index=True, default=lambda: str(uuid.uuid4()))
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

    id: Any = Column(String, primary_key=True, index=True, default=lambda: str(uuid.uuid4()))
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

    id: Any = Column(String, primary_key=True, index=True, default=lambda: str(uuid.uuid4()))
    user_id: Any = Column(String, ForeignKey("users.id"), nullable=False, index=True)
    provider: Any = Column(Enum(AuthProvider), nullable=False)
    provider_user_id: Any = Column(String, nullable=False, index=True)
    provider_email: Any = Column(String, nullable=True)
    connected_at: Any = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="connected_accounts")


# --- Career Profile Models ---


class Experience(Base):
    __tablename__ = "experiences"

    id: Any = Column(String, primary_key=True, index=True, default=lambda: str(uuid.uuid4()))
    user_id: Any = Column(String, ForeignKey("users.id"), nullable=False)
    company_name: Any = Column(String, nullable=False)
    company_logo_url: Any = Column(String, nullable=True)
    role: Any = Column(String, nullable=False)
    employment_type: Any = Column(String, nullable=True)
    location: Any = Column(String, nullable=True)
    start_date: Any = Column(DateTime, nullable=True)
    end_date: Any = Column(DateTime, nullable=True)
    is_current: Any = Column(Boolean, default=False)
    description: Any = Column(Text, nullable=True)
    achievements: Any = Column(Text, nullable=True)  # JSON or Text
    technologies: Any = Column(String, nullable=True)  # Comma separated
    created_at: Any = Column(DateTime, default=datetime.utcnow)

    user = relationship("User")


class Education(Base):
    __tablename__ = "educations"

    id: Any = Column(String, primary_key=True, index=True, default=lambda: str(uuid.uuid4()))
    user_id: Any = Column(String, ForeignKey("users.id"), nullable=False)
    institution: Any = Column(String, nullable=False)
    degree: Any = Column(String, nullable=False)
    major: Any = Column(String, nullable=True)
    specialization: Any = Column(String, nullable=True)
    cgpa: Any = Column(String, nullable=True)
    start_date: Any = Column(DateTime, nullable=True)
    end_date: Any = Column(DateTime, nullable=True)
    activities: Any = Column(Text, nullable=True)
    achievements: Any = Column(Text, nullable=True)
    created_at: Any = Column(DateTime, default=datetime.utcnow)

    user = relationship("User")


class Certification(Base):
    __tablename__ = "certifications"

    id: Any = Column(String, primary_key=True, index=True, default=lambda: str(uuid.uuid4()))
    user_id: Any = Column(String, ForeignKey("users.id"), nullable=False)
    name: Any = Column(String, nullable=False)
    issuer: Any = Column(String, nullable=False)
    credential_id: Any = Column(String, nullable=True)
    issue_date: Any = Column(DateTime, nullable=True)
    expiry_date: Any = Column(DateTime, nullable=True)
    verification_url: Any = Column(String, nullable=True)
    certificate_image_url: Any = Column(String, nullable=True)
    created_at: Any = Column(DateTime, default=datetime.utcnow)

    user = relationship("User")


class Project(Base):
    __tablename__ = "projects"

    id: Any = Column(String, primary_key=True, index=True, default=lambda: str(uuid.uuid4()))
    user_id: Any = Column(String, ForeignKey("users.id"), nullable=False)
    name: Any = Column(String, nullable=False)
    description: Any = Column(Text, nullable=True)
    project_type: Any = Column(String, nullable=True)
    role: Any = Column(String, nullable=True)
    team_size: Any = Column(Integer, nullable=True)
    duration_months: Any = Column(Integer, nullable=True)
    tech_stack: Any = Column(String, nullable=True)
    ai_technologies: Any = Column(String, nullable=True)
    github_url: Any = Column(String, nullable=True)
    live_demo_url: Any = Column(String, nullable=True)
    video_demo_url: Any = Column(String, nullable=True)
    highlights: Any = Column(Text, nullable=True)
    challenges: Any = Column(Text, nullable=True)
    achievements: Any = Column(Text, nullable=True)
    created_at: Any = Column(DateTime, default=datetime.utcnow)

    user = relationship("User")


class CareerPreference(Base):
    __tablename__ = "career_preferences"

    id: Any = Column(String, primary_key=True, index=True, default=lambda: str(uuid.uuid4()))
    user_id: Any = Column(String, ForeignKey("users.id"), unique=True, nullable=False)
    preferred_roles: Any = Column(String, nullable=True)
    preferred_industries: Any = Column(String, nullable=True)
    preferred_locations: Any = Column(String, nullable=True)
    work_setup: Any = Column(
        String, nullable=True
    )  # Remote, Hybrid, Onsite (comma separated)
    expected_salary: Any = Column(String, nullable=True)
    preferred_currency: Any = Column(String, nullable=True)
    employment_types: Any = Column(String, nullable=True)
    company_size: Any = Column(String, nullable=True)
    visa_sponsorship: Any = Column(Boolean, default=False)
    willing_to_relocate: Any = Column(Boolean, default=False)
    travel_willingness: Any = Column(String, nullable=True)
    preferred_shift: Any = Column(String, nullable=True)
    availability: Any = Column(String, nullable=True)
    updated_at: Any = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    user = relationship("User")


class SocialProfile(Base):
    __tablename__ = "social_profiles"

    id: Any = Column(String, primary_key=True, index=True, default=lambda: str(uuid.uuid4()))
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
    updated_at: Any = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    user = relationship("User")


class AIPreference(Base):
    __tablename__ = "ai_preferences"

    id: Any = Column(String, primary_key=True, index=True, default=lambda: str(uuid.uuid4()))
    user_id: Any = Column(String, ForeignKey("users.id"), unique=True, nullable=False)
    dream_companies: Any = Column(String, nullable=True)
    dream_roles: Any = Column(String, nullable=True)
    dream_technologies: Any = Column(String, nullable=True)
    preferred_ai_domains: Any = Column(String, nullable=True)
    learning_goals: Any = Column(Text, nullable=True)
    interview_level: Any = Column(String, nullable=True)
    target_salary: Any = Column(String, nullable=True)
    target_country: Any = Column(String, nullable=True)
    career_objectives: Any = Column(Text, nullable=True)
    job_search_frequency: Any = Column(String, nullable=True)
    career_growth_priorities: Any = Column(String, nullable=True)
    updated_at: Any = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    user = relationship("User")
