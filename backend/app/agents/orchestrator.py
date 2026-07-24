from sqlalchemy.orm import Session
from app.models.models import AgentGoal, AgentTask
from app.agents.planner import Planner
from app.agents.executor import Executor
from app.agents.reflection import Reflection
from fastapi import HTTPException
from datetime import datetime

class Orchestrator:
    def __init__(self, db: Session):
        self.db = db
        self.planner = Planner()
        self.executor = Executor(db)
        self.reflection = Reflection()

    def generate_plan(self, goal_id: int, user_id: str):
        goal = self.db.query(AgentGoal).filter(AgentGoal.id == goal_id, AgentGoal.user_id == user_id).first()
        if not goal:
            raise HTTPException(status_code=404, detail="Goal not found")
            
        # Clean existing pending tasks if regenerating
        self.db.query(AgentTask).filter(AgentTask.goal_id == goal_id).delete()
        
        goal.status = "planning"
        self.db.commit()
        
        # 1. Plan
        task_definitions = self.planner.create_plan(goal.title, goal.description)
        
        # 2. Persist Tasks
        priority = 1
        for td in task_definitions:
            task = AgentTask(
                goal_id=goal.id,
                task_type=td.get("task_type", "MANUAL_ACTION"),
                description=td.get("description", "Agent task"),
                priority=priority
            )
            self.db.add(task)
            priority += 1
            
        goal.status = "active"
        self.db.commit()
        
        return {"message": "Plan generated successfully"}
        
    def execute_next_task(self, goal_id: int, user_id: str):
        goal = self.db.query(AgentGoal).filter(AgentGoal.id == goal_id, AgentGoal.user_id == user_id).first()
        if not goal:
            raise HTTPException(status_code=404, detail="Goal not found")
            
        # Find next pending task ordered by priority
        next_task = self.db.query(AgentTask).filter(
            AgentTask.goal_id == goal_id,
            AgentTask.status == "pending"
        ).order_by(AgentTask.priority.asc()).first()
        
        if not next_task:
            # Check if all completed
            uncompleted = self.db.query(AgentTask).filter(AgentTask.goal_id == goal_id, AgentTask.status != "completed").count()
            if uncompleted == 0:
                goal.status = "completed"
                goal.progress = 100
                self.db.commit()
                return {"message": "Goal is already complete", "task": None}
            raise HTTPException(status_code=400, detail="No executable tasks found")

        # 1. Execute
        next_task.status = "running"
        self.db.commit()
        
        execution_result = self.executor.execute_task(next_task)
        
        # 2. Reflect
        reflection = self.reflection.evaluate_task(execution_result)
        
        # 3. Update State
        if reflection["success"]:
            next_task.status = "completed"
            next_task.result_summary = execution_result["result"]
            next_task.completed_at = datetime.utcnow()
        else:
            next_task.status = "failed"
            next_task.result_summary = reflection["reflection_note"]
            
        # Update goal progress
        total_tasks = self.db.query(AgentTask).filter(AgentTask.goal_id == goal_id).count()
        completed_tasks = self.db.query(AgentTask).filter(AgentTask.goal_id == goal_id, AgentTask.status == "completed").count()
        if total_tasks > 0:
            goal.progress = int((completed_tasks / total_tasks) * 100)
            if completed_tasks == total_tasks:
                goal.status = "completed"
                
        self.db.commit()
        
        return {
            "message": "Task execution completed",
            "task_id": next_task.id,
            "success": reflection["success"],
            "result": execution_result["result"]
        }
