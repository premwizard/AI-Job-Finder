"""
AI Resume Parser Engine — Phase 3 Module 5
Uses Gemini Flash to parse clean resume text into strongly typed structured JSON.
Includes hallucination protection, Pydantic schema validation, retry handling,
and isolated storage in Resume.parsed_data_json (does not mutate user profile tables directly).
"""

import os
import re
import json
from datetime import datetime
from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field
from sqlalchemy.orm import Session

# Import google.generativeai with fallback
try:
    import google.generativeai as genai
    GENAI_AVAILABLE = True
except ImportError:
    GENAI_AVAILABLE = False

from app.models.models import Resume
from app.schemas import profile_schemas


# ── Strongly Typed Schemas for Resume Extraction ─────────────────────────────

class ParsedPersonalInfo(BaseModel):
    full_name: Optional[str] = None
    email: Optional[str] = None
    phone: Optional[str] = None
    location: Optional[str] = None
    title: Optional[str] = None
    summary: Optional[str] = None


class ParsedWorkExperience(BaseModel):
    job_title: str
    company: str
    location: Optional[str] = None
    start_date: Optional[str] = None
    end_date: Optional[str] = None
    is_current: bool = False
    description: Optional[str] = None
    achievements: List[str] = Field(default_factory=list)


class ParsedEducation(BaseModel):
    degree: str
    institution: str
    field_of_study: Optional[str] = None
    start_date: Optional[str] = None
    end_date: Optional[str] = None
    gpa: Optional[str] = None
    description: Optional[str] = None


class ParsedSkill(BaseModel):
    name: str
    category: Optional[str] = None
    proficiency_level: Optional[str] = None  # Beginner, Intermediate, Advanced, Expert


class ParsedProject(BaseModel):
    title: str
    description: Optional[str] = None
    technologies: List[str] = Field(default_factory=list)
    project_url: Optional[str] = None
    repo_url: Optional[str] = None
    start_date: Optional[str] = None
    end_date: Optional[str] = None


class ParsedCertification(BaseModel):
    name: str
    issuing_organization: Optional[str] = None
    issue_date: Optional[str] = None
    expiration_date: Optional[str] = None
    credential_id: Optional[str] = None
    credential_url: Optional[str] = None


class ParsedAchievement(BaseModel):
    title: str
    organization: Optional[str] = None
    date: Optional[str] = None
    category: Optional[str] = None  # Award, Scholarship, Publication, Hackathon, Patent, etc.
    description: Optional[str] = None
    url: Optional[str] = None


class ParsedLanguage(BaseModel):
    language: str
    proficiency: Optional[str] = None  # Native, Fluent, Professional, Intermediate, Basic


class ParsedSocialLink(BaseModel):
    platform: str
    url: str


class ParsedPublication(BaseModel):
    title: str
    publisher: Optional[str] = None
    date: Optional[str] = None
    url: Optional[str] = None
    description: Optional[str] = None


class ParsedPatent(BaseModel):
    title: str
    patent_number: Optional[str] = None
    issue_date: Optional[str] = None
    url: Optional[str] = None
    description: Optional[str] = None


class ParsedResumeData(BaseModel):
    personal_info: ParsedPersonalInfo = Field(default_factory=ParsedPersonalInfo)
    professional_summary: Optional[str] = None
    career_objective: Optional[str] = None
    work_experience: List[ParsedWorkExperience] = Field(default_factory=list)
    education: List[ParsedEducation] = Field(default_factory=list)
    skills: List[ParsedSkill] = Field(default_factory=list)
    projects: List[ParsedProject] = Field(default_factory=list)
    certifications: List[ParsedCertification] = Field(default_factory=list)
    achievements: List[ParsedAchievement] = Field(default_factory=list)
    languages: List[ParsedLanguage] = Field(default_factory=list)
    social_links: List[ParsedSocialLink] = Field(default_factory=list)
    publications: List[ParsedPublication] = Field(default_factory=list)
    patents: List[ParsedPatent] = Field(default_factory=list)


# ── AI Resume Parser Service Class ───────────────────────────────────────────

