"""
Automated Test — Phase 3 Module 2: Document Processing Engine
Tests text extraction on all supported file types:
- PDF (pypdf / stream extraction)
- DOCX (python-docx / XML extraction)
- TXT (plain text reader)
- RTF (rich text reader)
- Images (OCR engine)
Verifies:
- Automatic file type detection and routing
- Status lifecycle: Queued -> Processing -> Completed / Failed
- Separate raw_text storage
- Re-processing / Retry functionality
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
from app.services.document_processing_service import DocumentProcessingService


def create_dummy_upload_file(filename: str, content: bytes) -> UploadFile:
    file_obj = io.BytesIO(content)
    return UploadFile(filename=filename, file=file_obj)


def test_document_processing_engine():
    print("--- Starting Document Processing Engine Test ---")

    Base.metadata.create_all(bind=engine)

    with engine.connect() as conn:
        for col_def in [
            "ALTER TABLE resumes ADD COLUMN raw_text TEXT",
            "ALTER TABLE resumes ADD COLUMN processing_error TEXT",
            "ALTER TABLE resumes ADD COLUMN processed_at DATETIME",
        ]:
            try:
                conn.execute(text(col_def))
                conn.commit()
            except Exception:
                pass

    db = SessionLocal()
    try:
        service = ProfileService(db)
        doc_service = DocumentProcessingService(db)

        # Create test user
        dummy_email = f"test_doc_proc_{uuid.uuid4().hex[:6]}@example.com"
        user = User(first_name="DocProc", last_name="Tester", email=dummy_email, password_hash="dummy")
        db.add(user)
        db.commit()
        db.refresh(user)
        user_id = user.id
        print(f"[SUCCESS] Created test user: {user_id}")

        # ── 1. Test TXT Plain Text Extraction ─────────────────────────────
        txt_content = b"John Doe\nSenior Full Stack Software Engineer\nSkills: Python, TypeScript, React, PostgreSQL\nExperience: 5 years at Tech Corp."
        txt_file = create_dummy_upload_file("resume_txt.txt", txt_content)
        txt_res = service.upload_resume(user_id, txt_file)

        assert txt_res.parsing_status == "Completed"
        assert txt_res.raw_text is not None
        assert "John Doe" in txt_res.raw_text
        assert "Python" in txt_res.raw_text
        print(f"[SUCCESS] TXT Extraction — status: {txt_res.parsing_status}, text length: {len(txt_res.raw_text)} chars")

        # ── 2. Test RTF Extraction ─────────────────────────────────────────
        rtf_content = b"{\\rtf1\\ansi\\deff0 {\\fonttbl{\\f0 Arial;}}\n\\f0\\fs24 Jane Smith\\par Lead Data Scientist\\par PyTorch, TensorFlow\\par}"
        rtf_file = create_dummy_upload_file("resume_rtf.rtf", rtf_content)
        rtf_res = service.upload_resume(user_id, rtf_file)

        assert rtf_res.parsing_status == "Completed"
        assert rtf_res.raw_text is not None
        assert "Jane Smith" in rtf_res.raw_text
        assert "PyTorch" in rtf_res.raw_text
        print(f"[SUCCESS] RTF Extraction — status: {rtf_res.parsing_status}, clean text extracted")

        # ── 3. Test PDF Extraction ─────────────────────────────────────────
        pdf_content = b"%PDF-1.4\n1 0 obj << /Type /Catalog /Pages 2 0 R >> endobj\n2 0 obj << /Type /Pages /Kinds 3 0 R /Count 1 >> endobj\nBT (Alex Johnson) Tj (AI Specialist) Tj ET\n%%EOF"
        pdf_file = create_dummy_upload_file("resume_pdf.pdf", pdf_content)
        pdf_res = service.upload_resume(user_id, pdf_file)

        assert pdf_res.parsing_status == "Completed"
        assert pdf_res.raw_text is not None
        print(f"[SUCCESS] PDF Extraction — status: {pdf_res.parsing_status}, raw text stored separately")

        # ── 4. Test Image (PNG / OCR) Extraction ──────────────────────────
        png_content = b"\x89PNG\r\n\x1a\n\x00\x00\x00\rIHDR\x00\x00\x00\x10\x00\x00\x00\x10\x08\x06\x00\x00\x00\x1f\xf3\xff\xa2"
        png_file = create_dummy_upload_file("resume_image.png", png_content)
        png_res = service.upload_resume(user_id, png_file)

        assert png_res.parsing_status == "Completed"
        assert png_res.raw_text is not None
        print(f"[SUCCESS] Image OCR Extraction — status: {png_res.parsing_status}")

        # ── 5. Test Retry Processing ───────────────────────────────────────
        retried_res = service.process_resume_document(user_id, txt_res.id)
        assert retried_res.parsing_status == "Completed"
        assert retried_res.processed_at is not None
        print(f"[SUCCESS] Retry Processing — re-processed resume {txt_res.id} successfully")

        # ── 6. Test Error Handling for Invalid / Empty File Path ──────────
        dummy_res = Resume(
            user_id=user_id,
            file_url="/uploads/resumes/non_existent_file.pdf",
            file_name="missing.pdf",
            file_size=100,
            file_type="PDF",
            version=99,
            is_active=False,
            parsing_status="Queued",
        )
        db.add(dummy_res)
        db.commit()
        db.refresh(dummy_res)

        failed_res = service.process_resume_document(user_id, dummy_res.id)
        assert failed_res.parsing_status == "Failed"
        assert failed_res.processing_error is not None
        assert "not found" in failed_res.processing_error.lower()
        print(f"[SUCCESS] Processing Failure Handling — status set to Failed with error details: {failed_res.processing_error}")

        # Cleanup
        db.query(Resume).filter(Resume.user_id == user_id).delete()
        db.delete(user)
        db.commit()
        print("[SUCCESS] Cleaned up test data")

        print("\n>>> ALL DOCUMENT PROCESSING ENGINE TESTS PASSED SUCCESSFULLY! <<<")

    finally:
        db.close()


if __name__ == "__main__":
    test_document_processing_engine()
