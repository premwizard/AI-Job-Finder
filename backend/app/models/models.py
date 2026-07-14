import enum
import uuid
from datetime import datetime

from sqlalchemy import (Boolean, Column, DateTime, Enum, Float, ForeignKey,
                        Integer, String, Text)
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

    id = Column(String, primary_key=True, index=True, default=lambda: str(uuid.uuid4()))
    first_name = Column(String, nullable=False)
    last_name = Column(String, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    password_hash = Column(String, nullable=True)
    is_verified = Column(Boolean, default=False)
    auth_provider = Column(Enum(AuthProvider), default=AuthProvider.email)
    is_active = Column(Boolean, default=True)
    is_deleted = Column(Boolean, default=False)
    deleted_at = Column(DateTime, nullable=True)
    verified_at = Column(DateTime, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    profile = relationship("UserProfile", back_populates="user", uselist=False)
    skills = relationship("Skill", back_populates="user")
    resumes = relationship("Resume", back_populates="user")
    saved_jobs = relationship("SavedJob", back_populates="user")
    applications = relationship("Application", back_populates="user")
    analytics = relationship("Analytics", back_populates="user", uselist=False)
    connected_accounts = relationship("ConnectedAccount", back_populates="user")


class UserProfile(Base):
    __tablename__ = "user_profiles"

    id = Column(String, primary_key=True, index=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String, ForeignKey("users.id"), unique=True, nullable=False)

    # Personal Information
    profile_picture_url = Column(String, nullable=True)
    cover_banner_url = Column(String, nullable=True)
    headline = Column(String, nullable=True)
    bio = Column(Text, nullable=True)
    phone_number = Column(String, nullable=True)
    country = Column(String, nullable=True)
    state = Column(String, nullable=True)
    city = Column(String, nullable=True)
    time_zone = Column(String, nullable=True)
    languages = Column(String, nullable=True)  # Comma separated

    # Professional Summary
    current_job_title = Column(String, nullable=True)
    current_company = Column(String, nullable=True)
    employment_status = Column(String, nullable=True)
    years_of_experience = Column(String, nullable=True)
    industry = Column(String, nullable=True)
    career_level = Column(String, nullable=True)
    expected_salary = Column(String, nullable=True)
    preferred_currency = Column(String, nullable=True)
    notice_period = Column(String, nullable=True)
    professional_summary = Column(Text, nullable=True)

    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    user = relationship("User", back_populates="profile")


class Skill(Base):
    __tablename__ = "skills"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(String, ForeignKey("users.id"))
    skill_name = Column(String, index=True)
    category = Column(String, nullable=True)
    level = Column(String, nullable=True)  # Beginner, Intermediate, Expert
    years_of_experience = Column(Integer, nullable=True)

    user = relationship("User", back_populates="skills")


class Resume(Base):
    __tablename__ = "resumes"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(String, ForeignKey("users.id"))
    file_url = Column(String)
    file_name = Column(String, nullable=True)
    file_size = Column(Integer, nullable=True)  # in bytes
    version = Column(Integer, default=1)

    # Metadata and Parsing
    resume_score = Column(Float, nullable=True)
    ats_score = Column(Float, nullable=True)
    parsing_status = Column(String, default="pending")  # pending, completed, failed
    ai_summary = Column(Text, nullable=True)

    uploaded_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    user = relationship("User", back_populates="resumes")


class Job(Base):
    __tablename__ = "jobs"

    id = Column(Integer, primary_key=True, index=True)
    job_hash = Column(String, unique=True, index=True, nullable=True)  # To deduplicate
    company_name = Column(String, index=True)
    job_title = Column(String, index=True)
    location = Column(String)
    salary = Column(String, nullable=True)
    description = Column(Text, nullable=True)
    source = Column(String)
    job_url = Column(String)
    created_at = Column(DateTime, default=datetime.utcnow)

    saved_by = relationship("SavedJob", back_populates="job")
    applications = relationship("Application", back_populates="job")


class SavedJob(Base):
    __tablename__ = "saved_jobs"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(String, ForeignKey("users.id"))
    job_id = Column(Integer, ForeignKey("jobs.id"))
    created_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="saved_jobs")
    job = relationship("Job", back_populates="saved_by")


class Application(Base):
    __tablename__ = "applications"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(String, ForeignKey("users.id"))
    job_id = Column(Integer, ForeignKey("jobs.id"))
    status = Column(Enum(ApplicationStatus), default=ApplicationStatus.applied)
    applied_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="applications")
    job = relationship("Job", back_populates="applications")


