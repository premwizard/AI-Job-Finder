import sys
import os
import uuid
import json
from datetime import datetime

# Add backend directory to sys.path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app.database.database import SessionLocal, engine, Base
from app.models.models import User, Project
from app.schemas import profile_schemas
from app.services.profile_service import ProfileService

def test_project_crud():
    print("--- Starting Project Portfolio CRUD Test ---")
    
    # Create tables if not exist
    Base.metadata.create_all(bind=engine)
    
    # Safe migration for existing SQLite DBs
    with engine.connect() as conn:
        for col_def in [
            "ALTER TABLE projects ADD COLUMN short_description VARCHAR",
            "ALTER TABLE projects ADD COLUMN duration VARCHAR",
            "ALTER TABLE projects ADD COLUMN images TEXT",
            "ALTER TABLE projects ADD COLUMN status VARCHAR DEFAULT 'Completed'",
            "ALTER TABLE projects ADD COLUMN is_featured BOOLEAN DEFAULT 0",
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
        dummy_email = f"test_proj_{uuid.uuid4().hex[:6]}@example.com"
        user = User(first_name="Test", last_name="User", email=dummy_email, password_hash="dummy")
        db.add(user)
        db.commit()
        db.refresh(user)
        user_id = user.id
        print(f"[SUCCESS] Created test user with ID: {user_id}")
        
        # 2. CREATE Project
        create_req = profile_schemas.ProjectCreate(
            name="AI Job Finder Portfolio Platform",
            short_description="An intelligent AI-powered job matching & portfolio platform",
            description="Full-stack AI job search suite featuring automated resume parsing, portfolio management, and smart job recommendations.",
            project_type="Full-Stack Web App",
            role="Lead Software Architect & Developer",
            team_size="3 developers",
            duration="4 Months (Jan - Apr 2026)",
            tech_stack="Next.js 15, FastAPI, Tailwind CSS, PostgreSQL, Zod",
            ai_technologies="OpenAI GPT-4o, PyTorch, LangChain",
            github_url="https://github.com/example/ai-job-finder",
            live_demo_url="https://aijobfinder.example.com",
            video_demo_url="https://youtube.com/watch?v=demo123",
            images=json.dumps(["/uploads/projects/screenshot1.png", "/uploads/projects/screenshot2.png"]),
            challenges="Optimizing real-time similarity vector search across 100k job postings.",
            achievements="Reduced search latency by 65% and onboarded 5,000 beta users.",
            status="Completed",
            is_featured=True
        )
        
        created_proj = service._create_item(Project, user_id, create_req)
        proj_id = created_proj.id
        assert proj_id is not None
        assert created_proj.name == "AI Job Finder Portfolio Platform"
        assert created_proj.is_featured is True
        print(f"[SUCCESS] CREATE Project item ID: {proj_id}")
        
        # 3. READ Projects (GET)
        user_projects = service.get_projects(user_id)
        assert len(user_projects) >= 1
        assert user_projects[0].id == proj_id
        assert user_projects[0].role == "Lead Software Architect & Developer"
        print(f"[SUCCESS] READ Projects list returned {len(user_projects)} item(s)")
        
        # 4. UPDATE Project (PUT)
        update_req = profile_schemas.ProjectUpdate(
            name="AI Job Finder & Career Copilot v2",
            status="In Progress",
            is_featured=False
        )
        updated_proj = service._update_item(Project, proj_id, user_id, update_req)
        assert updated_proj.name == "AI Job Finder & Career Copilot v2"
        assert updated_proj.status == "In Progress"
        assert updated_proj.is_featured is False
        print(f"[SUCCESS] UPDATE Project item ID {proj_id} updated name & status to '{updated_proj.status}'")
        
        # 5. DELETE Project (DELETE)
        deleted = service._delete_item(Project, proj_id, user_id)
        assert deleted is True
        
        remaining_projs = service.get_projects(user_id)
        assert not any(p.id == proj_id for p in remaining_projs)
        print(f"[SUCCESS] DELETE Project item ID {proj_id} successfully removed")
        
        # Cleanup dummy user
        db.delete(user)
        db.commit()
        print("[SUCCESS] Cleaned up test user")
        
        print("\n>>> ALL PROJECT PORTFOLIO CRUD TESTS PASSED SUCCESSFULLY! <<<")
    finally:
        db.close()

if __name__ == "__main__":
    test_project_crud()
