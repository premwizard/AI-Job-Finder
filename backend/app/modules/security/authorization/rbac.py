from enum import Enum
from fastapi import HTTPException, status, Request
import logging

logger = logging.getLogger(__name__)

class Role(str, Enum):
    GUEST = "guest"
    USER = "user"
    PREMIUM = "premium"
    MODERATOR = "moderator"
    ADMIN = "admin"
    SUPER_ADMIN = "super_admin"

# Define a strict hierarchy of roles
ROLE_HIERARCHY = {
    Role.GUEST: 0,
    Role.USER: 1,
    Role.PREMIUM: 2,
    Role.MODERATOR: 3,
    Role.ADMIN: 4,
    Role.SUPER_ADMIN: 5
}

def require_role(required_role: Role):
    """
    FastAPI dependency to enforce RBAC.
    """
    def role_checker(request: Request):
        # In a real app, the role is extracted from the JWT token via a get_current_user dependency
        # For this scaffolding, we simulate extraction from a header for testing purposes
        user_role_str = request.headers.get("X-User-Role", "guest")
        
        try:
            user_role = Role(user_role_str.lower())
        except ValueError:
            user_role = Role.GUEST
            
        user_level = ROLE_HIERARCHY.get(user_role, 0)
        required_level = ROLE_HIERARCHY.get(required_role, 999)
        
        if user_level < required_level:
            logger.warning(f"Access Denied: User role '{user_role.value}' attempted to access '{required_role.value}' resource.")
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="You do not have sufficient permissions to access this resource."
            )
        return user_role
        
    return role_checker
