class PlatformStats:
    """
    Aggregates metrics for the Admin Dashboard.
    In a real application, these would be complex JOINs or Redis metric queries.
    """
    @staticmethod
    async def get_dashboard_overview() -> dict:
        return {
            "health_score": 98,
            "active_users": 1250,
            "new_registrations_today": 42,
            "ai_requests_today": 8430,
            "mcp_providers_active": 3,
            "queue_pending_jobs": 12,
            "queue_failed_jobs": 0,
            "api_avg_latency_ms": 45.2,
            "recent_incidents": 0
        }
