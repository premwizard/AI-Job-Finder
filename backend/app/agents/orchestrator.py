from sqlalchemy.orm import Session
from app.models.models import AgentGoal, AgentTask
from app.agents.planner import Planner
from app.agents.registry.agent_registry import AgentRegistry
from app.agents.context.shared_context import SharedContext
from app.agents.communication.message import Message

# Import workers to register them
from app.agents.workers.resume_agent import ResumeAgent
from app.agents.workers.job_agent import JobSearchAgent
from app.agents.workers.company_agent import CompanyIntelligenceAgent
from app.agents.workers.learning_agent import LearningAgent
from app.agents.workers.interview_agent import InterviewAgent
from app.agents.workers.recommendation_agent import RecommendationAgent
from app.agents.workers.career_strategy_agent import CareerStrategyAgent

from fastapi import HTTPException
from datetime import datetime
import time

class Orchestrator:
    def __init__(self, db: Session):
        self.db = db
        self.planner = Planner()
        self.registry = AgentRegistry()
        
        # Register workers if not already
        if not self.registry.get_all_agents():
            self.registry.register(ResumeAgent())
            self.registry.register(JobSearchAgent())
            self.registry.register(CompanyIntelligenceAgent())
            self.registry.register(LearningAgent())
            self.registry.register(InterviewAgent())
            self.registry.register(RecommendationAgent())
            self.registry.register(CareerStrategyAgent())

    def _route_task(self, task_type: str):
        # Find the agent capable of handling this task
        for agent in self.registry.get_all_agents():
            if task_type in agent.capabilities:
                return agent
        return None

    def generate_plan(self, goal_id: int, user_id: str):
        goal = self.db.query(AgentGoal).filter(AgentGoal.id == goal_id, AgentGoal.user_id == user_id).first()
        if not goal:
            raise HTTPException(status_code=404, detail="Goal not found")
            
        self.db.query(AgentTask).filter(AgentTask.goal_id == goal_id).delete()
        
        goal.status = "planning"
        self.db.commit()
        
        task_definitions = self.planner.create_plan(goal.title, goal.description)
        
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
        start_time = time.time()
        goal = self.db.query(AgentGoal).filter(AgentGoal.id == goal_id, AgentGoal.user_id == user_id).first()
        if not goal:
            raise HTTPException(status_code=404, detail="Goal not found")
            
        next_task = self.db.query(AgentTask).filter(
            AgentTask.goal_id == goal_id,
            AgentTask.status == "pending"
        ).order_by(AgentTask.priority.asc()).first()
        
        if not next_task:
            uncompleted = self.db.query(AgentTask).filter(AgentTask.goal_id == goal_id, AgentTask.status != "completed").count()
            if uncompleted == 0:
                goal.status = "completed"
                goal.progress = 100
                self.db.commit()
                return {"message": "Goal is already complete", "task": None}
            raise HTTPException(status_code=400, detail="No executable tasks found")

        next_task.status = "running"
        self.db.commit()
        
        # Agent Routing
        agent = self._route_task(next_task.task_type)
        if not agent:
            # Fallback for manual or unrecognized tasks
            next_task.status = "completed"
            next_task.result_summary = "Manual task completed."
            next_task.completed_at = datetime.utcnow()
            success = True
            result_str = next_task.result_summary
        else:
            # Multi-Agent Execution
            context = SharedContext(user_id=user_id, goal_id=goal_id)
            message = Message(
                sender="Orchestrator",
                receiver=agent.name,
                task_id=next_task.id,
                goal_id=goal_id,
                payload={"task_type": next_task.task_type, "description": next_task.description}
            )
            
            # Execute
            response_message = agent.execute(context, message)
            
            # Reflect
            result_payload = response_message.metadata.get("result", {})
            reflection = agent.reflect(result_payload)
            success = reflection.get("success", False)
            result_str = result_payload.get("result", "No output generated.")
            
            # Update Agent Stats
            exec_time = time.time() - start_time
            self.registry.update_stats(agent.name, success, exec_time)
            
            if success:
                next_task.status = "completed"
                next_task.result_summary = result_str
                next_task.completed_at = datetime.utcnow()
            else:
                next_task.status = "failed"
                next_task.result_summary = "Task failed: " + result_str
                
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
            "success": success,
            "result": result_str,
            "agent_used": agent.name if agent else "Manual/Fallback"
        }
