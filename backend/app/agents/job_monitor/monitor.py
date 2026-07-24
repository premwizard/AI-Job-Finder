from sqlalchemy.orm import Session
from typing import Dict, Any
from app.models.models import Opportunity
from app.agents.job_monitor.search import SearchStrategy
from app.agents.job_monitor.deduplication import DuplicateDetector
from app.agents.job_monitor.evaluation import OpportunityEvaluator

class JobMonitorAgent:
    def __init__(self, db: Session):
        self.db = db
        self.search = SearchStrategy(db)
        self.dedup = DuplicateDetector(db)
        self.evaluator = OpportunityEvaluator()

    def run_cycle(self, user_id: str) -> Dict[str, Any]:
        jobs = self.search.discover_jobs()
        
        new_opportunities = 0
        duplicates = 0
        
        for job in jobs:
            if self.dedup.is_duplicate(user_id, job.id):
                duplicates += 1
                continue
                
            # Evaluate
            eval_result = self.evaluator.evaluate(job.title, {})
            
            # Persist
            opp = Opportunity(
                user_id=user_id,
                job_id=job.id,
                match_score=eval_result.get("match_score", 0.0),
                category=eval_result.get("category", "Unknown"),
                reasoning=eval_result.get("reasoning", "")
            )
            self.db.add(opp)
            new_opportunities += 1
            
        self.db.commit()
        
        return {
            "jobs_evaluated": len(jobs),
            "duplicates_filtered": duplicates,
            "new_opportunities": new_opportunities
        }
