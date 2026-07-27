import secure
from fastapi import Request

# Define the security headers
secure_headers = secure.Secure(
    server=secure.Server().set("AIJobFinder"),
    hsts=secure.StrictTransportSecurity().include_subdomains().preload().max_age(31536000),
    xfo=secure.XFrameOptions().sameorigin(),
    xxp=secure.XXSSProtection().set("1; mode=block"),
    content=secure.XContentTypeOptions().nosniff(),
    referrer=secure.ReferrerPolicy().strict_origin_when_cross_origin(),
    # In a full production setup, CSP should be strictly defined.
    # We use a permissive policy for local development to not block Next.js.
    csp=secure.ContentSecurityPolicy().default_src("'self'").frame_ancestors("'none'"),
    cache=secure.CacheControl().must_revalidate()
)

async def security_headers_middleware(request: Request, call_next):
    """
    Middleware that intercepts all responses and injects standard 
    OWASP recommended HTTP Security Headers.
    """
    response = await call_next(request)
    secure_headers.framework.fastapi(response)
    return response
