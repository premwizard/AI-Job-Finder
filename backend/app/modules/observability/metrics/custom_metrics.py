from prometheus_client import Counter, Histogram, Gauge

# Application-specific Custom Metrics

# Track total AI inference requests
ai_requests_total = Counter(
    "ai_job_finder_ai_requests_total",
    "Total number of AI requests made",
    ["agent_type", "status"]
)

# Track latency of AI requests
ai_request_latency_seconds = Histogram(
    "ai_job_finder_ai_request_latency_seconds",
    "Latency of AI requests in seconds",
    ["agent_type"]
)

# Track MCP Provider availability and failures
mcp_provider_failures_total = Counter(
    "ai_job_finder_mcp_failures_total",
    "Total number of failed MCP provider calls",
    ["provider_name"]
)

# Queue depths (can be updated asynchronously by Celery workers)
queue_depth_gauge = Gauge(
    "ai_job_finder_queue_depth",
    "Current number of pending background jobs",
    ["queue_name"]
)
