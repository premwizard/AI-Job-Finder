import sys
import os
import uuid
from datetime import datetime

# Add backend directory to sys.path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app.database.database import SessionLocal, engine, Base
from app.models.models import User, Education
from app.schemas import profile_schemas
from app.services.profile_service import ProfileService

def test_education_crud():
    print("--- Starting Education CRUD Test ---")
    
    # Create all tables if not exist
    Base.metadata.create_all(bind=engine)
    
    db = SessionLocal()
    try:
        service = ProfileService(db)
        
        # 1. Create dummy user if needed
        dummy_email = f"test_edu_{uuid.uuid4().hex[:6]}@example.com"
        user = User(first_name="Test", last_name="User", email=dummy_email, password_hash="dummy")
        db.add(user)
        db.commit()
        db.refresh(user)
        user_id = user.id
        print(f"[SUCCESS] Created test user with ID: {user_id}")
        
        # 2. CREATE Education
        create_req = profile_schemas.EducationCreate(
            institution_name="Stanford University",
            institution_logo_url="/uploads/education/stanford.png",
            degree="Bachelor of Science",
            major="Computer Science",
            specialization="Artificial Intelligence",
            cgpa="3.95",
            start_date=datetime(2020, 9, 1),
            end_date=datetime(2024, 6, 1),
            is_current=False,
            activities="ACM Chapter President, Robotics Club",
            honors_awards="Dean's Honors List 2020-2024",
            relevant_coursework="Algorithms, Operating Systems, Machine Learning",
            certificate_url="/uploads/education/cert_stanford.pdf",
            verification_status="verified"
        )
        
        created_edu = service._create_item(Education, user_id, create_req)
        edu_id = created_edu.id
        assert edu_id is not None
        assert created_edu.institution_name == "Stanford University"
        print(f"[SUCCESS] CREATE Education item ID: {edu_id}")
        
        # 3. READ Educations (GET)
        user_educations = service.get_educations(user_id)
        assert len(user_educations) >= 1
        assert user_educations[0].id == edu_id
        assert user_educations[0].degree == "Bachelor of Science"
        print(f"[SUCCESS] READ Education list returned {len(user_educations)} item(s)")
        
        # 4. UPDATE Education (PUT)
        update_req = profile_schemas.EducationUpdate(
            degree="Master of Science",
            specialization="Deep Learning & NLP",
            cgpa="4.00"
        )
        updated_edu = service._update_item(Education, edu_id, user_id, update_req)
        assert updated_edu.degree == "Master of Science"
        assert updated_edu.specialization == "Deep Learning & NLP"
        assert updated_edu.cgpa == "4.00"
        print(f"[SUCCESS] UPDATE Education item ID {edu_id} updated degree to '{updated_edu.degree}'")
        
        # 5. DELETE Education (DELETE)
        deleted = service._delete_item(Education, edu_id, user_id)
        assert deleted is True
        
        remaining_educations = service.get_educations(user_id)
        assert not any(e.id == edu_id for e in remaining_educations)
        print(f"[SUCCESS] DELETE Education item ID {edu_id} successfully removed")
        
        # Cleanup dummy user
        db.delete(user)
        db.commit()
        print("[SUCCESS] Cleaned up test user")
        
        print("\n>>> ALL EDUCATION CRUD TESTS PASSED SUCCESSFULLY! <<<")
    finally:
        db.close()

if __name__ == "__main__":
    test_education_crud()
