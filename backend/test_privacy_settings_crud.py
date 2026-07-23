"""
Automated Test — Phase 2 Module 17: Privacy Settings
Tests: GET (empty/default), PUT (create/update toggles & dropdowns), GET (verify), GET export-data.
"""
import sys
import os
import uuid

sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app.database.database import SessionLocal, engine, Base
from app.models.models import User, PrivacySetting
from app.schemas.profile_schemas import PrivacySettingUpdate
from app.services.profile_service import ProfileService


def test_privacy_settings_crud():
    print("--- Starting Privacy Settings CRUD Test ---")

    Base.metadata.create_all(bind=engine)

    db = SessionLocal()
    try:
        service = ProfileService(db)

        # Create test user
        dummy_email = f"test_privacy_{uuid.uuid4().hex[:6]}@example.com"
        user = User(first_name="Privacy", last_name="Tester", email=dummy_email, password_hash="dummy")
        db.add(user)
        db.commit()
        db.refresh(user)
        user_id = user.id
        print(f"[SUCCESS] Created test user: {user_id}")

        # ── 1. GET — empty/default privacy settings ───────────────────────
        empty_settings = service.get_privacy_settings(user_id)
        assert empty_settings is not None
        assert empty_settings.is_public_profile is None or empty_settings.is_public_profile is True
        print("[SUCCESS] GET empty/default privacy settings — returned expected response")

        # ── 2. PUT — create initial privacy settings ───────────────────────
        create_data = PrivacySettingUpdate(
            is_public_profile=True,
            hide_email=True,
            hide_phone=True,
            resume_visibility="Recruiters Only",
            recruiter_visibility=True,
            search_engine_indexing=False,
            account_visibility="Public",
        )
        created = service.update_privacy_settings(user_id, create_data)
        assert created.is_public_profile is True
        assert created.hide_email is True
        assert created.hide_phone is True
        assert created.resume_visibility == "Recruiters Only"
        assert created.recruiter_visibility is True
        assert created.search_engine_indexing is False
        assert created.account_visibility == "Public"
        print(f"[SUCCESS] PUT create — hide_email: {created.hide_email}, resume_vis: {created.resume_visibility}")

        # ── 3. GET — verify persisted settings ────────────────────────────
        fetched = service.get_privacy_settings(user_id)
        assert fetched.hide_email is True
        assert fetched.resume_visibility == "Recruiters Only"
        print(f"[SUCCESS] GET after create — hide_phone: {fetched.hide_phone}")

        # ── 4. PUT — partial update toggles ────────────────────────────────
        update_data = PrivacySettingUpdate(
            hide_email=False,
            resume_visibility="Private",
            search_engine_indexing=True,
        )
        updated = service.update_privacy_settings(user_id, update_data)
        assert updated.hide_email is False
        assert updated.resume_visibility == "Private"
        assert updated.search_engine_indexing is True
        # Unchanged fields preserved
        assert updated.hide_phone is True
        assert updated.account_visibility == "Public"
        print(f"[SUCCESS] PUT update — hide_email: {updated.hide_email}, resume_vis: {updated.resume_visibility}")

        # ── 5. GET export-data ─────────────────────────────────────────────
        export_snapshot = service.export_user_data(user_id)
        assert export_snapshot is not None
        assert export_snapshot["user_id"] == user_id
        assert "privacy_settings" in export_snapshot
        assert "profile" in export_snapshot
        print(f"[SUCCESS] GET export-data — exported snapshot successfully for user {user_id}")

        # Cleanup
        setting_record = db.query(PrivacySetting).filter(PrivacySetting.user_id == user_id).first()
        if setting_record:
            db.delete(setting_record)
        db.delete(user)
        db.commit()
        print("[SUCCESS] Cleaned up test data")

        print("\n>>> ALL PRIVACY SETTINGS CRUD TESTS PASSED SUCCESSFULLY! <<<")

    finally:
        db.close()


if __name__ == "__main__":
    test_privacy_settings_crud()
