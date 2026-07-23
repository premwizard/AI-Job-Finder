"""
Automated Test — Phase 2 Module 14: Achievements
Tests: GET (empty), POST (create each type), GET (verify), PUT (update), filter by type, DELETE.
"""
import sys
import os
import uuid
from datetime import date

sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from fastapi import HTTPException


from app.database.database import SessionLocal, engine, Base
from app.models.models import User, Achievement
from app.schemas.profile_schemas import AchievementCreate, AchievementUpdate
from app.services.profile_service import ProfileService

ACHIEVEMENT_TYPES = [
    "Award",
    "Scholarship",
    "Publication",
    "Open Source Contribution",
    "Hackathon",
    "Competition",
    "Patent",
    "Speaking Engagement",
]


def test_achievements_crud():
    print("--- Starting Achievements CRUD Test ---")

    Base.metadata.create_all(bind=engine)

    db = SessionLocal()
    try:
        service = ProfileService(db)

        # Create test user
        dummy_email = f"test_ach_{uuid.uuid4().hex[:6]}@example.com"
        user = User(first_name="Ach", last_name="Tester", email=dummy_email, password_hash="dummy")
        db.add(user)
        db.commit()
        db.refresh(user)
        user_id = user.id
        print(f"[SUCCESS] Created test user: {user_id}")

        # ── 1. GET empty ───────────────────────────────────────────────────
        empty = service.get_achievements(user_id)
        assert empty == []
        print("[SUCCESS] GET empty — returned []")

        # ── 2. POST — create one of each type ─────────────────────────────
        created_ids = []
        for ach_type in ACHIEVEMENT_TYPES:
            data = AchievementCreate(
                type=ach_type,
                title=f"Test {ach_type}",
                organization=f"Org for {ach_type}",
                description=f"This is a test {ach_type} description.",
                url=f"https://example.com/{ach_type.lower().replace(' ', '-')}",
            )
            result = service.create_achievement(user_id, data)
            assert result.id is not None
            assert result.type == ach_type
            assert result.title == f"Test {ach_type}"
            assert result.organization == f"Org for {ach_type}"
            assert result.created_at is not None
            created_ids.append(result.id)
        print(f"[SUCCESS] POST create — all 8 types created ({len(created_ids)} records)")

        # ── 3. GET all — verify count ──────────────────────────────────────
        all_items = service.get_achievements(user_id)
        assert len(all_items) == 8
        print(f"[SUCCESS] GET all — {len(all_items)} achievements returned")

        # ── 4. GET filter by type ──────────────────────────────────────────
        awards = service.get_achievements(user_id, achievement_type="Award")
        assert len(awards) == 1
        assert awards[0].type == "Award"
        pubs = service.get_achievements(user_id, achievement_type="Publication")
        assert len(pubs) == 1
        assert pubs[0].type == "Publication"
        print("[SUCCESS] GET filter — Award: 1, Publication: 1")

        # ── 5. PUT — update an achievement ────────────────────────────────
        target_id = created_ids[0]  # Award
        update_data = AchievementUpdate(
            title="Updated Award Title",
            organization="Updated Organization",
            description="Updated description with more detail.",
        )
        updated = service.update_achievement(user_id, target_id, update_data)
        assert updated.title == "Updated Award Title"
        assert updated.organization == "Updated Organization"
        assert updated.description == "Updated description with more detail."
        # Unchanged fields preserved
        assert updated.type == "Award"
        assert updated.url == "https://example.com/award"
        print(f"[SUCCESS] PUT update — title: {updated.title}")

        # ── 6. DELETE a single achievement ────────────────────────────────
        delete_id = created_ids[-1]  # Speaking Engagement
        result = service.delete_achievement(user_id, delete_id)
        assert result is True
        remaining = service.get_achievements(user_id)
        assert len(remaining) == 7
        types_left = [a.type for a in remaining]
        assert "Speaking Engagement" not in types_left
        print(f"[SUCCESS] DELETE — 7 achievements remain, Speaking Engagement removed")

        # ── 7. DELETE non-existent (404) ──────────────────────────────────
        try:
            service.delete_achievement(user_id, "nonexistent-id-12345")
            assert False, "Expected HTTPException 404"
        except HTTPException as e:
            assert e.status_code == 404
        print("[SUCCESS] DELETE non-existent — correctly raised 404")

        # Cleanup
        ach_records = db.query(Achievement).filter(Achievement.user_id == user_id).all()
        for rec in ach_records:
            db.delete(rec)
        db.delete(user)
        db.commit()
        print("[SUCCESS] Cleaned up test data")

        print("\n>>> ALL ACHIEVEMENTS CRUD TESTS PASSED SUCCESSFULLY! <<<")

    finally:
        db.close()


if __name__ == "__main__":
    test_achievements_crud()
