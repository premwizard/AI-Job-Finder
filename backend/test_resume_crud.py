"""
Automated CRUD Test — Phase 2 Module 10: Resume Center
Tests: Upload, List, Replace, Delete, Version Tracking, is_active promotion.
"""
import sys
import os
import uuid
import io

# Add backend to sys.path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from sqlalchemy import text
from app.database.database import SessionLocal, engine, Base
from app.models.models import User
from app.services.profile_service import ProfileService


def make_fake_upload(filename: str, content: bytes = b"%PDF-1.4 fake resume content"):
    """Create a mock UploadFile-like object for testing."""
    class FakeUploadFile:
        def __init__(self, filename, content):
            self.filename = filename
            self.file = io.BytesIO(content)

        def read(self):
            return self.file.read()

    return FakeUploadFile(filename, content)


def test_resume_center_crud():
    print("--- Starting Resume Center CRUD Test ---")

    # Ensure tables exist
    Base.metadata.create_all(bind=engine)

    # Safe column migrations for existing SQLite DBs
    with engine.connect() as conn:
        for col_def in [
            "ALTER TABLE resumes ADD COLUMN file_type VARCHAR",
            "ALTER TABLE resumes ADD COLUMN is_active BOOLEAN DEFAULT 1",
        ]:
            try:
                conn.execute(text(col_def))
                conn.commit()
            except Exception:
                pass

    db = SessionLocal()
    try:
        service = ProfileService(db)

        # Create dummy test user
        dummy_email = f"test_resume_{uuid.uuid4().hex[:6]}@example.com"
        user = User(first_name="Resume", last_name="Tester", email=dummy_email, password_hash="dummy")
        db.add(user)
        db.commit()
        db.refresh(user)
        user_id = user.id
        print(f"[SUCCESS] Created test user: {user_id}")

        # ── 1. UPLOAD initial resume (v1) ──────────────────────────────────
        fake_v1 = make_fake_upload("my_resume_v1.pdf", b"%PDF-1.4 " + b"x" * 1024)
        uploaded_v1 = service.upload_resume(user_id, fake_v1)
        assert uploaded_v1.id is not None
        assert uploaded_v1.version == 1
        assert uploaded_v1.is_active is True
        assert uploaded_v1.file_type == "PDF"
        assert uploaded_v1.file_size > 0
        assert uploaded_v1.parsing_status == "Ready"
        print(f"[SUCCESS] UPLOAD v1 — ID: {uploaded_v1.id}, version: {uploaded_v1.version}, "
              f"size: {uploaded_v1.file_size}B, type: {uploaded_v1.file_type}")

        # ── 2. READ — list resumes ──────────────────────────────────────────
        resumes = service.get_resumes(user_id)
        assert len(resumes) == 1
        assert resumes[0].id == uploaded_v1.id
        print(f"[SUCCESS] READ — {len(resumes)} resume(s) found")

        # ── 3. UPLOAD second version (v2) — checks version increment & deactivation of v1 ──
        fake_v2 = make_fake_upload("my_resume_v2.pdf", b"%PDF-1.4 " + b"y" * 2048)
        uploaded_v2 = service.upload_resume(user_id, fake_v2)
        assert uploaded_v2.version == 2
        assert uploaded_v2.is_active is True

        # Verify v1 is now inactive
        resumes = service.get_resumes(user_id)
        assert len(resumes) == 2
        v1_record = next(r for r in resumes if r.id == uploaded_v1.id)
        assert v1_record.is_active is False
        print(f"[SUCCESS] UPLOAD v2 — version: {uploaded_v2.version}, v1 is_active: {v1_record.is_active}")

        # ── 4. REPLACE — replace v2 with a new file (same version, new file) ──
        fake_replace = make_fake_upload("my_resume_v2_updated.docx", b"PK\x03\x04" + b"z" * 512)
        replaced = service.replace_resume(user_id, uploaded_v2.id, fake_replace)
        assert replaced.version == 2
        assert replaced.file_type == "DOCX"
        assert replaced.file_name == "my_resume_v2_updated.docx"
        print(f"[SUCCESS] REPLACE — same version {replaced.version}, new file type: {replaced.file_type}")

        # ── 5. DELETE v2 — v1 should be promoted to active ────────────────
        deleted = service.delete_resume(user_id, uploaded_v2.id)
        assert deleted is True
        resumes_after_delete = service.get_resumes(user_id)
        assert len(resumes_after_delete) == 1
        assert resumes_after_delete[0].id == uploaded_v1.id
        assert resumes_after_delete[0].is_active is True
        print(f"[SUCCESS] DELETE v2 — v1 (ID: {uploaded_v1.id}) promoted to active")

        # ── 6. DELETE last resume ──────────────────────────────────────────
        service.delete_resume(user_id, uploaded_v1.id)
        remaining = service.get_resumes(user_id)
        assert len(remaining) == 0
        print("[SUCCESS] DELETE last resume — no resumes remain")

        # Cleanup
        db.delete(user)
        db.commit()
        print("[SUCCESS] Cleaned up test user")

        print("\n>>> ALL RESUME CENTER CRUD TESTS PASSED SUCCESSFULLY! <<<")

    finally:
        db.close()


if __name__ == "__main__":
    test_resume_center_crud()
