import enum
from datetime import datetime
from typing import Any

from sqlalchemy import Column, DateTime, Enum, Float, ForeignKey, Integer, String, Text
from sqlalchemy.orm import relationship

from src.database.database import Base


class ApplicationStatus(str, enum.Enum):
    saved = "saved"
    applied = "applied"
    interview = "interview"
    rejected = "rejected"
    selected = "selected"


class User(Base):
    __tablename__ = "users"

    id: Any = Column(Integer, primary_key=True, index=True)
    full_name: Any = Column(String, index=True)
    email: Any = Column(String, unique=True, index=True)
    password_hash: Any = Column(String)
    preferred_role: Any = Column(String, nullable=True)
    experience: Any = Column(String, nullable=True)
    education: Any = Column(String, nullable=True)
    work_preference: Any = Column(String, nullable=True)
    created_at: Any = Column(DateTime, default=datetime.utcnow)

    skills = relationship("Skill", back_populates="user")
    resumes = relationship("Resume", back_populates="user")
    saved_jobs = relationship("SavedJob", back_populates="user")
    applications = relationship("Application", back_populates="user")
    analytics = relationship("Analytics", back_populates="user", uselist=False)


class Skill(Base):
    __tablename__ = "skills"

    id: Any = Column(Integer, primary_key=True, index=True)
    user_id: Any = Column(Integer, ForeignKey("users.id"))
    skill_name: Any = Column(String, index=True)

    user = relationship("User", back_populates="skills")


class Resume(Base):
    __tablename__ = "resumes"

    id: Any = Column(Integer, primary_key=True, index=True)
    user_id: Any = Column(Integer, ForeignKey("users.id"))
    file_url: Any = Column(String)
    resume_score: Any = Column(Float, nullable=True)
    ats_score: Any = Column(Float, nullable=True)
    uploaded_at: Any = Column(DateTime, default=datetime.utcnow)

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
    user_id: Any = Column(Integer, ForeignKey("users.id"))
    job_id: Any = Column(Integer, ForeignKey("jobs.id"))
    created_at: Any = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="saved_jobs")
    job = relationship("Job", back_populates="saved_by")


class Application(Base):
    __tablename__ = "applications"

    id: Any = Column(Integer, primary_key=True, index=True)
    user_id: Any = Column(Integer, ForeignKey("users.id"))
    job_id: Any = Column(Integer, ForeignKey("jobs.id"))
    status: Any = Column(Enum(ApplicationStatus), default=ApplicationStatus.applied)
    applied_at: Any = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="applications")
    job = relationship("Job", back_populates="applications")


class Analytics(Base):
    __tablename__ = "analytics"

    id: Any = Column(Integer, primary_key=True, index=True)
    user_id: Any = Column(Integer, ForeignKey("users.id"), unique=True)
    jobs_found: Any = Column(Integer, default=0)
    matched_jobs: Any = Column(Integer, default=0)
    applications_sent: Any = Column(Integer, default=0)
    created_at: Any = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="analytics")
