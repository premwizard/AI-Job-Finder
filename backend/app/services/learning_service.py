import json
from sqlalchemy.orm import Session
from app.models.models import Job, JobRecommendation, JobExplanation, JobMatchResult, JobLearningRoadmap
from app.ai.learning.learning_engine import LearningEngine

class LearningService:
    def __init__(self, db: Session):
        self.db = db
        self.engine = LearningEngine()

    def generate_learning_roadmap(self, user_id: str, job_id: int) -> JobLearningRoadmap:
        existing = self.db.query(JobLearningRoadmap).filter_by(user_id=user_id, job_id=job_id).first()
        if existing and not existing.is_stale:
            return existing

        job = self.db.query(Job).filter(Job.id == job_id).first()
        match = self.db.query(JobMatchResult).filter_by(user_id=user_id, job_id=job_id).first()
        rec = self.db.query(JobRecommendation).filter_by(user_id=user_id, job_id=job_id).first()
        exp = self.db.query(JobExplanation).filter_by(user_id=user_id, job_id=job_id).first()
        
        if not all([job, match, rec, exp]):
            raise ValueError("Incomplete data to generate roadmap. Ensure the job has an AI Explanation generated.")

        roadmap_data = self.engine.generate_learning_roadmap(job, match, rec, exp)
        
        if not existing:
            existing = JobLearningRoadmap(user_id=user_id, job_id=job_id)
            self.db.add(existing)
            
        existing.roadmap_json = json.dumps(roadmap_data.get("roadmap", []))
        existing.projected_improvements_json = json.dumps(roadmap_data.get("projected_improvements", []))
        existing.career_growth_insights_json = json.dumps(roadmap_data.get("career_growth_insights", {}))
        existing.is_stale = False
        
        self.db.commit()
        return existing
        
    def get_roadmap(self, user_id: str, job_id: int) -> JobLearningRoadmap:
        # Fetch or generate
        return self.generate_learning_roadmap(user_id, job_id)
