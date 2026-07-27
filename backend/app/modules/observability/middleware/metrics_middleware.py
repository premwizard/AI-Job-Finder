from prometheus_fastapi_instrumentator import Instrumentator
from fastapi import FastAPI
import logging

logger = logging.getLogger(__name__)

def init_metrics(app: FastAPI):
    """
    Initializes Prometheus metrics for FastAPI.
    Automatically exposes the /metrics endpoint.
    """
    try:
        # The instrumentator automatically tracks HTTP requests, latency, and error rates
        instrumentator = Instrumentator(
            should_group_status_codes=False,
            should_ignore_untemplated=True,
            should_instrument_requests_inprogress=True,
            excluded_handlers=["/metrics", "/api/observability/health"],
            env_var_name="ENABLE_METRICS",
            in_progress_name="http_requests_inprogress",
            in_progress_labels=True,
        )
        
        # Setup and expose
        instrumentator.instrument(app).expose(app, include_in_schema=False, route_name="metrics")
        
        logger.info("Prometheus metrics initialized successfully.")
    except Exception as e:
        logger.error(f"Failed to initialize Prometheus metrics: {e}")
