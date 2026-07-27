from fastapi import APIRouter, Depends, status, Request
from app.modules.security.authorization.rbac import require_role, Role
from app.modules.security.rate_limit.limiter import limiter
from app.modules.security.incident.incident_tracker import IncidentTracker

router = APIRouter(prefix="/api/security", tags=["Security & Compliance"])

@router.get("/health", status_code=status.HTTP_200_OK)
@limiter.limit("5/minute")
async def security_health(
    request: Request,
    role: Role = Depends(require_role(Role.ADMIN))
):
    """
    Diagnostic health check for security components.
    Protected by Rate Limiting (5 per minute) and RBAC (Admin only).
    """
    return {
        "status": "secure",
        "rbac_active": True,
        "rate_limiting_active": True,
        "role_detected": role.value
    }

@router.post("/trigger-incident", status_code=status.HTTP_201_CREATED)
async def trigger_test_incident(request: Request):
    """
    Test endpoint to trigger a security incident and verify the audit logs.
    """
    client_ip = request.client.host if request.client else "unknown"
    IncidentTracker.escalate_incident("HIGH", "Manual test incident triggered", client_ip)
    
    return {"message": "Incident logged successfully."}
