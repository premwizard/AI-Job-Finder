from app.modules.cache.providers.redis_provider import redis_client

class CacheMetrics:
    """
    Simple wrapper to fetch raw memory and hit/miss statistics from Redis.
    In a true production system, these are scraped via prometheus-redis-exporter.
    """
    @staticmethod
    async def get_statistics():
        if not redis_client:
            return {"status": "disconnected"}
            
        info = await redis_client.info("stats")
        memory = await redis_client.info("memory")
        
        return {
            "status": "connected",
            "hits": info.get("keyspace_hits", 0),
            "misses": info.get("keyspace_misses", 0),
            "memory_used_human": memory.get("used_memory_human", "0B"),
            "evicted_keys": info.get("evicted_keys", 0)
        }
