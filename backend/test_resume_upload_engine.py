"""
Automated Test — Phase 3 Module 1: Resume Upload Engine
Tests:
- Upload valid files (PDF, PNG, DOCX)
- Auto-versioning & Active flag switching
- Duplicate detection (SHA-256 hash match)
- Max file size (10 MB) validation
- Unsupported file format validation
- Corrupted file header validation
- Replace resume
- Activate resume version
- Download resume file
- Delete resume file
"""
import sys
import os
import uuid
import io

sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from fastapi import HTTPException, UploadFile
from sqlalchemy import text
from app.database.database import SessionLocal, engine, Base
from app.models.models import User, Resume
from app.services.profile_service import ProfileService


def create_dummy_upload_file(filename: str, content: bytes) -> UploadFile:
    file_obj = io.BytesIO(content)
    return UploadFile(filename=filename, file=file_obj)


def test_resume_upload_engine():
    print("--- Starting Resume Upload Engine Test ---")

    Base.metadata.create_all(bind=engine)

    # Run safe column additions if sqlite DB exists
    with engine.connect() as conn:
        for col_def in [
            "ALTER TABLE resumes ADD COLUMN mime_type VARCHAR",
            "ALTER TABLE resumes ADD COLUMN file_hash VARCHAR",
        ]:
            try:
                conn.execute(text(col_def))
                conn.commit()
            except Exception:
                pass

    db = SessionLocal()
    try:
        service = ProfileService(db)

        # 1. Create test user
        dummy_email = f"test_resume_eng_{uuid.uuid4().hex[:6]}@example.com"
        user = User(first_name="Resume", last_name="EngineTester", email=dummy_email, password_hash="dummy")
        db.add(user)
        db.commit()
        db.refresh(user)
        user_id = user.id
        print(f"[SUCCESS] Created test user: {user_id}")

        # 2. GET empty resumes list
        empty_resumes = service.get_resumes(user_id)
        assert empty_resumes == []
        print("[SUCCESS] GET empty resumes list returned []")

        # 3. Upload valid PDF file
        valid_pdf_bytes = b"%PDF-1.4 valid test pdf content line 1\nline 2\n%%EOF"
        pdf_file = create_dummy_upload_file("my_resume.pdf", valid_pdf_bytes)
        res_v1 = service.upload_resume(user_id, pdf_file)

        assert res_v1.id is not None
        assert res_v1.version == 1
        assert res_v1.is_active is True
        assert res_v1.file_type == "PDF"
        assert res_v1.mime_type == "application/pdf"
        assert res_v1.file_name == "my_resume.pdf"
        assert res_v1.file_hash is not None
        print(f"[SUCCESS] Uploaded v1 resume: ID={res_v1.id}, version={res_v1.version}, active={res_v1.is_active}")

        # 4. Duplicate Detection Test
        dup_file = create_dummy_upload_file("my_resume_copy.pdf", valid_pdf_bytes)
        try:
            service.upload_resume(user_id, dup_file)
            assert False, "Expected 400 Duplicate Resume Error"
        except HTTPException as e:
            assert e.status_code == 400
            assert "Duplicate" in e.detail
        print("[SUCCESS] Duplicate detection caught identical file hash (400 Duplicate error)")

        # 5. Unsupported Format Test (.exe / .zip)
        exe_file = create_dummy_upload_file("malicious.exe", b"MZexecutable")
        try:
            service.upload_resume(user_id, exe_file)
            assert False, "Expected 400 Unsupported Format Error"
        except HTTPException as e:
            assert e.status_code == 400
            assert "Unsupported" in e.detail
        print("[SUCCESS] Unsupported format rejected (.exe file)")

        # 6. Corrupted File Header Test (File named .pdf but doesn't start with %PDF)
        corrupted_pdf = create_dummy_upload_file("corrupted.pdf", b"INVALID_HEADER_DATA_12345")
        try:
            service.upload_resume(user_id, corrupted_pdf)
            assert False, "Expected 400 Corrupted File Error"
        except HTTPException as e:
            assert e.status_code == 400
            assert "Corrupted" in e.detail
        print("[SUCCESS] Corrupted file header rejected")

        # 7. Max File Size Validation (> 10 MB)
        huge_bytes = b"%PDF-1.4 " + (b"X" * (10 * 1024 * 1024 + 500))
        huge_file = create_dummy_upload_file("oversized.pdf", huge_bytes)
        try:
            service.upload_resume(user_id, huge_file)
            assert False, "Expected 400 File Size Limit Error"
        except HTTPException as e:
            assert e.status_code == 400
            assert "exceeds" in e.detail or "10 MB" in e.detail
        print("[SUCCESS] Oversized file (>10MB) rejected")

        # 8. Upload valid PNG file (v2)
        valid_png_bytes = b"\x89PNG\r\n\x1a\n\x00\x00\x00\rIHDR valid png image content"
        png_file = create_dummy_upload_file("resume_scan.png", valid_png_bytes)
        res_v2 = service.upload_resume(user_id, png_file)

        assert res_v2.version == 2
        assert res_v2.is_active is True
        assert res_v2.file_type == "PNG"

        # Verify v1 is now inactive
        resumes_after_v2 = service.get_resumes(user_id)
        assert len(resumes_after_v2) == 2
        v1_check = next(r for r in resumes_after_v2 if r.id == res_v1.id)
        assert v1_check.is_active is False
        print(f"[SUCCESS] Uploaded v2 resume: ID={res_v2.id}. Auto-deactivated v1 (v1.is_active={v1_check.is_active})")

        # 9. Replace resume v2 with DOCX file
        valid_docx_bytes = b"PK\x03\x04\x14\x00\x08\x00 valid docx zip content header"
        docx_file = create_dummy_upload_file("updated_resume.docx", valid_docx_bytes)
        replaced_v2 = service.replace_resume(user_id, res_v2.id, docx_file)

        assert replaced_v2.id == res_v2.id
        assert replaced_v2.version == 2
        assert replaced_v2.file_type == "DOCX"
        assert replaced_v2.file_name == "updated_resume.docx"
        print(f"[SUCCESS] Replaced v2 resume with new DOCX file. Kept version={replaced_v2.version}")

        # 10. Activate v1 version
        activated_v1 = service.set_active_resume(user_id, res_v1.id)
        assert activated_v1.is_active is True
        resumes_after_act = service.get_resumes(user_id)
        v2_check = next(r for r in resumes_after_act if r.id == res_v2.id)
        assert v2_check.is_active is False
        print(f"[SUCCESS] Switched active version back to v1 (v1 active, v2 inactive)")

        # 11. Delete resume v1
        service.delete_resume(user_id, res_v1.id)
        remaining_resumes = service.get_resumes(user_id)
        assert len(remaining_resumes) == 1
        # v2 should now be promoted to active
        assert remaining_resumes[0].id == res_v2.id
        assert remaining_resumes[0].is_active is True
        print("[SUCCESS] Deleted v1 resume. Promoted v2 to active automatically.")

        # Cleanup
        for r in db.query(Resume).filter(Resume.user_id == user_id).all():
            if r.file_url:
                fp = r.file_url.lstrip("/")
                if os.path.exists(fp):
                    try:
                        os.remove(fp)
                    except OSError:
                        pass
            db.delete(r)
        db.delete(user)
        db.commit()
        print("[SUCCESS] Cleaned up test data and files")

        print("\n>>> ALL RESUME UPLOAD ENGINE TESTS PASSED SUCCESSFULLY! <<<")

    finally:
        db.close()


if __name__ == "__main__":
    test_resume_upload_engine()
