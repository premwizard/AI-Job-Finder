from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Dict, Any, Optional

router = APIRouter(prefix="/api/ats", tags=["ats_mcp"])

class SyncRequest(BaseModel):
    providers: Optional[List[str]] = None

class AnalyzeRequest(BaseModel):
    application_id: str

class FollowUpRequest(BaseModel):
    application_id: str

@router.get("/providers")
def get_providers():
    return {"providers": ["Greenhouse", "Lever", "Ashby", "Workday"]}

@router.get("/applications")
def get_applications():
    return {"applications": [
        {"id": "app_1", "company": "Stripe", "role": "Backend Engineer", "stage": "Technical Interview", "provider": "Greenhouse"},
        {"id": "app_2", "company": "Notion", "role": "Fullstack Engineer", "stage": "Recruiter Screen", "provider": "Lever"},
    ]}

@router.get("/application/{application_id}")
def get_application(application_id: str):
    return {
        "id": application_id,
        "company": "Stripe",
        "role": "Backend Engineer",
        "stage": "Technical Interview",
        "provider": "Greenhouse",
        "history": ["Applied", "Recruiter Screen", "Technical Interview"]
    }

@router.post("/sync")
def sync_providers(req: SyncRequest):
    return {"status": "success", "message": "Synchronized 2 providers, found 5 updates"}

@router.post("/analyze")
def analyze_pipeline(req: AnalyzeRequest):
    return {"insights": ["This stage usually takes 3 days. Follow up tomorrow if no response."]}

@router.post("/follow-up")
def generate_follow_up(req: FollowUpRequest):
    return {"draft": "Hi, just checking in on the status of my application..."}

@router.get("/statistics")
def get_statistics():
    return {
        "applications_in_progress": 12,
        "upcoming_interviews": 3,
        "offers": 1,
        "pipeline_health": "Good",
        "response_rate": "65%",
        "average_stage_duration": "4 days",
        "todays_updates": 2
    }
