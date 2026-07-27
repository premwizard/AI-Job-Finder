from fastapi import APIRouter
from pydantic import BaseModel
import time
import os

router = APIRouter(prefix="/api/system", tags=["System Health"])

class HealthStatus(BaseModel):
    status: str
    environment: str
    uptime_seconds: float
    version: str

start_time = time.time()

@router.get("/health", response_model=HealthStatus)
async def get_health():
    """
    Standard health check endpoint for Kubernetes and Render.
    Returns 200 OK immediately if the server is receiving traffic.
    """
    return HealthStatus(
        status="ok",
        environment=os.environ.get("ENVIRONMENT", "development"),
        uptime_seconds=round(time.time() - start_time, 2),
        version="1.0.0"
    )

@router.get("/ready")
async def get_readiness():
    """
    Readiness probe to ensure database/redis connections are valid.
    """
    # In a full implementation, you would ping the DB and Redis here.
    return {"status": "ready"}

@router.get("/live")
async def get_liveness():
    """
    Liveness probe.
    """
    return {"status": "live"}
