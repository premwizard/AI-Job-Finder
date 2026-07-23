"""
Automated Test — Phase 3 Module 5: AI Resume Parser
Tests:
- Experienced Candidate Resume (Jobs, Education, Skills, Projects, Certifications, Patents, Publications)
- Fresher / Student Resume (Minimal experience, Projects, Degree)
- Incomplete / Minimal Resume & Hallucination Protection (returns [] or None for missing sections, no fabricated data)
- Large Multi-Page Resume
- Pydantic Schema Validation (ParsedResumeData)
- Isolated Database Storage (stores in Resume.parsed_data_json without mutating user_profiles table)
"""

import sys
import os
import json
import uuid
import io

sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from fastapi import UploadFile
from sqlalchemy import text
from app.database.database import SessionLocal, engine, Base
from app.models.models import User, Resume, UserProfile
from app.services.profile_service import ProfileService
from app.services.ai_resume_parser_service import (
    AIResumeParserService,
    AIResumeParserBackendService,
    ParsedResumeData,
)


def create_dummy_upload_file(filename: str, content: bytes) -> UploadFile:
    file_obj = io.BytesIO(content)
    return UploadFile(filename=filename, file=file_obj)


def test_ai_resume_parser():
    print("--- Starting AI Resume Parser Test ---")

    Base.metadata.create_all(bind=engine)

    with engine.connect() as conn:
        for col_def in [
            "ALTER TABLE resumes ADD COLUMN parsed_data_json TEXT",
            "ALTER TABLE resumes ADD COLUMN parsed_at DATETIME",
        ]:
            try:
                conn.execute(text(col_def))
                conn.commit()
            except Exception:
                pass

    db = SessionLocal()
    try:
        # ── 1. Experienced Candidate Resume Parsing Test ─────────────────
        exp_resume_text = (
            "SARAH CONNOR\n"
            "Email: sarah.connor@cyberdyne.com | Phone: (555) 019-2834 | Location: Austin, TX\n"
            "LinkedIn: linkedin.com/in/sarahconnor | GitHub: github.com/sconnor\n\n"
            "PROFESSIONAL SUMMARY\n"
            "Lead AI Infrastructure Engineer with 8+ years experience scaling distributed LLM pipelines.\n\n"
            "SKILLS\n"
            "• Python, PyTorch, C++, CUDA, PostgreSQL, Kubernetes, Docker, FastAPI\n\n"
            "WORK EXPERIENCE\n"
            "Staff AI Engineer | Cyberdyne Systems | 01/2021 - Present\n"
            "• Spearheaded deployment of multi-gpu inference server for LLM models.\n"
            "• Reduced p99 latency by 45%.\n\n"
            "Senior Backend Engineer | Skynet Tech | 06/2017 - 12/2020\n"
            "• Designed resilient microservices handling 10M daily requests.\n\n"
            "EDUCATION\n"
            "B.S. in Computer Science | University of Texas at Austin | 2013 - 2017\n"
            "GPA: 3.9/4.0\n\n"
            "PROJECTS\n"
            "Distributed Vector DB | Built custom C++ vector store using HNSW index.\n\n"
            "PUBLICATIONS\n"
            "Efficient Neural Network Pruning | IEEE AI Journal 2022\n\n"
            "PATENTS\n"
            "System for Real-Time Inference Acceleration | US Patent 10,987,654\n"
        )

        parsed_exp = AIResumeParserService.parse_rule_based_fallback(exp_resume_text)
        assert isinstance(parsed_exp, ParsedResumeData)
        assert parsed_exp.personal_info.email == "sarah.connor@cyberdyne.com"
        assert parsed_exp.personal_info.phone == "(555) 019-2834"
        assert len(parsed_exp.skills) >= 1
        assert len(parsed_exp.work_experience) >= 1
        assert len(parsed_exp.education) >= 1
        assert len(parsed_exp.social_links) >= 1
        print("[SUCCESS] Experienced Candidate Resume parsed into strongly typed schema")

        # ── 2. Fresher / Student Resume Parsing Test ─────────────────────
        fresher_text = (
            "ALEX RIVERA\n"
            "alex.rivera@university.edu | (555) 123-4567\n"
            "CAREER OBJECTIVE\n"
            "Enthusiastic CS graduate seeking Junior Frontend Developer role.\n\n"
            "EDUCATION\n"
            "B.Tech Computer Science | Tech University | 2020 - 2024\n\n"
            "SKILLS\n"
            "• React, TypeScript, HTML5, CSS3, Git\n\n"
            "PROJECTS\n"
            "E-Commerce Portal | React, Tailwind, Node.js\n"
        )
        parsed_fresher = AIResumeParserService.parse_rule_based_fallback(fresher_text)
        assert parsed_fresher.personal_info.email == "alex.rivera@university.edu"
        assert len(parsed_fresher.education) == 1
        assert len(parsed_fresher.skills) >= 1
        print("[SUCCESS] Fresher / Student Resume parsed cleanly")

        # ── 3. Incomplete Resume & Hallucination Protection Test ─────────
        incomplete_text = "JOHN DOE\nSkills: Python, Go"
        parsed_inc = AIResumeParserService.parse_rule_based_fallback(incomplete_text)
        assert parsed_inc.personal_info.full_name == "JOHN DOE"
        assert parsed_inc.work_experience == []
        assert parsed_inc.education == []
        assert parsed_inc.certifications == []
        assert parsed_inc.patents == []
        print("[SUCCESS] Incomplete Resume & Hallucination Protection verified (missing sections return empty lists)")

        # ── 4. Large Multi-Page Resume Test ──────────────────────────────
        large_text = (
            "MARCUS VANCE\n"
            "marcus.vance@techlead.org | (555) 999-0000\n"
            "Page 1 of 3\n\n"
            "SKILLS\n"
            "• Python, Java, Go, Kubernetes, Terraform, AWS, Azure, GCP, GraphQL, REST, Redis, Kafka\n\n"
            "WORK EXPERIENCE\n"
            "Principal Architect | Cloud Matrix Inc | 01/2018 - Present\n"
            "• Led 30+ engineers building cloud native solutions.\n"
            "Page 2 of 3\n"
            "Senior Architect | Data Core | 01/2012 - 12/2017\n"
            "• Managed multi-datacenter migrations.\n"
        )
        parsed_large = AIResumeParserService.parse_rule_based_fallback(large_text)
        assert len(parsed_large.skills) >= 1
        assert len(parsed_large.work_experience) >= 1
        print("[SUCCESS] Large multi-page resume parsed successfully")

        # ── 5. Database Persistence & Isolation Test ─────────────────────
        dummy_email = f"test_parser_{uuid.uuid4().hex[:6]}@example.com"
        user = User(first_name="Parser", last_name="Tester", email=dummy_email, password_hash="dummy")
        db.add(user)
        db.commit()
        db.refresh(user)
        user_id = user.id

        # Initial profile check
        profile = UserProfile(user_id=user_id, headline="Original Headline")
        db.add(profile)
        db.commit()

        resume_content = "EMILY DAVIS\nemily@davis.com | (555) 444-3333\nSKILLS: Python, React\nEDUCATION: BS CS | Stanford 2022"
        upload_file = create_dummy_upload_file("emily_resume.txt", resume_content.encode("utf-8"))

        service = ProfileService(db)
        uploaded_resume = service.upload_resume(user_id, upload_file)

        # Trigger AI Parsing
        parsed_res = service.parse_resume_ai(user_id, uploaded_resume.id)

        assert parsed_res.parsed_data_json is not None
        json_obj = json.loads(parsed_res.parsed_data_json)
        assert json_obj["personal_info"]["email"] == "emily@davis.com"

        # Verify ISOLATION: user profile headline must NOT be mutated!
        db.refresh(profile)
        assert profile.headline == "Original Headline"
        print("[SUCCESS] Isolated DB Storage — Output saved in Resume.parsed_data_json without mutating user_profiles table!")

        # Cleanup
        db.query(Resume).filter(Resume.user_id == user_id).delete()
        db.query(UserProfile).filter(UserProfile.user_id == user_id).delete()
        db.delete(user)
        db.commit()
        print("[SUCCESS] Cleaned up test data")

        print("\n>>> ALL AI RESUME PARSER TESTS PASSED SUCCESSFULLY! <<<")

    finally:
        db.close()


if __name__ == "__main__":
    test_ai_resume_parser()
