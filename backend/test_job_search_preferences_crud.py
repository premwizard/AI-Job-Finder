"""
Automated Test — Phase 2 Module 15: Job Search Preferences
Tests: GET (empty/default), PUT (create), PUT (update fields), verify persistence.
"""
import sys
import os
import uuid

sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app.database.database import SessionLocal, engine, Base
from app.models.models import User, JobSearchPreference
from app.schemas.profile_schemas import JobSearchPreferenceUpdate
from app.services.profile_service import ProfileService


def test_job_search_preferences_crud():
    print("--- Starting Job Search Preferences CRUD Test ---")

    Base.metadata.create_all(bind=engine)

    db = SessionLocal()
    try:
        service = ProfileService(db)

        # Create test user
        dummy_email = f"test_jsp_{uuid.uuid4().hex[:6]}@example.com"
        user = User(first_name="SearchPref", last_name="Tester", email=dummy_email, password_hash="dummy")
        db.add(user)
        db.commit()
        db.refresh(user)
        user_id = user.id
        print(f"[SUCCESS] Created test user: {user_id}")

        # ── 1. GET — empty/default prefs ──────────────────────────────────
        empty_prefs = service.get_job_search_preferences(user_id)
        assert empty_prefs is not None
        assert empty_prefs.search_frequency is None or empty_prefs.search_frequency == "Daily"
        print("[SUCCESS] GET empty/default prefs — returned expected response")

        # ── 2. PUT — create initial preferences ───────────────────────────
        create_data = JobSearchPreferenceUpdate(
            search_frequency="Daily",
            email_notifications=True,
            digest_frequency="Weekly Summary",
            job_alert_keywords="React,Python,Full Stack",
            min_match_score=80,
            preferred_sources="LinkedIn,Indeed,Wellfound",
            ignore_companies="Revature,Consulting Co",
            ignore_keywords="Unpaid,Onsite Only",
            blocked_locations="High-Tax Region",
        )
        created = service.update_job_search_preferences(user_id, create_data)
        assert created.search_frequency == "Daily"
        assert created.email_notifications is True
        assert created.digest_frequency == "Weekly Summary"
        assert created.job_alert_keywords == "React,Python,Full Stack"
        assert created.min_match_score == 80
        assert created.preferred_sources == "LinkedIn,Indeed,Wellfound"
        assert created.ignore_companies == "Revature,Consulting Co"
        assert created.ignore_keywords == "Unpaid,Onsite Only"
        assert created.blocked_locations == "High-Tax Region"
        print(f"[SUCCESS] PUT create — search_freq: {created.search_frequency}, match_score: {created.min_match_score}")

        # ── 3. GET — verify persisted ──────────────────────────────────────
        fetched = service.get_job_search_preferences(user_id)
        assert fetched.job_alert_keywords == "React,Python,Full Stack"
        assert fetched.min_match_score == 80
        print(f"[SUCCESS] GET after create — keywords: {fetched.job_alert_keywords}")

        # ── 4. PUT — partial update (only change score and frequency) ──────
        update_data = JobSearchPreferenceUpdate(
            min_match_score=85,
            search_frequency="Weekly",
        )
        updated = service.update_job_search_preferences(user_id, update_data)
        assert updated.min_match_score == 85
        assert updated.search_frequency == "Weekly"
        # Unchanged fields preserved
        assert updated.job_alert_keywords == "React,Python,Full Stack"
        assert updated.email_notifications is True
        print(f"[SUCCESS] PUT update — min_match_score: {updated.min_match_score}, search_frequency: {updated.search_frequency}")

        # Cleanup
        pref_record = db.query(JobSearchPreference).filter(JobSearchPreference.user_id == user_id).first()
        if pref_record:
            db.delete(pref_record)
        db.delete(user)
        db.commit()
        print("[SUCCESS] Cleaned up test data")

        print("\n>>> ALL JOB SEARCH PREFERENCES CRUD TESTS PASSED SUCCESSFULLY! <<<")

    finally:
        db.close()


if __name__ == "__main__":
    test_job_search_preferences_crud()
