from fastapi import APIRouter, Depends, status, HTTPException
from pydantic import BaseModel

from app.modules.security.authorization.rbac import require_role, Role
from app.modules.admin.analytics.platform_stats import PlatformStats
from app.modules.admin.system.config_manager import ConfigManager
from app.modules.admin.feature_flags.flag_service import FlagService

# All endpoints in this router enforce the ADMIN role
router = APIRouter(
    prefix="/api/v1/admin", 
    tags=["Admin Dashboard"],
    dependencies=[Depends(require_role(Role.ADMIN))]
)

@router.get("/dashboard", status_code=status.HTTP_200_OK)
async def get_dashboard_overview():
    """
    Returns aggregated health and usage statistics for the Admin Dashboard Home.
    """
    stats = await PlatformStats.get_dashboard_overview()
    return stats

@router.get("/system-config", status_code=status.HTTP_200_OK)
async def get_system_config():
    """
    Returns safe, sanitized environment metadata.
    """
    return ConfigManager.get_safe_system_config()

@router.get("/feature-flags", status_code=status.HTTP_200_OK)
async def get_feature_flags():
    """
    Lists all active feature flags.
    """
    return FlagService.get_all_flags()

class FlagUpdateSchema(BaseModel):
    enabled: bool

@router.post("/feature-flags/{flag_name}", status_code=status.HTTP_200_OK)
async def update_feature_flag(flag_name: str, data: FlagUpdateSchema):
    """
    Enables or disables a specific feature flag.
    """
    if flag_name not in FlagService.get_all_flags():
        raise HTTPException(status_code=404, detail="Feature flag not found")
        
    return FlagService.set_flag(flag_name, data.enabled)