class Analytics(Base):
    __tablename__ = "analytics"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(String, ForeignKey("users.id"), unique=True)
    jobs_found = Column(Integer, default=0)
    matched_jobs = Column(Integer, default=0)
    applications_sent = Column(Integer, default=0)
    created_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="analytics")


class PasswordResetToken(Base):
    __tablename__ = "password_reset_tokens"

    id = Column(String, primary_key=True, index=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String, ForeignKey("users.id"), nullable=False, index=True)
    token_hash = Column(String, nullable=False, unique=True, index=True)
    otp_hash = Column(String, nullable=False)
    expires_at = Column(DateTime, nullable=False)
    attempts = Column(Integer, default=0)
    used = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User")


class RefreshToken(Base):
    __tablename__ = "refresh_tokens"

    id = Column(String, primary_key=True, index=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String, ForeignKey("users.id"), nullable=False, index=True)
    token_hash = Column(String, nullable=False, unique=True, index=True)
    device_name = Column(String, nullable=True)
    ip_address = Column(String, nullable=True)
    user_agent = Column(String, nullable=True)
    expires_at = Column(DateTime, nullable=False)
    revoked = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    last_used_at = Column(DateTime, nullable=True)

    user = relationship("User")


class EmailVerificationToken(Base):
    __tablename__ = "email_verification_tokens"

    id = Column(String, primary_key=True, index=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String, ForeignKey("users.id"), nullable=False, index=True)
    token_hash = Column(String, nullable=False, unique=True, index=True)
    expires_at = Column(DateTime, nullable=False)
    used = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User")


class PasswordChangeRequest(Base):
    __tablename__ = "password_change_requests"

    id = Column(String, primary_key=True, index=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String, ForeignKey("users.id"), nullable=False, index=True)
    otp_hash = Column(String, nullable=False)
    new_password_hash = Column(String, nullable=False)
    expires_at = Column(DateTime, nullable=False)
    attempts = Column(Integer, default=0)
    used = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User")


class AccountDeletionRequest(Base):
    __tablename__ = "account_deletion_requests"

    id = Column(String, primary_key=True, index=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String, ForeignKey("users.id"), nullable=False, index=True)
    otp_hash = Column(String, nullable=False)
    expires_at = Column(DateTime, nullable=False)
    attempts = Column(Integer, default=0)
    otp_verified = Column(Boolean, default=False)  # True after step 3 succeeds
    used = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User")


class ConnectedAccount(Base):
    __tablename__ = "connected_accounts"

    id = Column(String, primary_key=True, index=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String, ForeignKey("users.id"), nullable=False, index=True)
    provider = Column(Enum(AuthProvider), nullable=False)
    provider_user_id = Column(String, nullable=False, index=True)
    provider_email = Column(String, nullable=True)
    connected_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="connected_accounts")


# --- Career Profile Models ---


class Experience(Base):
    __tablename__ = "experiences"

    id = Column(String, primary_key=True, index=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String, ForeignKey("users.id"), nullable=False)
    company_name = Column(String, nullable=False)
    company_logo_url = Column(String, nullable=True)
    role = Column(String, nullable=False)
    employment_type = Column(String, nullable=True)
    location = Column(String, nullable=True)
    start_date = Column(DateTime, nullable=True)
    end_date = Column(DateTime, nullable=True)
    is_current = Column(Boolean, default=False)
    description = Column(Text, nullable=True)
    achievements = Column(Text, nullable=True)  # JSON or Text
    technologies = Column(String, nullable=True)  # Comma separated
    created_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User")


