"""
Resume Review & Approval Engine — Phase 3 Module 7
Performs transactional approval and merge of reviewed parsed resume data into user's Career Profile.
Ensures zero automatic data updates and guarantees atomic rollback on error.
"""

from typing import List, Dict, Any, Optional
from datetime import datetime
from pydantic import BaseModel, Field
from sqlalchemy.orm import Session
from fastapi import HTTPException

from app.models.models import (
    Resume,
    UserProfile,
    Skill,
    Experience,
    Education,
    Project,
    Certification,
    Language,
)


class MergeApprovedItem(BaseModel):
    category: str  # "personal_info", "summary", "skills", "experience", "education", "projects", "certifications", "languages"
    action: str    # "accept", "edit"
    value: Dict[str, Any]


class ApproveMergeRequest(BaseModel):
    resume_id: int
    items: List[MergeApprovedItem] = Field(default_factory=list)


class ProfileApprovalService:
    """Handles transactional approval and atomic insertion of reviewed resume data into user profile."""

    def __init__(self, db: Session):
        self.db = db

    def apply_approved_merge(self, user_id: str, request: ApproveMergeRequest) -> Dict[str, Any]:
        """Apply approved merge items into user profile inside an atomic transaction block."""
        resume = (
            self.db.query(Resume)
            .filter(Resume.id == request.resume_id, Resume.user_id == user_id)
            .first()
        )
        if not resume:
            raise HTTPException(status_code=404, detail="Resume not found")

        merged_count = 0

        # Atomic Transaction Block
        try:
            profile = self.db.query(UserProfile).filter(UserProfile.user_id == user_id).first()
            if not profile:
                profile = UserProfile(user_id=user_id)
                self.db.add(profile)
                self.db.flush()

            for item in request.items:
                cat = item.category.lower()
                val = item.value or {}

                if cat in ("personal_info", "summary"):
                    if "summary" in val and val["summary"]:
                        profile.professional_summary = val["summary"]
                    if "phone" in val and val["phone"]:
                        profile.phone_number = val["phone"]
                    if "title" in val and val["title"]:
                        profile.headline = val["title"]
                    if "bio" in val and val["bio"]:
                        profile.bio = val["bio"]
                    merged_count += 1

                elif cat == "skills":
                    skill_name = (val.get("name") or val.get("skill_name") or "").strip()
                    if skill_name:
                        # Check duplicate
                        existing = (
                            self.db.query(Skill)
                            .filter(Skill.user_id == user_id, Skill.skill_name.ilike(skill_name))
                            .first()
                        )
                        if not existing:
                            new_sk = Skill(
                                user_id=user_id,
                                skill_name=skill_name,
                                category=val.get("category"),
                                level=val.get("proficiency_level") or val.get("level") or "Intermediate",
                            )
                            self.db.add(new_sk)
                            merged_count += 1

                elif cat == "experience":
                    job_title = (val.get("job_title") or val.get("role") or "").strip()
                    company = (val.get("company") or val.get("company_name") or "").strip()
                    if job_title or company:
                        new_exp = Experience(
                            user_id=user_id,
                            role=job_title or "Role",
                            company_name=company or "Company",
                            location=val.get("location"),
                            description=val.get("description"),
                            is_current=bool(val.get("is_current", False)),
                        )
                        self.db.add(new_exp)
                        merged_count += 1

                elif cat == "education":
                    degree = (val.get("degree") or "").strip()
                    institution = (val.get("institution") or val.get("institution_name") or "").strip()
                    if degree or institution:
                        new_edu = Education(
                            user_id=user_id,
                            degree=degree or "Degree",
                            institution_name=institution or "Institution",
                            major=val.get("field_of_study") or val.get("major"),
                            cgpa=val.get("gpa") or val.get("cgpa"),
                        )
                        self.db.add(new_edu)
                        merged_count += 1

                elif cat == "projects":
                    title = (val.get("title") or val.get("name") or "").strip()
                    if title:
                        tech = val.get("technologies")
                        tech_str = ", ".join(tech) if isinstance(tech, list) else (tech or "")
                        new_proj = Project(
                            user_id=user_id,
                            name=title,
                            description=val.get("description"),
                            tech_stack=tech_str,
                            github_url=val.get("repo_url") or val.get("github_url"),
                            live_demo_url=val.get("project_url") or val.get("live_demo_url"),
                        )
                        self.db.add(new_proj)
                        merged_count += 1

                elif cat == "certifications":
                    name = (val.get("name") or "").strip()
                    if name:
                        new_cert = Certification(
                            user_id=user_id,
                            name=name,
                            issuer=val.get("issuing_organization") or val.get("issuer") or "Organization",
                            credential_id=val.get("credential_id"),
                        )
                        self.db.add(new_cert)
                        merged_count += 1

                elif cat == "languages":
                    lang_name = (val.get("language") or val.get("name") or "").strip()
                    if lang_name and profile and profile.id:
                        existing = (
                            self.db.query(Language)
                            .filter(Language.user_id == user_id, Language.name.ilike(lang_name))
                            .first()
                        )
                        if not existing:
                            new_lang = Language(
                                user_id=user_id,
                                profile_id=profile.id,
                                name=lang_name,
                                proficiency=val.get("proficiency") or "Professional",
                            )
                            self.db.add(new_lang)
                            merged_count += 1

            self.db.commit()
            return {
                "status": "success",
                "resume_id": request.resume_id,
                "merged_count": merged_count,
                "message": f"Successfully merged {merged_count} approved items into your Career Profile!",
            }

        except Exception as err:
            self.db.rollback()
            raise HTTPException(
                status_code=500,
                detail=f"Transaction Failed. Rollback executed cleanly. Error: {str(err)}",
            )
