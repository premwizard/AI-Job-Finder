from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database.database import get_db
from app.agents.orchestrator import Orchestrator
from app.routes.auth_routes import get_current_user
from app.models.models import User, AgentGoal, AgentTask
from pydantic import BaseModel
from typing import List, Optional

router = APIRouter(prefix="/api/agent", tags=["career_agent"])

class CreateGoalRequest(BaseModel):
    title: str
    description: Optional[str] = None

@router.post("/goals")
def create_goal(req: CreateGoalRequest, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    goal = AgentGoal(
        user_id=current_user.id,
        title=req.title,
        description=req.description
    )
    db.add(goal)
    db.commit()
    db.refresh(goal)
    return {"id": goal.id, "title": goal.title, "status": goal.status}

@router.get("/goals")
def list_goals(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    goals = db.query(AgentGoal).filter(AgentGoal.user_id == current_user.id).order_by(AgentGoal.created_at.desc()).all()
    return [{
        "id": g.id,
        "title": g.title,
        "status": g.status,
        "progress": g.progress,
        "created_at": g.created_at
    } for g in goals]

@router.get("/goals/{id}")
def get_goal(id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    goal = db.query(AgentGoal).filter(AgentGoal.id == id, AgentGoal.user_id == current_user.id).first()
    if not goal:
        raise HTTPException(status_code=404, detail="Goal not found")
        
    tasks = db.query(AgentTask).filter(AgentTask.goal_id == id).order_by(AgentTask.priority.asc()).all()
    
    return {
        "id": goal.id,
        "title": goal.title,
        "description": goal.description,
        "status": goal.status,
        "progress": goal.progress,
        "tasks": [{
            "id": t.id,
            "task_type": t.task_type,
            "description": t.description,
            "status": t.status,
            "result_summary": t.result_summary,
            "priority": t.priority
        } for t in tasks]
    }

@router.post("/goals/{id}/plan")
def plan_goal(id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    orch = Orchestrator(db)
    return orch.generate_plan(id, current_user.id)

@router.post("/goals/{id}/execute")
def execute_next(id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    orch = Orchestrator(db)
    return orch.execute_next_task(id, current_user.id)
