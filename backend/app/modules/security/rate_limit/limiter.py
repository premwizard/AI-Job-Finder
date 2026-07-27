from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded
from fastapi import FastAPI

# Initialize Limiter using IP address
# In production with load balancers, ensure X-Forwarded-For is properly extracted
limiter = Limiter(key_func=get_remote_address)

def init_rate_limiter(app: FastAPI):
    """
    Attaches the slowapi rate limiter to the FastAPI application instance.
    """
    app.state.limiter = limiter
    app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)
