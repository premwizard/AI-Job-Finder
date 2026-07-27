from fastapi import APIRouter, status
import logging
from app.modules.observability.metrics.custom_metrics import ai_requests_total, ai_request_latency_seconds

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api/observability", tags=["Observability"])

@router.get("/health", status_code=status.HTTP_200_OK)
async def observability_health():
    """
    Diagnostic health check for the observability components.
    """
    # In a full system, this would ping Prometheus/Grafana/OTel endpoints.
    return {
        "status": "healthy",
        "tracing": "active",
        "metrics_endpoint": "/metrics"
    }

@router.post("/test-ai-metric")
async def test_ai_metric():
    """
    Proof-of-concept endpoint to demonstrate custom Prometheus metrics.
    """
    # Simulate an AI request
    with ai_request_latency_seconds.labels(agent_type="career_copilot").time():
        logger.info("Processing simulated AI request...")
        # (simulated work happens here)
        ai_requests_total.labels(agent_type="career_copilot", status="success").inc()
    
    return {"message": "Custom metric recorded."}
