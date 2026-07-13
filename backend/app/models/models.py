from sqlalchemy import Boolean, Column, ForeignKey, Integer, String, Float, DateTime, Text, Enum
from sqlalchemy.orm import relationship
from app.database.database import Base
from datetime import datetime
import enum

class ApplicationStatus(str, enum.Enum):
    saved = "saved"
    applied = "applied"
    interview = "interview"
    rejected = "rejected"
    selected = "selected"

import uuid
from sqlalchemy.dialects.postgresql import UUID

class User(Base):
    __tablename__ = "users"

    id = Column(String, primary_key=True, index=True, default=lambda: str(uuid.uuid4()))
    first_name = Column(String, nullable=False)
    last_name = Column(String, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    password_hash = Column(String, nullable=False)
    is_verified = Column(Boolean, default=False)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    profile = relationship("UserProfile", back_populates="user", uselist=False)
    skills = relationship("Skill", back_populates="user")
    resumes = relationship("Resume", back_populates="user")
    saved_jobs = relationship("SavedJob", back_populates="user")
    applications = relationship("Application", back_populates="user")
    analytics = relationship("Analytics", back_populates="user", uselist=False)

class UserProfile(Base):
    __tablename__ = "user_profiles"

    id = Column(String, primary_key=True, index=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String, ForeignKey("users.id"), unique=True, nullable=False)
    
    current_job_title = Column(String, nullable=True)
    preferred_role = Column(String, nullable=True)
    years_of_experience = Column(String, nullable=True)
    highest_education = Column(String, nullable=True)
    current_company = Column(String, nullable=True)
    
    preferred_locations = Column(String, nullable=True) # Comma separated
    work_preference = Column(String, nullable=True) # Remote, Hybrid, On-site
    
    expected_salary = Column(String, nullable=True)
    preferred_companies = Column(String, nullable=True) # Comma separated
    notice_period = Column(String, nullable=True)
    open_to_relocation = Column(Boolean, default=False)
    job_type = Column(String, nullable=True) # Full Time, Internship, Contract

    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    user = relationship("User", back_populates="profile")

class Skill(Base):
    __tablename__ = "skills"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(String, ForeignKey("users.id"))
    skill_name = Column(String, index=True)

    user = relationship("User", back_populates="skills")

class Resume(Base):
    __tablename__ = "resumes"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(String, ForeignKey("users.id"))
    file_url = Column(String)
    resume_score = Column(Float, nullable=True)
    ats_score = Column(Float, nullable=True)
    uploaded_at = Column(DateTime, default=datetime.utcnow)

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
