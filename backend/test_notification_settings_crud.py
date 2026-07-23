"""
Automated Test — Phase 2 Module 18: Notification Settings
Tests: GET (empty/default), PUT (create/update toggles, channels, frequency, quiet hours), GET (verify persistence).
"""
import sys
import os
import uuid

sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app.database.database import SessionLocal, engine, Base
from app.models.models import User, NotificationSetting
from app.schemas.profile_schemas import NotificationSettingUpdate
from app.services.profile_service import ProfileService


def test_notification_settings_crud():
    print("--- Starting Notification Settings CRUD Test ---")

    Base.metadata.create_all(bind=engine)

    db = SessionLocal()
    try:
        service = ProfileService(db)

        # Create test user
        dummy_email = f"test_notif_{uuid.uuid4().hex[:6]}@example.com"
        user = User(first_name="Notif", last_name="Tester", email=dummy_email, password_hash="dummy")
        db.add(user)
        db.commit()
        db.refresh(user)
        user_id = user.id
        print(f"[SUCCESS] Created test user: {user_id}")

        # ── 1. GET — empty/default notification settings ─────────────────
        empty_settings = service.get_notification_settings(user_id)
        assert empty_settings is not None
        assert empty_settings.job_matches is None or empty_settings.job_matches is True
        print("[SUCCESS] GET empty/default notification settings — returned expected response")

        # ── 2. PUT — create initial notification settings ─────────────────
        create_data = NotificationSettingUpdate(
            job_matches=True,
            daily_digest=True,
            weekly_digest=False,
            resume_tips=True,
            career_tips=False,
            interview_reminders=True,
            product_updates=True,
            security_alerts=True,
            email_channel=True,
            in_app_channel=True,
            push_channel=False,
            notification_frequency="Hourly",
            quiet_hours_enabled=True,
            quiet_hours_start="23:00",
            quiet_hours_end="07:00",
        )
        created = service.update_notification_settings(user_id, create_data)
        assert created.job_matches is True
        assert created.weekly_digest is False
        assert created.email_channel is True
        assert created.notification_frequency == "Hourly"
        assert created.quiet_hours_enabled is True
        assert created.quiet_hours_start == "23:00"
        assert created.quiet_hours_end == "07:00"
        print(f"[SUCCESS] PUT create — freq: {created.notification_frequency}, quiet: {created.quiet_hours_start}-{created.quiet_hours_end}")

        # ── 3. GET — verify persisted settings ────────────────────────────
        fetched = service.get_notification_settings(user_id)
        assert fetched.job_matches is True
        assert fetched.quiet_hours_start == "23:00"
        print(f"[SUCCESS] GET after create — quiet_hours_end: {fetched.quiet_hours_end}")

        # ── 4. PUT — partial update (toggle all types off) ─────────────────
        update_data = NotificationSettingUpdate(
            job_matches=False,
            daily_digest=False,
            weekly_digest=False,
            resume_tips=False,
            career_tips=False,
            interview_reminders=False,
            product_updates=False,
            security_alerts=False,
        )
        updated = service.update_notification_settings(user_id, update_data)
        assert updated.job_matches is False
        assert updated.daily_digest is False
        assert updated.security_alerts is False
        # Channels and frequency preserved
        assert updated.email_channel is True
        assert updated.notification_frequency == "Hourly"
        print(f"[SUCCESS] PUT update — select all off verified, channels preserved")

        # Cleanup
        setting_record = db.query(NotificationSetting).filter(NotificationSetting.user_id == user_id).first()
        if setting_record:
            db.delete(setting_record)
        db.delete(user)
        db.commit()
        print("[SUCCESS] Cleaned up test data")

        print("\n>>> ALL NOTIFICATION SETTINGS CRUD TESTS PASSED SUCCESSFULLY! <<<")

    finally:
        db.close()


if __name__ == "__main__":
    test_notification_settings_crud()
