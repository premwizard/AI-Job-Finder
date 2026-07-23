import os
import sys

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

# Ensure the backend directory is in the path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.routes import (
    auth_routes,
    jobs_routes,
    profile_routes,
    settings_routes,
    social_auth_routes,
)
from src.api.routers import analytics, applications, resume, saved_jobs, users, work_experience


app = FastAPI(
    title="AI Job Finder API",
    description="Backend API for the AI Job Finder application.",
    version="1.0.0",
)

# Configure CORS for Next.js frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include Routers
app.include_router(auth_routes.router)
app.include_router(social_auth_routes.router)
app.include_router(users.router)
app.include_router(jobs_routes.router)
app.include_router(profile_routes.router)
app.include_router(settings_routes.router)
app.include_router(analytics.router)
app.include_router(resume.router)
app.include_router(saved_jobs.router)
app.include_router(applications.router)
app.include_router(work_experience.router)

from fastapi.staticfiles import StaticFiles

# Ensure the uploads directory exists
os.makedirs("uploads", exist_ok=True)
app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")

from app.database.database import engine, Base
from sqlalchemy import text

@app.on_event("startup")
def startup_event():
    Base.metadata.create_all(bind=engine)
    with engine.connect() as conn:
        for col_def in [
            "ALTER TABLE certifications ADD COLUMN does_not_expire BOOLEAN DEFAULT 0",
            "ALTER TABLE certifications ADD COLUMN category VARCHAR",
            "ALTER TABLE certifications ADD COLUMN verification_status VARCHAR DEFAULT 'unverified'",
            "ALTER TABLE certifications ADD COLUMN updated_at DATETIME",
            "ALTER TABLE education ADD COLUMN verification_status VARCHAR DEFAULT 'unverified'",
            "ALTER TABLE education ADD COLUMN updated_at DATETIME",
            "ALTER TABLE projects ADD COLUMN short_description VARCHAR",
            "ALTER TABLE projects ADD COLUMN duration VARCHAR",
            "ALTER TABLE projects ADD COLUMN images TEXT",
            "ALTER TABLE projects ADD COLUMN status VARCHAR DEFAULT 'Completed'",
            "ALTER TABLE projects ADD COLUMN is_featured BOOLEAN DEFAULT 0",
            "ALTER TABLE resumes ADD COLUMN file_type VARCHAR",
            "ALTER TABLE resumes ADD COLUMN mime_type VARCHAR",
            "ALTER TABLE resumes ADD COLUMN file_hash VARCHAR",
            "ALTER TABLE resumes ADD COLUMN raw_text TEXT",
            "ALTER TABLE resumes ADD COLUMN clean_text TEXT",
            "ALTER TABLE resumes ADD COLUMN parsed_data_json TEXT",
            "ALTER TABLE resumes ADD COLUMN processing_error TEXT",
            "ALTER TABLE resumes ADD COLUMN processed_at DATETIME",
            "ALTER TABLE resumes ADD COLUMN cleaned_at DATETIME",
            "ALTER TABLE resumes ADD COLUMN parsed_at DATETIME",
            "ALTER TABLE resumes ADD COLUMN ocr_confidence FLOAT",
            "ALTER TABLE resumes ADD COLUMN ocr_processing_time_ms FLOAT",
            "ALTER TABLE resumes ADD COLUMN is_low_confidence BOOLEAN DEFAULT 0",
            "ALTER TABLE resumes ADD COLUMN ocr_provider VARCHAR",
            "ALTER TABLE resumes ADD COLUMN is_active BOOLEAN DEFAULT 1",
            "ALTER TABLE career_preferences ADD COLUMN preferred_countries VARCHAR",
            "ALTER TABLE career_preferences ADD COLUMN preferred_cities VARCHAR",
            "ALTER TABLE career_preferences ADD COLUMN startup_or_enterprise VARCHAR",
            "ALTER TABLE career_preferences ADD COLUMN negotiable_salary BOOLEAN DEFAULT 0",
            "ALTER TABLE ai_preferences ADD COLUMN preferred_learning_resources VARCHAR",
            "ALTER TABLE ai_preferences ADD COLUMN target_countries VARCHAR",
        ]:
            try:
                conn.execute(text(col_def))
                conn.commit()
            except Exception:
                pass


@app.get("/")
def read_root():
    return {"message": "Welcome to the AI Job Finder API"}
