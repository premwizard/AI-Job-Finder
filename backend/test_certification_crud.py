import sys
import os
import uuid
from datetime import datetime

# Add backend directory to sys.path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app.database.database import SessionLocal, engine, Base
from app.models.models import User, Certification
from app.schemas import profile_schemas
from app.services.profile_service import ProfileService

def test_certification_crud():
    print("--- Starting Certification CRUD Test ---")
    
    # Create tables if not exist
    Base.metadata.create_all(bind=engine)
    
    # Safe migration for existing SQLite DBs
    with engine.connect() as conn:
        for col_def in [
            "ALTER TABLE certifications ADD COLUMN does_not_expire BOOLEAN DEFAULT 0",
            "ALTER TABLE certifications ADD COLUMN category VARCHAR",
            "ALTER TABLE certifications ADD COLUMN verification_status VARCHAR DEFAULT 'unverified'",
            "ALTER TABLE certifications ADD COLUMN updated_at DATETIME",
        ]:
            try:
                from sqlalchemy import text
                conn.execute(text(col_def))
                conn.commit()
            except Exception:
                pass
    
    db = SessionLocal()
    try:
        service = ProfileService(db)
        
        # 1. Create dummy test user
        dummy_email = f"test_cert_{uuid.uuid4().hex[:6]}@example.com"
        user = User(first_name="Test", last_name="User", email=dummy_email, password_hash="dummy")
        db.add(user)
        db.commit()
        db.refresh(user)
        user_id = user.id
        print(f"[SUCCESS] Created test user with ID: {user_id}")
        
        # 2. CREATE Certification
        create_req = profile_schemas.CertificationCreate(
            name="AWS Certified Solutions Architect - Associate",
            issuer="Amazon Web Services",
            category="Cloud Computing",
            credential_id="AWS-ARCH-998877",
            issue_date=datetime(2023, 5, 15),
            expiry_date=datetime(2026, 5, 15),
            does_not_expire=False,
            verification_url="https://aws.amazon.com/verification/AWS-ARCH-998877",
            certificate_image_url="/uploads/certifications/aws_cert.pdf",
            verification_status="verified"
        )
        
        created_cert = service._create_item(Certification, user_id, create_req)
        cert_id = created_cert.id
        assert cert_id is not None
        assert created_cert.name == "AWS Certified Solutions Architect - Associate"
        assert created_cert.category == "Cloud Computing"
        print(f"[SUCCESS] CREATE Certification item ID: {cert_id}")
        
        # 3. READ Certifications (GET)
        user_certs = service.get_certifications(user_id)
        assert len(user_certs) >= 1
        assert user_certs[0].id == cert_id
        assert user_certs[0].issuer == "Amazon Web Services"
        print(f"[SUCCESS] READ Certification list returned {len(user_certs)} item(s)")
        
        # 4. UPDATE Certification (PUT)
        update_req = profile_schemas.CertificationUpdate(
            name="AWS Certified Solutions Architect - Professional",
            does_not_expire=True
        )
        updated_cert = service._update_item(Certification, cert_id, user_id, update_req)
        assert updated_cert.name == "AWS Certified Solutions Architect - Professional"
        assert updated_cert.does_not_expire is True
        print(f"[SUCCESS] UPDATE Certification item ID {cert_id} updated name & expiration toggle")
        
        # 5. DELETE Certification (DELETE)
        deleted = service._delete_item(Certification, cert_id, user_id)
        assert deleted is True
        
        remaining_certs = service.get_certifications(user_id)
        assert not any(c.id == cert_id for c in remaining_certs)
        print(f"[SUCCESS] DELETE Certification item ID {cert_id} successfully removed")
        
        # Cleanup dummy user
        db.delete(user)
        db.commit()
        print("[SUCCESS] Cleaned up test user")
        
        print("\n>>> ALL CERTIFICATION CRUD TESTS PASSED SUCCESSFULLY! <<<")
    finally:
        db.close()

if __name__ == "__main__":
    test_certification_crud()