class AIResumeParserService:
    """Parses clean resume text using Gemini Flash into structured JSON."""

    SYSTEM_PROMPT = """
You are an expert AI Resume Parser. Your job is to extract structured JSON matching the exact schema below from raw/cleaned resume text.

CRITICAL HALLUCINATION PREVENTION RULES:
1. Extract ONLY facts explicitly stated in the input text.
2. Do NOT invent dates, company names, degrees, or skills not present in the text.
3. If a section or field is missing from the resume, return an empty array `[]` or null.
4. Output MUST be valid JSON only. Do not wrap in extra prose or explanations.

JSON SCHEMA REQUIREMENT:
{
  "personal_info": {
    "full_name": string or null,
    "email": string or null,
    "phone": string or null,
    "location": string or null,
    "title": string or null,
    "summary": string or null
  },
  "professional_summary": string or null,
  "career_objective": string or null,
  "work_experience": [
    {
      "job_title": string,
      "company": string,
      "location": string or null,
      "start_date": string or null,
      "end_date": string or null,
      "is_current": boolean,
      "description": string or null,
      "achievements": [string]
    }
  ],
  "education": [
    {
      "degree": string,
      "institution": string,
      "field_of_study": string or null,
      "start_date": string or null,
      "end_date": string or null,
      "gpa": string or null,
      "description": string or null
    }
  ],
  "skills": [
    {
      "name": string,
      "category": string or null,
      "proficiency_level": string or null
    }
  ],
  "projects": [
    {
      "title": string,
      "description": string or null,
      "technologies": [string],
      "project_url": string or null,
      "repo_url": string or null,
      "start_date": string or null,
      "end_date": string or null
    }
  ],
  "certifications": [
    {
      "name": string,
      "issuing_organization": string or null,
      "issue_date": string or null,
      "expiration_date": string or null,
      "credential_id": string or null,
      "credential_url": string or null
    }
  ],
  "achievements": [
    {
      "title": string,
      "organization": string or null,
      "date": string or null,
      "category": string or null,
      "description": string or null,
      "url": string or null
    }
  ],
  "languages": [
    {
      "language": string,
      "proficiency": string or null
    }
  ],
  "social_links": [
    {
      "platform": string,
      "url": string
    }
  ],
  "publications": [
    {
      "title": string,
      "publisher": string or null,
      "date": string or null,
      "url": string or null,
      "description": string or null
    }
  ],
  "patents": [
    {
      "title": string,
      "patent_number": string or null,
      "issue_date": string or null,
      "url": string or null,
      "description": string or null
    }
  ]
}
"""

    @classmethod
    def _clean_json_markdown(cls, raw_response: str) -> str:
        """Strip markdown ```json ... ``` code fences from LLM output."""
        cleaned = raw_response.strip()
        cleaned = re.sub(r"^```json\s*", "", cleaned, flags=re.IGNORECASE)
        cleaned = re.sub(r"^```\s*", "", cleaned)
        cleaned = re.sub(r"\s*```$", "", cleaned)
        return cleaned.strip()

    @classmethod
    def parse_with_gemini(cls, resume_text: str) -> ParsedResumeData:
        """Call Gemini Flash API to extract structured JSON with retry & schema validation."""
        api_key = os.getenv("GEMINI_API_KEY")
        if not api_key or not GENAI_AVAILABLE:
            # Fallback rule-based structured extraction when offline / no API key
            return cls.parse_rule_based_fallback(resume_text)

        genai.configure(api_key=api_key)
        model = genai.GenerativeModel(
            model_name="gemini-1.5-flash",
            generation_config={"temperature": 0.1, "response_mime_type": "application/json"},
        )

        prompt = f"{cls.SYSTEM_PROMPT}\n\nRESUME TEXT TO PARSE:\n{resume_text}"

        for attempt in range(2):
            try:
                response = model.generate_content(prompt)
                raw_json = cls._clean_json_markdown(response.text)
                json_dict = json.loads(raw_json)
                return ParsedResumeData.model_validate(json_dict)
            except Exception as e:
                if attempt == 1:
                    # Fallback on 2nd failure
                    return cls.parse_rule_based_fallback(resume_text)
                time_delay = 0.5
                time.sleep(time_delay)

        return cls.parse_rule_based_fallback(resume_text)

    @classmethod
    def parse_rule_based_fallback(cls, resume_text: str) -> ParsedResumeData:
        """Factual rule-based fallback structured extractor for offline / test environments."""
        if not resume_text:
            return ParsedResumeData()

        lines = [l.strip() for l in resume_text.split("\n") if l.strip()]

        # 1. Personal Info
        email_match = re.search(r"\b[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}\b", resume_text)
        phone_match = re.search(r"\(?\d{3}\)?[-. ]?\d{3}[-. ]?\d{4}", resume_text)
        name = lines[0] if lines and len(lines[0].split()) <= 4 and not "@" in lines[0] else None

        personal = ParsedPersonalInfo(
            full_name=name,
            email=email_match.group(0) if email_match else None,
            phone=phone_match.group(0) if phone_match else None,
        )

        # 2. Skills
        skills: List[ParsedSkill] = []
        skills_match = re.search(r"SKILLS\s*[:\n](.*?)(?=\n[A-Z\s]{4,}|\Z)", resume_text, re.DOTALL | re.IGNORECASE)
        if skills_match:
            raw_skills = skills_match.group(1)
            items = re.split(r"[,•|\n]", raw_skills)
            for item in items:
                item_clean = item.strip()
                if item_clean and len(item_clean) < 40 and not item_clean.lower().startswith("skills"):
                    skills.append(ParsedSkill(name=item_clean))

        # 3. Work Experience
        work: List[ParsedWorkExperience] = []
        exp_match = re.search(r"(EXPERIENCE|WORK HISTORY)\s*[:\n](.*?)(?=\n[A-Z\s]{4,}|\Z)", resume_text, re.DOTALL | re.IGNORECASE)
        if exp_match:
            exp_text = exp_match.group(2).strip()
            exp_lines = [el.strip() for el in exp_text.split("\n") if el.strip()]
            if exp_lines:
                work.append(ParsedWorkExperience(
                    job_title=exp_lines[0],
                    company=exp_lines[1] if len(exp_lines) > 1 else "Company",
                    description="\n".join(exp_lines[2:6]) if len(exp_lines) > 2 else None,
                ))

        # 4. Education
        edu: List[ParsedEducation] = []
        edu_match = re.search(r"EDUCATION\s*[:\n](.*?)(?=\n[A-Z\s]{4,}|\Z)", resume_text, re.DOTALL | re.IGNORECASE)
        if edu_match:
            edu_lines = [el.strip() for el in edu_match.group(1).split("\n") if el.strip()]
            if edu_lines:
                edu.append(ParsedEducation(
                    degree=edu_lines[0],
                    institution=edu_lines[1] if len(edu_lines) > 1 else "University",
                ))

        # 5. Social Links
        socials: List[ParsedSocialLink] = []
        url_matches = re.findall(r"(linkedin\.com/[^\s]+|github\.com/[^\s]+)", resume_text, re.IGNORECASE)
        for url in url_matches:
            platform = "LinkedIn" if "linkedin" in url.lower() else "GitHub"
            socials.append(ParsedSocialLink(platform=platform, url=url))

        return ParsedResumeData(
            personal_info=personal,
            skills=skills,
            work_experience=work,
            education=edu,
            social_links=socials,
        )


