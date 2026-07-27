import os
import sys

from fastapi import FastAPI, Response, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.gzip import GZipMiddleware
from uvicorn.middleware.proxy_headers import ProxyHeadersMiddleware

# Ensure the backend directory is in the path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.routes import (
    auth_routes,
    jobs_routes,
    job_parsing_routes,
    job_embedding_routes,
    job_matching_routes,
    recommendation_routes,
    explanation_routes,
    learning_routes,
    rag_routes,
    chat_routes,
    search_routes,
    company_routes,
    resume_optimize_routes,
    agent_routes,
    multi_agent_routes,
    memory_routes,
    planner_routes,
    tool_routes,
    job_monitor_routes,
    profile_routes,
    settings_routes,
    social_auth_routes,
    skill_gap_routes,
    version_routes,
    embedding_routes,
    mcp_routes,
    github_mcp_routes,
    gmail_mcp_routes,
    calendar_mcp_routes,
    drive_mcp_routes,
    orchestrator_routes,
    ats_mcp_routes,
    crm_routes,
    salary_routes,
    copilot_routes,
)

from app.modules.auth.controllers import auth_controller as auth_v2_controller
from app.modules.queue.controllers import queue_controller
from app.modules.cache.controllers import cache_controller
from app.modules.observability.controllers import observability_controller
from app.modules.security.controllers import security_controller
from app.modules.admin.controllers import admin_controller
from app.modules.billing.controllers import billing_controller
from app.modules.system.controllers import health_controller
from app.modules.cache.providers.redis_provider import init_redis_cache, close_redis_cache
from app.modules.observability.logging.structured_logger import structured_logger
from app.modules.observability.tracing.tracer import init_tracer
from app.modules.observability.middleware.metrics_middleware import init_metrics
from app.modules.security.middleware.security_headers import security_headers_middleware
from app.modules.security.rate_limit.limiter import init_rate_limiter
from app.shared.logger.logger import app_logger
import time

app = FastAPI(
    title="Crown Atlas API",
    description="Backend API for the Crown Atlas application.",
    version="1.0.0",
)

# Initialize OpenTelemetry Tracing
init_tracer(app)

# Initialize Prometheus Metrics (Exposes /metrics)
init_metrics(app)

# Initialize Rate Limiting
init_rate_limiter(app)

# Configure CORS for Next.js frontend
# Add TrustProxy middleware for Render rate limiting accuracy
app.add_middleware(ProxyHeadersMiddleware, trusted_hosts="*")

# Add Gzip compression for performance
app.add_middleware(GZipMiddleware, minimum_size=1000)

cors_origins_env = os.environ.get("CORS_ORIGINS", "http://localhost:3000")
cors_origins = [origin.strip() for origin in cors_origins_env.split(",") if origin.strip()]

app.add_middleware(
    CORSMiddleware,
    allow_origins=cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Add Security Headers Middleware
from starlette.middleware.base import BaseHTTPMiddleware
app.add_middleware(BaseHTTPMiddleware, dispatch=security_headers_middleware)

@app.middleware("http")
async def log_requests(request: Request, call_next):
    start_time = time.time()
    response = await call_next(request)
    process_time = time.time() - start_time
    structured_logger.info(
        f"{request.method} {request.url.path} completed in {process_time:.4f}s",
        extra={
            "http.method": request.method,
            "http.url": str(request.url),
            "http.status_code": response.status_code,
            "http.duration_seconds": process_time
        }
    )
    return response

# Include Routers
app.include_router(auth_routes.router)
app.include_router(social_auth_routes.router)
app.include_router(jobs_routes.router)
app.include_router(job_parsing_routes.router)
app.include_router(job_embedding_routes.router)
app.include_router(job_matching_routes.router)
app.include_router(recommendation_routes.router)
app.include_router(explanation_routes.router)
app.include_router(learning_routes.router)
app.include_router(rag_routes.router)
app.include_router(chat_routes.router)
app.include_router(search_routes.router)
app.include_router(company_routes.router)
app.include_router(resume_optimize_routes.router)
app.include_router(agent_routes.router)
app.include_router(multi_agent_routes.router)
app.include_router(memory_routes.router)
app.include_router(planner_routes.router)
app.include_router(tool_routes.router)
app.include_router(job_monitor_routes.router)
app.include_router(profile_routes.router)
app.include_router(settings_routes.router)
app.include_router(skill_gap_routes.router)
app.include_router(version_routes.router)
app.include_router(embedding_routes.router)
app.include_router(mcp_routes.router)
app.include_router(github_mcp_routes.router)
app.include_router(gmail_mcp_routes.router)
app.include_router(calendar_mcp_routes.router)
app.include_router(drive_mcp_routes.router)
app.include_router(orchestrator_routes.router)
app.include_router(ats_mcp_routes.router)
app.include_router(crm_routes.router)
app.include_router(salary_routes.router)
app.include_router(copilot_routes.router)

# V2 Modular Routers
app.include_router(auth_v2_controller.router)
app.include_router(queue_controller.router)
app.include_router(cache_controller.router)
app.include_router(observability_controller.router)
app.include_router(security_controller.router)
app.include_router(admin_controller.router)
app.include_router(billing_controller.router)
app.include_router(health_controller.router)

# Legacy routers removed because they use outdated schemas and cause 500 errors.
# Frontend should use the new features/ API paths (e.g. /api/auth/me, /api/profile/analytics)


from fastapi.staticfiles import StaticFiles

# Ensure the uploads directory exists
os.makedirs("uploads", exist_ok=True)
app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")

@app.get("/favicon.ico", include_in_schema=False)
def favicon():
    return Response(status_code=204)

from app.database.database import engine, Base
from sqlalchemy import text

@app.on_event("startup")
async def startup_event():
    # Initialize caching
    try:
        await init_redis_cache()
        app_logger.info("Redis cache initialized successfully.")
    except Exception as e:
        app_logger.error(f"Failed to initialize Redis cache: {e}")

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

@app.on_event("shutdown")
async def shutdown_event():
    await close_redis_cache()


@app.get("/")
def read_root():
    return {"message": "Welcome to the Crown Atlas API"}

@app.get("/api/v1/health")
def health_check():
    return {
        "status": "ok",
        "service": "Crown Atlas API",
        "version": "1.0.0",
        "components": {
            "database": "connected",
            "mcp": "ready"
        }
    }
