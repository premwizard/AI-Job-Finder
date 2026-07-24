from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import func
from app.database.database import get_db
from app.routes.auth_routes import get_current_user
from app.models.models import User, Opportunity, Job
from app.agents.job_monitor.monitor import JobMonitorAgent
from pydantic import BaseModel

router = APIRouter(prefix="/api/job-monitor", tags=["job-monitor"])

class StatusUpdateRequest(BaseModel):
    status: str

@router.post("/monitor")
def run_monitor(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    agent = JobMonitorAgent(db)
    return agent.run_cycle(current_user.id)

@router.get("/opportunities")
def list_opportunities(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    opportunities = db.query(Opportunity, Job).join(Job, Opportunity.job_id == Job.id).filter(
        Opportunity.user_id == current_user.id
    ).order_by(Opportunity.match_score.desc()).all()
    
    return [{
        "id": opp.id,
        "job_id": job.id,
        "title": job.title,
        "company": job.company,
        "location": job.location,
        "salary": job.salary,
        "match_score": opp.match_score,
        "category": opp.category,
        "reasoning": opp.reasoning,
        "status": opp.status,
        "posted_date": job.posted_date
    } for opp, job in opportunities]

@router.patch("/opportunities/{id}")
def update_opportunity(id: int, req: StatusUpdateRequest, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    opp = db.query(Opportunity).filter(Opportunity.id == id, Opportunity.user_id == current_user.id).first()
    if not opp:
        raise HTTPException(status_code=404, detail="Opportunity not found")
        
    opp.status = req.status
    db.commit()
    return {"message": "Status updated"}

@router.get("/statistics")
def get_statistics(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    total = db.query(Opportunity).filter(Opportunity.user_id == current_user.id).count()
    saved = db.query(Opportunity).filter(Opportunity.user_id == current_user.id, Opportunity.status == "saved").count()
    ignored = db.query(Opportunity).filter(Opportunity.user_id == current_user.id, Opportunity.status == "ignored").count()
    perfect_matches = db.query(Opportunity).filter(Opportunity.user_id == current_user.id, Opportunity.category == "Perfect Match").count()
    avg_score = db.query(func.avg(Opportunity.match_score)).filter(Opportunity.user_id == current_user.id).scalar() or 0.0
    
    return {
        "total_opportunities": total,
        "saved_opportunities": saved,
        "ignored_opportunities": ignored,
        "perfect_matches": perfect_matches,
        "average_score": round(avg_score, 2)
    }
