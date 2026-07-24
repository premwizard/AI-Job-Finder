"""
Automated Test — Phase 2 Module 16: Profile Analytics
Tests: GET /api/profile/analytics, verifies profile_completion, metrics, breakdown, and readiness score.
"""
import sys
import os
import uuid

sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app.database.database import SessionLocal, engine, Base
from app.models.models import User, Skill, Project, Certification
from app.services.profile_service import ProfileService


def test_profile_analytics():
    print("--- Starting Profile Analytics Test ---")

    Base.metadata.create_all(bind=engine)

    db = SessionLocal()
    try:
        service = ProfileService(db)

        # Create test user
        dummy_email = f"test_analytics_{uuid.uuid4().hex[:6]}@example.com"
        user = User(first_name="Analytics", last_name="Tester", email=dummy_email, password_hash="dummy")
        db.add(user)
        db.commit()
        db.refresh(user)
        user_id = user.id
        print(f"[SUCCESS] Created test user: {user_id}")

        # Add mock profile data
        s1 = Skill(user_id=user_id, skill_name="Python", category="Backend")
        s2 = Skill(user_id=user_id, skill_name="React", category="Frontend")
        s3 = Skill(user_id=user_id, skill_name="FastAPI", category="Backend")
        db.add_all([s1, s2, s3])

        p1 = Project(user_id=user_id, name="AI Job Finder", short_description="Job search platform")
        db.add(p1)

        c1 = Certification(user_id=user_id, name="AWS Cloud Practitioner", issuer="AWS")
        db.add(c1)

        db.commit()

        # Fetch analytics
        analytics = service.get_profile_analytics(user_id)
        assert analytics is not None
        assert analytics.skills_count == 3
        assert analytics.projects_count == 1
        assert analytics.certifications_count == 1
        assert analytics.profile_completion > 0
        assert analytics.career_readiness_score >= 0
        assert len(analytics.section_breakdown) > 0

        print("[SUCCESS] Analytics metrics computed successfully:")
        print(f"          Completion: {analytics.profile_completion}%")
        print(f"          Skills: {analytics.skills_count}")
        print(f"          Projects: {analytics.projects_count}")
        print(f"          Certifications: {analytics.certifications_count}")
        print(f"          Readiness Score: {analytics.career_readiness_score}/100")

        # Cleanup
        db.query(Skill).filter(Skill.user_id == user_id).delete()
        db.query(Project).filter(Project.user_id == user_id).delete()
        db.query(Certification).filter(Certification.user_id == user_id).delete()
        db.delete(user)
        db.commit()
        print("[SUCCESS] Cleaned up test data")

        print("\n>>> ALL PROFILE ANALYTICS TESTS PASSED SUCCESSFULLY! <<<")

    finally:
        db.close()


if __name__ == "__main__":
    test_profile_analytics()
