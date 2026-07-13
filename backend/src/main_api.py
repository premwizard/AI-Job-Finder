from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import sys
import os

# Ensure the backend directory is in the path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from src.api.routers import jobs, analytics, resume, saved_jobs, auth, users, applications
# Profile router lives in app/ and already carries the full /api/profile prefix
from app.routes import profile_routes

app = FastAPI(
    title="AI Job Finder API",
    description="Backend API for the AI Job Finder application.",
    version="1.0.0"
)

# Configure CORS for Next.js frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

from fastapi import APIRouter

# Include Routers with /api prefix
api_router = APIRouter(prefix="/api")
api_router.include_router(auth.router)
api_router.include_router(users.router)
api_router.include_router(jobs.router)
api_router.include_router(analytics.router)
api_router.include_router(resume.router)
api_router.include_router(saved_jobs.router)
api_router.include_router(applications.router)

app.include_router(api_router)

# Profile router has its own /api/profile prefix, include directly on app
app.include_router(profile_routes.router)

@app.get("/")
def read_root():
    return {"message": "Welcome to the AI Job Finder API"}
