"""
Automated Test — Phase 3 Module 4: Resume Cleaning Engine
Tests:
- Header, Footer, and Page Number removal
- Duplicate line removal
- Hyphenated broken word stitching & sentence wrapping
- Bullet point standardization to '• '
- Date normalization (01/2021 -> Jan 2021, Present)
- Email normalization (obfuscated emails -> clean lowercase email)
- Phone number normalization ((123) 456-7890)
- URL normalization (https://www.linkedin.com -> linkedin.com)
- Database persistence of both raw_text and clean_text
"""

import sys
import os
import uuid
import io

sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from fastapi import UploadFile
from sqlalchemy import text
from app.database.database import SessionLocal, engine, Base
from app.models.models import User, Resume
from app.services.profile_service import ProfileService
from app.services.resume_cleaning_service import ResumeCleaner


def create_dummy_upload_file(filename: str, content: bytes) -> UploadFile:
    file_obj = io.BytesIO(content)
    return UploadFile(filename=filename, file=file_obj)


def test_resume_cleaning_engine():
    print("--- Starting Resume Cleaning Engine Test ---")

    Base.metadata.create_all(bind=engine)

    with engine.connect() as conn:
        for col_def in [
            "ALTER TABLE resumes ADD COLUMN clean_text TEXT",
            "ALTER TABLE resumes ADD COLUMN cleaned_at DATETIME",
        ]:
            try:
                conn.execute(text(col_def))
                conn.commit()
            except Exception:
                pass

    db = SessionLocal()
    try:
        service = ProfileService(db)

        # ── 1. Page Number, Header & Footer Removal Test ───────────────────
        raw_header_text = "ALEX JOHNSON\nConfidential\nPage 1 of 3\nSenior Full Stack Developer\n[Page 2]"
        cleaned_headers = ResumeCleaner.remove_page_numbers_headers_footers(raw_header_text)
        assert "Page 1 of 3" not in cleaned_headers
        assert "Confidential" not in cleaned_headers
        assert "[Page 2]" not in cleaned_headers
        assert "ALEX JOHNSON" in cleaned_headers
        print("[SUCCESS] Page numbers, Headers & Footers removed")

        # ── 2. Duplicate Lines Removal Test ────────────────────────────────
        raw_dup_text = "SKILLS\nSKILLS\nPython\nReact\nReact\nPostgreSQL"
        cleaned_dup = ResumeCleaner.remove_duplicate_lines(raw_dup_text)
        assert cleaned_dup.count("SKILLS") == 1
        assert cleaned_dup.count("React") == 1
        print("[SUCCESS] Duplicate lines removed")

        # ── 3. Broken Word Hyphenation & Sentence Joining Test ─────────────
        raw_broken = "Developed soft-\nware solutions for high-frequency trading.\nEngineered scale-\nable microservices."
        cleaned_broken = ResumeCleaner.fix_broken_sentences(raw_broken)
        assert "software" in cleaned_broken
        assert "scaleable" in cleaned_broken
        print("[SUCCESS] Broken hyphenated words stitched ('soft-\\nware' -> 'software')")

        # ── 4. Bullet Point Standardization Test ───────────────────────────
        raw_bullets = "* Implemented FastAPI backend\n- Built Next.js UI components\n▪ Managed PostgreSQL database"
        cleaned_bullets = ResumeCleaner.normalize_bullet_points(raw_bullets)
        assert "• Implemented FastAPI backend" in cleaned_bullets
        assert "• Built Next.js UI components" in cleaned_bullets
        assert "• Managed PostgreSQL database" in cleaned_bullets
        print("[SUCCESS] Bullet points standardized to '• ' format")

        # ── 5. Date Normalization Test ──────────────────────────────────────
        raw_dates = "Experience: 01/2021 - 12/2023 | Software Engineer\n05-2019 to Present"
        cleaned_dates = ResumeCleaner.normalize_dates(raw_dates)
        assert "Jan 2021" in cleaned_dates
        assert "Dec 2023" in cleaned_dates
        assert "May 2019 to Present" in cleaned_dates
        print("[SUCCESS] Date formats normalized (01/2021 -> Jan 2021)")

        # ── 6. Email, Phone & URL Normalization Test ────────────────────────
        raw_contact = "Contact: JOHN [at] GMAIL [dot] COM | Call: 123.456.7890 | Link: https://www.linkedin.com/in/john"
        cleaned_email = ResumeCleaner.normalize_emails(raw_contact)
        cleaned_phone = ResumeCleaner.normalize_phone_numbers(cleaned_email)
        cleaned_contact = ResumeCleaner.normalize_urls(cleaned_phone)

        assert "john@gmail.com" in cleaned_contact
        assert "(123) 456-7890" in cleaned_contact
        assert "linkedin.com/in/john" in cleaned_contact
        print("[SUCCESS] Email, Phone numbers & URLs normalized")

        # ── 7. Full Cleaning Pipeline & DB Persistence Test ────────────────
        dummy_email = f"test_clean_{uuid.uuid4().hex[:6]}@example.com"
        user = User(first_name="Cleaner", last_name="Tester", email=dummy_email, password_hash="dummy")
        db.add(user)
        db.commit()
        db.refresh(user)
        user_id = user.id

        uncleaned_resume_text = (
            "ALEX RIVERA\n"
            "Page 1 of 2\n"
            "Confidential\n\n"
            "Contact: alex [at] techcorp [dot] com | 9876543210\n"
            "Portfolio: https://www.alexrivera.dev\n\n"
            "EXPERIENCE\n"
            "Senior Developer | 03/2020 - Present\n"
            "* Developed robust web-\n"
            "site architectures.\n"
            "* Developed robust web-\n"
            "site architectures.\n"
        )
        upload_file = create_dummy_upload_file("uncleaned_resume.txt", uncleaned_resume_text.encode("utf-8"))
        res = service.upload_resume(user_id, upload_file)

        assert res.raw_text is not None
        assert res.clean_text is not None
        assert "website" in res.clean_text
        assert "alex@techcorp.com" in res.clean_text
        assert "Page 1 of 2" not in res.clean_text
        assert res.clean_text != res.raw_text
        print(f"[SUCCESS] DB Persistence — Stored raw_text ({len(res.raw_text)} chars) and clean_text ({len(res.clean_text)} chars) separately")

        # ── 8. Dedicated Service Re-Clean Test ─────────────────────────────
        recleaned = service.clean_resume_text(user_id, res.id)
        assert recleaned.clean_text is not None
        assert recleaned.cleaned_at is not None
        print("[SUCCESS] Re-clean endpoint verified — cleaned_at timestamp updated")

        # Cleanup
        db.query(Resume).filter(Resume.user_id == user_id).delete()
        db.delete(user)
        db.commit()
        print("[SUCCESS] Cleaned up test data")

        print("\n>>> ALL RESUME CLEANING ENGINE TESTS PASSED SUCCESSFULLY! <<<")

    finally:
        db.close()


if __name__ == "__main__":
    test_resume_cleaning_engine()
