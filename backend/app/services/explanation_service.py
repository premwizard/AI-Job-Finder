import json
from sqlalchemy.orm import Session
from app.models.models import Job, UserProfile, JobRecommendation, JobMatchResult, JobExplanation
from app.ai.explanations.explanation_engine import ExplanationEngine

class ExplanationService:
    def __init__(self, db: Session):
        self.db = db
        self.engine = ExplanationEngine()

    def generate_explanation(self, user_id: str, job_id: int) -> JobExplanation:
        existing = self.db.query(JobExplanation).filter_by(user_id=user_id, job_id=job_id).first()
        if existing and not existing.is_stale:
            return existing

        job = self.db.query(Job).filter(Job.id == job_id).first()
        match = self.db.query(JobMatchResult).filter_by(user_id=user_id, job_id=job_id).first()
        rec = self.db.query(JobRecommendation).filter_by(user_id=user_id, job_id=job_id).first()
        profile = self.db.query(UserProfile).filter_by(user_id=user_id).first()
        
        if not all([job, match, rec, profile]):
            raise ValueError("Incomplete data to generate explanation. Ensure the job is matched and recommended.")

        insights = self.engine.generate_xai_insights(job, match, rec, profile)
        
        if not existing:
            existing = JobExplanation(user_id=user_id, job_id=job_id)
            self.db.add(existing)
            
        existing.overall_summary = insights.get("overall_summary")
        existing.strengths_json = json.dumps(insights.get("strengths", []))
        existing.missing_skills_json = json.dumps(insights.get("missing_skills_analysis", []))
        existing.risk_factors_json = json.dumps(insights.get("risk_factors", []))
        existing.improvement_suggestions_json = json.dumps(insights.get("improvement_suggestions", []))
        existing.career_growth_analysis = insights.get("career_growth_analysis")
        existing.confidence_explanation = insights.get("confidence_explanation")
        existing.confidence_score = rec.confidence_score
        existing.is_stale = False
        
        self.db.commit()
        return existing
        
    def get_explanation(self, user_id: str, job_id: int) -> JobExplanation:
        # Fetch or generate
        return self.generate_explanation(user_id, job_id)
