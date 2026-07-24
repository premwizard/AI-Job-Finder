"""
Automated Test — Phase 2 Module 11: Career Preferences
Tests: GET (empty), PUT (create), PUT (update fields), verify new columns.
"""
import sys
import os
import uuid

sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from sqlalchemy import text
from app.database.database import SessionLocal, engine, Base
from app.models.models import User, CareerPreference
from app.schemas.profile_schemas import CareerPreferenceUpdate
from app.services.profile_service import ProfileService


def test_career_preferences_crud():
    print("--- Starting Career Preferences CRUD Test ---")

    Base.metadata.create_all(bind=engine)

    # Apply safe migrations for new columns
    with engine.connect() as conn:
        for col_def in [
            "ALTER TABLE career_preferences ADD COLUMN preferred_countries VARCHAR",
            "ALTER TABLE career_preferences ADD COLUMN preferred_cities VARCHAR",
            "ALTER TABLE career_preferences ADD COLUMN startup_or_enterprise VARCHAR",
            "ALTER TABLE career_preferences ADD COLUMN negotiable_salary BOOLEAN DEFAULT 0",
        ]:
            try:
                conn.execute(text(col_def))
                conn.commit()
            except Exception:
                pass

    db = SessionLocal()
    try:
        service = ProfileService(db)

        # Create test user
        dummy_email = f"test_career_{uuid.uuid4().hex[:6]}@example.com"
        user = User(first_name="Career", last_name="Tester", email=dummy_email, password_hash="dummy")
        db.add(user)
        db.commit()
        db.refresh(user)
        user_id = user.id
        print(f"[SUCCESS] Created test user: {user_id}")

        # ── 1. GET — empty prefs ───────────────────────────────────────────
        empty_prefs = service.get_career_preferences(user_id)
        assert empty_prefs is not None
        assert empty_prefs.preferred_roles is None
        print("[SUCCESS] GET empty prefs — returned default empty response")

        # ── 2. PUT — create initial preferences ───────────────────────────
        create_data = CareerPreferenceUpdate(
            preferred_roles="Backend Engineer,ML Engineer",
            preferred_industries="Technology,FinTech",
            preferred_countries="India,USA,Germany",
            preferred_cities="Bangalore,Remote,Berlin",
            work_setup="Remote,Hybrid",
            expected_salary="120000",
            preferred_currency="USD",
            negotiable_salary=True,
            employment_types="Full-Time,Contract",
            company_size="51–200,201–500",
            startup_or_enterprise="Startup",
            visa_sponsorship=False,
            willing_to_relocate=True,
            travel_willingness="Occasional (< 25%)",
            preferred_shift="Flexible / Async",
            availability="Immediately Available",
        )
        created = service.update_career_preferences(user_id, create_data)
        assert created.preferred_roles == "Backend Engineer,ML Engineer"
        assert created.preferred_countries == "India,USA,Germany"
        assert created.preferred_cities == "Bangalore,Remote,Berlin"
        assert created.work_setup == "Remote,Hybrid"
        assert created.startup_or_enterprise == "Startup"
        assert created.negotiable_salary is True
        assert created.willing_to_relocate is True
        print(f"[SUCCESS] PUT create — roles: {created.preferred_roles}, countries: {created.preferred_countries}")

        # ── 3. GET — verify persisted ──────────────────────────────────────
        fetched = service.get_career_preferences(user_id)
        assert fetched.preferred_roles == "Backend Engineer,ML Engineer"
        assert fetched.startup_or_enterprise == "Startup"
        print(f"[SUCCESS] GET after create — startup: {fetched.startup_or_enterprise}")

        # ── 4. PUT — partial update (only change a few fields) ─────────────
        update_data = CareerPreferenceUpdate(
            preferred_roles="Senior Backend Engineer,Staff Engineer",
            startup_or_enterprise="Enterprise",
            availability="Available in 1 Month",
        )
        updated = service.update_career_preferences(user_id, update_data)
        assert updated.preferred_roles == "Senior Backend Engineer,Staff Engineer"
        assert updated.startup_or_enterprise == "Enterprise"
        assert updated.availability == "Available in 1 Month"
        # Unchanged fields should be preserved (upsert semantics)
        assert updated.preferred_countries == "India,USA,Germany"
        assert updated.work_setup == "Remote,Hybrid"
        print(f"[SUCCESS] PUT update — roles: {updated.preferred_roles}, startup_or_enterprise: {updated.startup_or_enterprise}")

        # ── 5. Verify toggle booleans ──────────────────────────────────────
        toggle_data = CareerPreferenceUpdate(visa_sponsorship=True, willing_to_relocate=False)
        toggled = service.update_career_preferences(user_id, toggle_data)
        assert toggled.visa_sponsorship is True
        assert toggled.willing_to_relocate is False
        print(f"[SUCCESS] Toggle booleans — visa_sponsorship: {toggled.visa_sponsorship}, relocate: {toggled.willing_to_relocate}")

        # Cleanup
        pref_record = db.query(CareerPreference).filter(CareerPreference.user_id == user_id).first()
        if pref_record:
            db.delete(pref_record)
        db.delete(user)
        db.commit()
        print("[SUCCESS] Cleaned up test data")

        print("\n>>> ALL CAREER PREFERENCES CRUD TESTS PASSED SUCCESSFULLY! <<<")

    finally:
        db.close()


if __name__ == "__main__":
    test_career_preferences_crud()
