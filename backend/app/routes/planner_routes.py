from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database.database import get_db
from app.reasoning.planner import CognitivePlanner
from app.reasoning.decision import DecisionEngine
from app.reasoning.reflection import ReflectionEngine
from app.reasoning.evaluation import EvaluationEngine
from app.routes.auth_routes import get_current_user
from app.models.models import User, AgentGoal, AgentTask, AgentReflection, AgentDecision
from pydantic import BaseModel
from typing import List, Optional

router = APIRouter(prefix="/api/planner", tags=["planner"])

class GoalRequest(BaseModel):
    goal_id: int

class DecisionRequest(BaseModel):
    goal_id: int
    question: str

@router.post("/create")
def create_plan(req: GoalRequest, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    goal = db.query(AgentGoal).filter(AgentGoal.id == req.goal_id, AgentGoal.user_id == current_user.id).first()
    if not goal:
        raise HTTPException(status_code=404, detail="Goal not found")
        
    planner = CognitivePlanner()
    plan = planner.generate_plan(current_user.id, goal.title, goal.description)
    
    # Clear old tasks
    db.query(AgentTask).filter(AgentTask.goal_id == goal.id).delete()
    
    # Save new tasks
    for td in plan.get("tasks", []):
        t = AgentTask(
            goal_id=goal.id,
            task_type=td.get("task_type"),
            description=td.get("description"),
            priority=td.get("priority", 1),
            max_retries=3
        )
        db.add(t)
        
    goal.status = "active"
    db.commit()
    return {"message": "Plan generated", "risk_level": plan.get("risk_level"), "tasks_count": len(plan.get("tasks", []))}

@router.post("/decision")
def make_decision(req: DecisionRequest, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    engine = DecisionEngine()
    result = engine.make_decision(current_user.id, req.question)
    
    dec = AgentDecision(
        goal_id=req.goal_id,
        question=req.question,
        decision=result.get("decision", ""),
        reasoning=result.get("reasoning", ""),
        confidence=result.get("confidence", 0.0),
        alternatives_considered=result.get("alternatives_considered", "")
    )
    db.add(dec)
    db.commit()
    return result

@router.get("/evaluate/{goal_id}")
def evaluate_plan(goal_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    engine = EvaluationEngine(db)
    return engine.evaluate_goal_progress(goal_id)

@router.get("/history/{goal_id}")
def get_history(goal_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    decisions = db.query(AgentDecision).filter(AgentDecision.goal_id == goal_id).all()
    
    tasks = db.query(AgentTask).filter(AgentTask.goal_id == goal_id).all()
    task_ids = [t.id for t in tasks]
    reflections = db.query(AgentReflection).filter(AgentReflection.task_id.in_(task_ids)).all()
    
    return {
        "decisions": [{
            "question": d.question,
            "decision": d.decision,
            "confidence": d.confidence
        } for d in decisions],
        "reflections": [{
            "task_id": r.task_id,
            "success": r.success,
            "reasoning": r.reasoning,
            "mitigation": r.mitigation
        } for r in reflections]
    }
