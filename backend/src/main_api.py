import os
import sys

from fastapi import APIRouter, FastAPI
from fastapi.middleware.cors import CORSMiddleware

# Ensure the backend directory is in the path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

# These routers already carry their full /api/* prefix — include directly on app
from app.routes import auth_routes, profile_routes, settings_routes, social_auth_routes
from src.api.routers import analytics, applications, jobs, resume, saved_jobs, users

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


# Include Routers with /api prefix (src-layer routers without their own /api prefix)
api_router = APIRouter(prefix="/api")
# Note: auth is intentionally excluded here — served by app.routes.auth_routes below
api_router.include_router(users.router)
api_router.include_router(jobs.router)
api_router.include_router(analytics.router)
api_router.include_router(resume.router)
api_router.include_router(saved_jobs.router)
api_router.include_router(applications.router)

app.include_router(api_router)

# These routers each carry their own full /api/* prefix — include directly on app
app.include_router(profile_routes.router)
app.include_router(
    auth_routes.router
)  # /api/auth/* (register, login, verify-email, etc.)
app.include_router(
    social_auth_routes.router
)  # /api/auth/{provider} OAuth redirect flow
app.include_router(settings_routes.router)  # /api/settings/*


@app.get("/")
def read_root():
    return {"message": "Welcome to the AI Job Finder API"}


@app.get("/favicon.ico", include_in_schema=False)
def favicon():
    from fastapi import Response

    return Response(content=b"", media_type="image/x-icon", status_code=204)

from fastapi.staticfiles import StaticFiles

# Ensure the uploads directory exists
os.makedirs("uploads", exist_ok=True)
app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")
