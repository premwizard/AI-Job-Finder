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
from src.api.routers import analytics, applications, resume, saved_jobs, users

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


@app.get("/")
def read_root():
    return {"message": "Welcome to the AI Job Finder API"}