class Education(Base):
    __tablename__ = "educations"

    id = Column(String, primary_key=True, index=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String, ForeignKey("users.id"), nullable=False)
    institution = Column(String, nullable=False)
    degree = Column(String, nullable=False)
    major = Column(String, nullable=True)
    specialization = Column(String, nullable=True)
    cgpa = Column(String, nullable=True)
    start_date = Column(DateTime, nullable=True)
    end_date = Column(DateTime, nullable=True)
    activities = Column(Text, nullable=True)
    achievements = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User")


class Certification(Base):
    __tablename__ = "certifications"

    id = Column(String, primary_key=True, index=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String, ForeignKey("users.id"), nullable=False)
    name = Column(String, nullable=False)
    issuer = Column(String, nullable=False)
    credential_id = Column(String, nullable=True)
    issue_date = Column(DateTime, nullable=True)
    expiry_date = Column(DateTime, nullable=True)
    verification_url = Column(String, nullable=True)
    certificate_image_url = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User")


class Project(Base):
    __tablename__ = "projects"

    id = Column(String, primary_key=True, index=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String, ForeignKey("users.id"), nullable=False)
    name = Column(String, nullable=False)
    description = Column(Text, nullable=True)
    project_type = Column(String, nullable=True)
    role = Column(String, nullable=True)
    team_size = Column(Integer, nullable=True)
    duration_months = Column(Integer, nullable=True)
    tech_stack = Column(String, nullable=True)
    ai_technologies = Column(String, nullable=True)
    github_url = Column(String, nullable=True)
    live_demo_url = Column(String, nullable=True)
    video_demo_url = Column(String, nullable=True)
    highlights = Column(Text, nullable=True)
    challenges = Column(Text, nullable=True)
    achievements = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User")


class CareerPreference(Base):
    __tablename__ = "career_preferences"

    id = Column(String, primary_key=True, index=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String, ForeignKey("users.id"), unique=True, nullable=False)
    preferred_roles = Column(String, nullable=True)
    preferred_industries = Column(String, nullable=True)
    preferred_locations = Column(String, nullable=True)
    work_setup = Column(
        String, nullable=True
    )  # Remote, Hybrid, Onsite (comma separated)
    expected_salary = Column(String, nullable=True)
    preferred_currency = Column(String, nullable=True)
    employment_types = Column(String, nullable=True)
    company_size = Column(String, nullable=True)
    visa_sponsorship = Column(Boolean, default=False)
    willing_to_relocate = Column(Boolean, default=False)
    travel_willingness = Column(String, nullable=True)
    preferred_shift = Column(String, nullable=True)
    availability = Column(String, nullable=True)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    user = relationship("User")


class SocialProfile(Base):
    __tablename__ = "social_profiles"

    id = Column(String, primary_key=True, index=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String, ForeignKey("users.id"), unique=True, nullable=False)
    github_url = Column(String, nullable=True)
    linkedin_url = Column(String, nullable=True)
    portfolio_url = Column(String, nullable=True)
    kaggle_url = Column(String, nullable=True)
    leetcode_url = Column(String, nullable=True)
    codeforces_url = Column(String, nullable=True)
    hackerrank_url = Column(String, nullable=True)
    medium_url = Column(String, nullable=True)
    devto_url = Column(String, nullable=True)
    youtube_url = Column(String, nullable=True)
    twitter_url = Column(String, nullable=True)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    user = relationship("User")


class AIPreference(Base):
    __tablename__ = "ai_preferences"

    id = Column(String, primary_key=True, index=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String, ForeignKey("users.id"), unique=True, nullable=False)
    dream_companies = Column(String, nullable=True)
    dream_roles = Column(String, nullable=True)
    dream_technologies = Column(String, nullable=True)
    preferred_ai_domains = Column(String, nullable=True)
    learning_goals = Column(Text, nullable=True)
    interview_level = Column(String, nullable=True)
    target_salary = Column(String, nullable=True)
    target_country = Column(String, nullable=True)
    career_objectives = Column(Text, nullable=True)
    job_search_frequency = Column(String, nullable=True)
    career_growth_priorities = Column(String, nullable=True)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    user = relationship("User")
