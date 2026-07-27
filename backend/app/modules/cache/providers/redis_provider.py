import os
import redis.asyncio as aioredis
from fastapi_cache import FastAPICache
from fastapi_cache.backends.redis import RedisBackend

# Centralized connection pool instance
redis_client = None

async def init_redis_cache():
    """
    Initializes the connection to Redis and configures fastapi-cache.
    To be called during application startup.
    """
    global redis_client
    redis_url = os.environ.get("REDIS_URL", "redis://localhost:6379/0")
    
    # Establish connection pool
    redis_client = aioredis.from_url(redis_url, encoding="utf8", decode_responses=True)
    
    # Configure FastAPICache with the Redis backend
    FastAPICache.init(RedisBackend(redis_client), prefix="ai_job_finder_cache:")

async def close_redis_cache():
    """
    Closes the Redis connection pool.
    To be called during application shutdown.
    """
    global redis_client
    if redis_client:
        await redis_client.close()
