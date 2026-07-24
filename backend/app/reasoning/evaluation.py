from sqlalchemy.orm import Session
from app.models.models import AgentGoal, AgentTask, AgentReflection
from typing import Dict, Any

class EvaluationEngine:
    def __init__(self, db: Session):
        self.db = db

    def evaluate_goal_progress(self, goal_id: int) -> Dict[str, Any]:
        goal = self.db.query(AgentGoal).filter(AgentGoal.id == goal_id).first()
        if not goal:
            return {"error": "Goal not found"}
            
        tasks = self.db.query(AgentTask).filter(AgentTask.goal_id == goal_id).all()
        total_tasks = len(tasks)
        completed = len([t for t in tasks if t.status == "completed"])
        failed = len([t for t in tasks if t.status == "failed"])
        
        # Calculate average reflection confidence
        reflections = []
        for t in tasks:
            refs = self.db.query(AgentReflection).filter(AgentReflection.task_id == t.id).all()
            reflections.extend(refs)
            
        avg_confidence = 0.0
        if reflections:
            avg_confidence = sum(r.confidence for r in reflections) / len(reflections)
            
        return {
            "goal_id": goal_id,
            "status": goal.status,
            "progress": goal.progress,
            "total_tasks": total_tasks,
            "completed_tasks": completed,
            "failed_tasks": failed,
            "average_confidence": round(avg_confidence, 2)
        }
