from fastapi import APIRouter, Depends, status, Request
from fastapi_cache.decorator import cache
from app.modules.cache.metrics.cache_metrics import CacheMetrics
from app.modules.cache.invalidations.invalidator import invalidate_namespace
from app.modules.cache.policies.ttl_policies import TTLPolicy
from app.modules.cache.keys.key_builder import custom_key_builder
import time

router = APIRouter(prefix="/api/cache", tags=["Cache Management"])

@router.get("/statistics")
async def get_cache_statistics():
    """
    Returns the real-time cache statistics from the Redis cluster.
    """
    stats = await CacheMetrics.get_statistics()
    return stats

@router.delete("/flush/{namespace}", status_code=status.HTTP_204_NO_CONTENT)
async def flush_namespace(namespace: str):
    """
    Admin endpoint to forcefully flush a cache namespace.
    """
    await invalidate_namespace(namespace)
    return None

# ==========================================
# Proof of Concept: Caching demonstration
# ==========================================

@router.get("/test-cached-endpoint")
@cache(expire=TTLPolicy.SHORT, key_builder=custom_key_builder)
async def test_cached_endpoint(request: Request):
    """
    A test endpoint simulating a heavy computation.
    On the first request, this will take 2 seconds.
    Subsequent requests within 5 minutes will return instantly from Redis.
    """
    # Simulate a heavy DB query or external API call
    time.sleep(2) 
    return {
        "message": "This is a heavy computation result",
        "timestamp": time.time(),
        "cached": "If timestamp doesn't change on reload, caching is working!"
    }
