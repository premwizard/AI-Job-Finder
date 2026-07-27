from fastapi import Request
from typing import Optional, Callable
from fastapi_cache.coder import Coder

def custom_key_builder(
    func: Callable,
    namespace: Optional[str] = "",
    request: Optional[Request] = None,
    response: Optional[Any] = None,
    args: Optional[tuple] = None,
    kwargs: Optional[dict] = None,
) -> str:
    """
    Standardized key generation for API endpoints.
    Follows convention: {namespace}:{func_name}:{query_params}
    """
    prefix = f"{FastAPICache.get_prefix()}{namespace}:"
    
    # Base key on the function module and name
    cache_key = f"{prefix}{func.__module__}.{func.__name__}"
    
    # If a request is provided, uniquely hash the query parameters to cache distinct results
    if request:
        query_string = request.url.query
        if query_string:
            cache_key += f":{query_string}"
            
    # Note: If specific path parameters are heavily used, 
    # they should be manually defined via kwargs in a custom wrapper.
    
    return cache_key

def build_entity_key(entity_type: str, entity_id: str) -> str:
    """
    Builds a standardized key for programmatic caching.
    E.g., build_entity_key("resume", "123") -> "ai_job_finder_cache:resume:123"
    """
    from fastapi_cache import FastAPICache
    prefix = FastAPICache.get_prefix()
    return f"{prefix}{entity_type}:{entity_id}"
