from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Dict, Any, Optional

router = APIRouter(prefix="/api/copilot", tags=["copilot"])

class GoalCreate(BaseModel):
    title: str
    target_date: str

class PlanRequest(BaseModel):
    goal_id: str

@router.get("/dashboard")
def get_dashboard():
    return {
        "health_score": 82,
        "recommendations": [
            "Follow up with the recruiter from Stripe (it has been 7 days).",
            "Update your Resume: Add 'Next.js' to match your target job profile."
        ],
        "tasks": [
            {"id": "t1", "title": "Complete Portfolio Project", "status": "In Progress", "priority": "High"},
            {"id": "t2", "title": "Apply to 5 jobs", "status": "Pending", "priority": "Medium"}
        ],
        "recent_decisions": [
            "Auto-filed application to Google because it matched >90% of preferences.",
            "Drafted follow-up email for Acme Corp."
        ]
    }

@router.get("/goals")
def get_goals():
    return {"goals": [
        {"id": "g1", "title": "Become a Senior AI Engineer", "progress": 65, "status": "On Track"},
        {"id": "g2", "title": "Increase Compensation to $250k+", "progress": 40, "status": "At Risk"}
    ]}

@router.post("/goals")
def create_goal(req: GoalCreate):
    return {"status": "success", "goal_id": "g3"}

@router.patch("/goals/{goal_id}")
def update_goal(goal_id: str, updates: Dict[str, Any]):
    return {"status": "success"}

@router.delete("/goals/{goal_id}")
def delete_goal(goal_id: str):
    return {"status": "success"}

@router.post("/plan")
def generate_plan(req: PlanRequest):
    return {"status": "success", "plan_id": "p123", "message": "Copilot is analyzing your goal and creating a roadmap."}

@router.post("/review")
def run_weekly_review():
    return {
        "summary": "This week you applied to 12 jobs and had 1 interview. Your portfolio views increased by 15%.",
        "health_delta": "+3 points",
        "missed_opportunities": ["Did not send follow-up to Google recruiter."]
    }

@router.post("/reflection")
def run_reflection():
    return {"reflection": "Interview post-mortem completed. Key takeaway: Improve system design knowledge."}

@router.post("/recommendations")
def get_recommendations():
    return {"recommendations": ["Wait for Stripe offer before replying to Acme Corp."]}

@router.get("/statistics")
def get_statistics():
    return {
        "goals_completed": 4,
        "health_trend": "Improving",
        "automation_usage": "15 actions taken this month",
        "recommendations_accepted": 12
    }