class AIResumeParserBackendService:
    """Database service handling AI Resume Parser execution and isolated persistence."""

    def __init__(self, db: Session):
        self.db = db

    def parse_resume(self, user_id: str, resume_id: int) -> profile_schemas.ResumeResponse:
        """Parse clean/raw resume text into structured JSON and save in Resume.parsed_data_json."""
        resume = (
            self.db.query(Resume)
            .filter(Resume.id == resume_id, Resume.user_id == user_id)
            .first()
        )
        if not resume:
            raise Exception("Resume not found")

        # Mark status as Processing
        resume.parsing_status = "Processing"
        self.db.commit()

        # Select best text source (prefer clean_text over raw_text)
        target_text = resume.clean_text or resume.raw_text or ""

        try:
            parsed_data = AIResumeParserService.parse_with_gemini(target_text)
            # Store output in parsed_data_json column (ISOLATED - does NOT overwrite user_profiles)
            resume.parsed_data_json = parsed_data.model_dump_json()
            resume.parsing_status = "Completed"
            resume.parsed_at = datetime.utcnow()
            resume.processing_error = None
        except Exception as err:
            resume.parsing_status = "Failed"
            resume.processing_error = f"AI Resume Parser Error: {str(err)}"
            resume.parsed_at = datetime.utcnow()

        self.db.commit()
        self.db.refresh(resume)
        return profile_schemas.ResumeResponse.model_validate(resume)
