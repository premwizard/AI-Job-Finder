from fastapi import APIRouter, Depends
from app.routes.auth_routes import get_current_user
from app.models.models import User
from app.agents.registry.agent_registry import AgentRegistry

router = APIRouter(prefix="/api/agents", tags=["multi_agent"])

@router.get("")
def list_agents(current_user: User = Depends(get_current_user)):
    registry = AgentRegistry()
    agents = registry.get_all_agents()
    return [{
        "name": a.name,
        "capabilities": a.capabilities
    } for a in agents]

@router.get("/status")
def agent_status(current_user: User = Depends(get_current_user)):
    registry = AgentRegistry()
    return registry.get_stats()
