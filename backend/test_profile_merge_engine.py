"""
Automated Test — Phase 3 Module 6: Profile Merge Engine
Tests:
- Detection of NEW skills (e.g. Docker, AWS when Profile has Python, FastAPI)
- Detection of DUPLICATE items (exact skill, experience, or education matches)
- Detection of UPDATE & CONFLICT items (date/description mismatches)
- Professional Summary comparison (NEW vs DUPLICATE vs CONFLICT)
- Zero DB Updates Verification (asserts profile tables are NOT modified by merge suggestions generator)
"""

import sys
import os
import json
import uuid

sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from sqlalchemy import text
from app.database.database import SessionLocal, engine, Base
from app.models.models import User, Resume, UserProfile, Skill, Experience, Education
from app.services.profile_merge_service import ProfileMergeService, MergeSuggestionsResponse


def test_profile_merge_engine():
    print("--- Starting Profile Merge Engine Test ---")

    Base.metadata.create_all(bind=engine)
    db = SessionLocal()

    try:
        # Create test user
        dummy_email = f"test_merge_{uuid.uuid4().hex[:6]}@example.com"
        user = User(first_name="Merge", last_name="Tester", email=dummy_email, password_hash="dummy")
        db.add(user)
        db.commit()
        db.refresh(user)
        user_id = user.id

        # Populate initial profile data: Python, FastAPI
        profile = UserProfile(user_id=user_id, professional_summary="Senior Engineer with Python experience.")
        sk1 = Skill(user_id=user_id, name="Python")
        sk2 = Skill(user_id=user_id, name="FastAPI")
        exp1 = Experience(user_id=user_id, job_title="Backend Lead", company="TechCorp", start_date="2021", end_date="Present")
        db.add_all([profile, sk1, sk2, exp1])
        db.commit()

        # Create Resume with Parsed Data: Python, FastAPI, Docker, AWS
        parsed_data = {
            "personal_info": {"email": dummy_email},
            "professional_summary": "Senior AI & Cloud Architect with deep Python experience.",
            "skills": [
                {"name": "Python"},
                {"name": "FastAPI"},
                {"name": "Docker"},
                {"name": "AWS"},
            ],
            "work_experience": [
                {"job_title": "Backend Lead", "company": "TechCorp", "start_date": "2020", "end_date": "Present"}, # CONFLICT date
                {"job_title": "Cloud Architect", "company": "SkyNet", "start_date": "2023", "end_date": "Present"}, # NEW
            ],
            "education": [
                {"degree": "B.S. CS", "institution": "Stanford University"}, # NEW
            ]
        }

        resume = Resume(
            user_id=user_id,
            file_name="merge_resume.pdf",
            file_url="/uploads/merge_resume.pdf",
            version=1,
            is_active=True,
            parsing_status="Completed",
            parsed_data_json=json.dumps(parsed_data),
        )
        db.add(resume)
        db.commit()
        db.refresh(resume)

        # ── 1. Execute Profile Merge Suggestions Generator ────────────────
        merge_service = ProfileMergeService(db)
        suggestions_res = merge_service.generate_merge_suggestions(user_id, resume.id)

        assert isinstance(suggestions_res, MergeSuggestionsResponse)
        assert suggestions_res.total_suggestions >= 5

        # ── 2. Verify Skills Categories ───────────────────────────────────
        new_skills = [s for s in suggestions_res.suggestions if s.category == "skills" and s.status == "NEW"]
        dup_skills = [s for s in suggestions_res.suggestions if s.category == "skills" and s.status == "DUPLICATE"]

        new_skill_names = [s.title for s in new_skills]
        dup_skill_names = [s.title for s in dup_skills]

        assert any("Docker" in name for name in new_skill_names)
        assert any("AWS" in name for name in new_skill_names)
        assert any("Python" in name for name in dup_skill_names)
        assert any("FastAPI" in name for name in dup_skill_names)
        print("[SUCCESS] Skill Suggestions: Detected Docker & AWS as NEW, Python & FastAPI as DUPLICATE")

        # ── 3. Verify Experience Conflict & New Detection ─────────────────
        exp_suggestions = [s for s in suggestions_res.suggestions if s.category == "experience"]
        conflict_exp = [s for s in exp_suggestions if s.status == "CONFLICT"]
        new_exp = [s for s in exp_suggestions if s.status == "NEW"]

        assert len(conflict_exp) >= 1  # TechCorp date mismatch (2021 vs 2020)
        assert len(new_exp) >= 1       # SkyNet
        print("[SUCCESS] Experience Suggestions: Detected TechCorp date mismatch as CONFLICT and SkyNet as NEW")

        # ── 4. Verify Summary Conflict Detection ──────────────────────────
        sum_suggestions = [s for s in suggestions_res.suggestions if s.category == "summary"]
        assert len(sum_suggestions) == 1
        assert sum_suggestions[0].status == "CONFLICT"
        print("[SUCCESS] Summary Suggestions: Detected summary text mismatch as CONFLICT")

        # ── 5. ZERO DB MUTATION ASSERTION ─────────────────────────────────
        # Ensure profile skills count is STILL 2 and experiences count is STILL 1
        current_skills = db.query(Skill).filter(Skill.user_id == user_id).all()
        current_exp = db.query(Experience).filter(Experience.user_id == user_id).all()
        assert len(current_skills) == 2
        assert len(current_exp) == 1
        print("[SUCCESS] Zero DB Mutation Assertion Verified — Profile tables were NOT updated automatically!")

        # Cleanup
        db.query(Resume).filter(Resume.user_id == user_id).delete()
        db.query(Skill).filter(Skill.user_id == user_id).delete()
        db.query(Experience).filter(Experience.user_id == user_id).delete()
        db.query(UserProfile).filter(UserProfile.user_id == user_id).delete()
        db.delete(user)
        db.commit()
        print("[SUCCESS] Cleaned up test data")

        print("\n>>> ALL PROFILE MERGE ENGINE TESTS PASSED SUCCESSFULLY! <<<")

    finally:
        db.close()


if __name__ == "__main__":
    test_profile_merge_engine()
