"""
Profile Merge Engine — Phase 3 Module 6
Compares Career Profile (database) vs Parsed Resume (JSON).
Detects New Information, Updated Information, Conflicts, and Duplicates.
Generates Merge Suggestions for user review without modifying database records automatically.
"""

import json
import uuid
from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field
from sqlalchemy.orm import Session

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


class MergeSuggestionItem(BaseModel):
    id: str
    category: str  # "skills", "experience", "education", "projects", "certifications", "languages", "summary"
    status: str  # "NEW", "UPDATE", "CONFLICT", "DUPLICATE"
    title: str
    existing_value: Optional[Any] = None
    resume_value: Optional[Any] = None
    recommendation: str


class MergeSuggestionsResponse(BaseModel):
    resume_id: int
    total_suggestions: int
    new_count: int
    update_count: int
    conflict_count: int
    duplicate_count: int
    suggestions: List[MergeSuggestionItem] = Field(default_factory=list)


class ProfileMergeService:
    """Service comparing user profile data against parsed resume JSON to generate merge suggestions."""

    def __init__(self, db: Session):
        self.db = db

    def generate_merge_suggestions(self, user_id: str, resume_id: int) -> MergeSuggestionsResponse:
        """Compare profile vs parsed resume and generate merge suggestions without mutating DB."""
        resume = (
            self.db.query(Resume)
            .filter(Resume.id == resume_id, Resume.user_id == user_id)
            .first()
        )
        if not resume:
            raise Exception("Resume not found")

        target_text = resume.clean_text or resume.raw_text or ""
        from app.services.ai_resume_parser_service import AIResumeParserService

        if not resume.parsed_data_json:
            parsed = AIResumeParserService.parse_with_gemini(target_text)
            resume_data = parsed.model_dump()
            resume.parsed_data_json = parsed.model_dump_json()
            self.db.commit()
        else:
            try:
                resume_data = json.loads(resume.parsed_data_json)
            except Exception:
                resume_data = {}

        # Re-enrich projects or certifications if missing from stored JSON
        if (not resume_data.get("projects") or not resume_data.get("certifications")) and target_text:
            fresh_parsed = AIResumeParserService.parse_with_gemini(target_text)
            fresh_dict = fresh_parsed.model_dump()
            if not resume_data.get("projects") and fresh_dict.get("projects"):
                resume_data["projects"] = fresh_dict["projects"]
            if not resume_data.get("certifications") and fresh_dict.get("certifications"):
                resume_data["certifications"] = fresh_dict["certifications"]
            resume.parsed_data_json = json.dumps(resume_data)
            self.db.commit()

        # Fetch existing profile records from DB
        profile = self.db.query(UserProfile).filter(UserProfile.user_id == user_id).first()
        existing_skills = self.db.query(Skill).filter(Skill.user_id == user_id).all()
        existing_exp = self.db.query(Experience).filter(Experience.user_id == user_id).all()
        existing_edu = self.db.query(Education).filter(Education.user_id == user_id).all()
        existing_proj = self.db.query(Project).filter(Project.user_id == user_id).all()
        existing_certs = self.db.query(Certification).filter(Certification.user_id == user_id).all()
        existing_langs = self.db.query(Language).filter(Language.user_id == user_id).all()

        suggestions: List[MergeSuggestionItem] = []

        # ── 1. Skills Comparison ───────────────────────────────────────────
        profile_skill_names = {}
        for s in existing_skills:
            val = (getattr(s, "skill_name", None) or getattr(s, "name", None) or "").strip()
            if val:
                profile_skill_names[val.lower()] = val
        resume_skills = resume_data.get("skills", [])
        for sk in resume_skills:
            skill_name = (sk.get("name") if isinstance(sk, dict) else str(sk)).strip()
            if not skill_name:
                continue
            norm_name = skill_name.lower()
            if norm_name in profile_skill_names:
                suggestions.append(MergeSuggestionItem(
                    id=f"sk_{uuid.uuid4().hex[:6]}",
                    category="skills",
                    status="DUPLICATE",
                    title=f"Skill: {skill_name}",
                    existing_value=profile_skill_names[norm_name],
                    resume_value=skill_name,
                    recommendation="Skill already exists in your profile.",
                ))
            else:
                suggestions.append(MergeSuggestionItem(
                    id=f"sk_{uuid.uuid4().hex[:6]}",
                    category="skills",
                    status="NEW",
                    title=f"Skill: {skill_name}",
                    existing_value=None,
                    resume_value={"name": skill_name, "category": sk.get("category") if isinstance(sk, dict) else None},
                    recommendation="Add new skill to your profile.",
                ))

        # ── 2. Experience Comparison ──────────────────────────────────────
        exp_lookup = {}
        for e in existing_exp:
            r_title = (getattr(e, "role", None) or getattr(e, "job_title", None) or "").strip().lower()
            c_name = (getattr(e, "company_name", None) or getattr(e, "company", None) or "").strip().lower()
            if r_title or c_name:
                exp_lookup[f"{r_title}|{c_name}"] = e

        resume_exp = resume_data.get("work_experience", [])
        for exp in resume_exp:
            job_title = (exp.get("job_title") or exp.get("role") or "").strip()
            company = (exp.get("company") or exp.get("company_name") or "").strip()
            if not job_title and not company:
                continue

            key = f"{job_title.lower()}|{company.lower()}"
            if key in exp_lookup:
                existing_item = exp_lookup[key]
                e_title = getattr(existing_item, "role", None) or getattr(existing_item, "job_title", "")
                e_comp = getattr(existing_item, "company_name", None) or getattr(existing_item, "company", "")
                e_start = str(existing_item.start_date) if existing_item.start_date else ""
                e_end = str(existing_item.end_date) if existing_item.end_date else ""
                existing_dates = f"{e_start} - {e_end}"
                resume_dates = f"{exp.get('start_date') or ''} - {exp.get('end_date') or ''}"

                if existing_dates == resume_dates and (existing_item.description or "") == (exp.get("description") or ""):
                    suggestions.append(MergeSuggestionItem(
                        id=f"exp_{uuid.uuid4().hex[:6]}",
                        category="experience",
                        status="DUPLICATE",
                        title=f"{job_title} at {company}",
                        existing_value=f"{e_title} ({existing_dates})",
                        resume_value=f"{job_title} ({resume_dates})",
                        recommendation="Identical experience record found.",
                    ))
                elif existing_dates != resume_dates:
                    suggestions.append(MergeSuggestionItem(
                        id=f"exp_{uuid.uuid4().hex[:6]}",
                        category="experience",
                        status="CONFLICT",
                        title=f"{job_title} at {company}",
                        existing_value={"job_title": e_title, "company": e_comp, "dates": existing_dates},
                        resume_value={"job_title": job_title, "company": company, "dates": resume_dates},
                        recommendation="Date mismatch between profile and resume.",
                    ))
                else:
                    suggestions.append(MergeSuggestionItem(
                        id=f"exp_{uuid.uuid4().hex[:6]}",
                        category="experience",
                        status="UPDATE",
                        title=f"{job_title} at {company}",
                        existing_value={"job_title": e_title, "company": e_comp, "description": existing_item.description},
                        resume_value={"job_title": job_title, "company": company, "description": exp.get("description")},
                        recommendation="Updated description available from resume.",
                    ))
            else:
                suggestions.append(MergeSuggestionItem(
                    id=f"exp_{uuid.uuid4().hex[:6]}",
                    category="experience",
                    status="NEW",
                    title=f"{job_title} at {company}",
                    existing_value=None,
                    resume_value=exp,
                    recommendation="Add new work experience to your profile.",
                ))

        # ── 3. Education Comparison ───────────────────────────────────────
        edu_lookup = {
            f"{(e.degree or '').strip().lower()}|{(getattr(e, 'institution_name', None) or getattr(e, 'institution', None) or '').strip().lower()}": e
            for e in existing_edu
        }
        resume_edu = resume_data.get("education", [])
        for ed in resume_edu:
            degree = (ed.get("degree") or "").strip()
            institution = (ed.get("institution") or ed.get("institution_name") or "").strip()
            if not degree and not institution:
                continue

            key = f"{degree.lower()}|{institution.lower()}"
            if key in edu_lookup:
                existing_item = edu_lookup[key]
                inst_n = getattr(existing_item, "institution_name", None) or getattr(existing_item, "institution", "")
                suggestions.append(MergeSuggestionItem(
                    id=f"edu_{uuid.uuid4().hex[:6]}",
                    category="education",
                    status="DUPLICATE",
                    title=f"{degree} - {institution}",
                    existing_value=f"{existing_item.degree} at {inst_n}",
                    resume_value=f"{degree} at {institution}",
                    recommendation="Education record already exists.",
                ))
            else:
                suggestions.append(MergeSuggestionItem(
                    id=f"edu_{uuid.uuid4().hex[:6]}",
                    category="education",
                    status="NEW",
                    title=f"{degree} - {institution}",
                    existing_value=None,
                    resume_value=ed,
                    recommendation="Add new education entry to your profile.",
                ))

        # ── 4. Projects Comparison ────────────────────────────────────────
        proj_lookup = {
            (getattr(p, "name", None) or getattr(p, "title", None) or "").strip().lower(): p
            for p in existing_proj
        }
        resume_proj = resume_data.get("projects") or resume_data.get("project_list") or []
        for pr in resume_proj:
            title = (pr.get("title") or pr.get("name") or pr.get("project_name") or "").strip()
            if not title:
                continue
            if title.lower() in proj_lookup:
                suggestions.append(MergeSuggestionItem(
                    id=f"proj_{uuid.uuid4().hex[:6]}",
                    category="projects",
                    status="DUPLICATE",
                    title=f"Project: {title}",
                    existing_value=getattr(proj_lookup[title.lower()], "name", proj_lookup[title.lower()].id),
                    resume_value=title,
                    recommendation="Project already exists in profile.",
                ))
            else:
                suggestions.append(MergeSuggestionItem(
                    id=f"proj_{uuid.uuid4().hex[:6]}",
                    category="projects",
                    status="NEW",
                    title=f"Project: {title}",
                    existing_value=None,
                    resume_value=pr,
                    recommendation="Add new project to your profile.",
                ))

        # ── 5. Certifications Comparison ──────────────────────────────────
        cert_lookup = {
            (getattr(c, "name", None) or getattr(c, "title", None) or "").strip().lower(): c
            for c in existing_certs
        }
        resume_certs = resume_data.get("certifications") or resume_data.get("certs") or []
        for ct in resume_certs:
            name = (ct.get("name") or ct.get("title") or ct.get("certificate_name") or "").strip()
            if not name:
                continue
            if name.lower() in cert_lookup:
                suggestions.append(MergeSuggestionItem(
                    id=f"cert_{uuid.uuid4().hex[:6]}",
                    category="certifications",
                    status="DUPLICATE",
                    title=f"Certification: {name}",
                    existing_value=cert_lookup[name.lower()].name,
                    resume_value=name,
                    recommendation="Certification already exists in profile.",
                ))
            else:
                suggestions.append(MergeSuggestionItem(
                    id=f"cert_{uuid.uuid4().hex[:6]}",
                    category="certifications",
                    status="NEW",
                    title=f"Certification: {name}",
                    existing_value=None,
                    resume_value=ct,
                    recommendation="Add new certification to your profile.",
                ))

        # ── 6. Professional Summary Comparison ─────────────────────────────
        resume_summary = resume_data.get("professional_summary") or (resume_data.get("personal_info") or {}).get("summary")
        if resume_summary:
            existing_summary = profile.professional_summary if profile else None
            if not existing_summary:
                suggestions.append(MergeSuggestionItem(
                    id=f"sum_{uuid.uuid4().hex[:6]}",
                    category="summary",
                    status="NEW",
                    title="Professional Summary",
                    existing_value=None,
                    resume_value=resume_summary,
                    recommendation="Set initial professional summary from resume.",
                ))
            elif existing_summary.strip() == resume_summary.strip():
                suggestions.append(MergeSuggestionItem(
                    id=f"sum_{uuid.uuid4().hex[:6]}",
                    category="summary",
                    status="DUPLICATE",
                    title="Professional Summary",
                    existing_value=existing_summary,
                    resume_value=resume_summary,
                    recommendation="Summary matches current profile.",
                ))
            else:
                suggestions.append(MergeSuggestionItem(
                    id=f"sum_{uuid.uuid4().hex[:6]}",
                    category="summary",
                    status="CONFLICT",
                    title="Professional Summary",
                    existing_value=existing_summary,
                    resume_value=resume_summary,
                    recommendation="Resume contains a different professional summary.",
                ))

        # Counts
        new_count = sum(1 for s in suggestions if s.status == "NEW")
        update_count = sum(1 for s in suggestions if s.status == "UPDATE")
        conflict_count = sum(1 for s in suggestions if s.status == "CONFLICT")
        duplicate_count = sum(1 for s in suggestions if s.status == "DUPLICATE")

        return MergeSuggestionsResponse(
            resume_id=resume_id,
            total_suggestions=len(suggestions),
            new_count=new_count,
            update_count=update_count,
            conflict_count=conflict_count,
            duplicate_count=duplicate_count,
            suggestions=suggestions,
        )
