from fastapi_cache import FastAPICache
from app.modules.cache.keys.key_builder import build_entity_key

async def invalidate_entity(entity_type: str, entity_id: str):
    """
    Programmatically invalidate a specific entity cache.
    e.g. invalidate_entity("resume", "123")
    """
    key = build_entity_key(entity_type, entity_id)
    # fastapi_cache backend clear mechanism requires the namespace
    # For a direct key deletion, we can use the raw redis client
    from app.modules.cache.providers.redis_provider import redis_client
    if redis_client:
        await redis_client.delete(key)

async def invalidate_namespace(namespace: str):
    """
    Clear an entire namespace (e.g. all 'jobs' or all 'recommendations')
    """
    await FastAPICache.clear(namespace=namespace)
