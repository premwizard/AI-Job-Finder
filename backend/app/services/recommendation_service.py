import json
from sqlalchemy.orm import Session
from app.models.models import Job, JobMatchResult, JobRecommendation
from app.ai.recommendations.ranking_engine import RankingEngine
from app.ai.recommendations.career_growth import CareerGrowthCalculator
from app.ai.recommendations.recommendation_explainer import RecommendationExplainer

class RecommendationService:
    def __init__(self, db: Session):
        self.db = db
        self.ranking = RankingEngine()
        self.growth = CareerGrowthCalculator()
        self.explainer = RecommendationExplainer()

    def generate_recommendation(self, user_id: str, job_id: int) -> JobRecommendation:
        # Check cache
        existing = self.db.query(JobRecommendation).filter_by(user_id=user_id, job_id=job_id).first()
        if existing and not existing.is_stale:
            return existing

        match = self.db.query(JobMatchResult).filter_by(user_id=user_id, job_id=job_id).first()
        if not match:
            # We must run Semantic Matching first if not found
            from app.services.job_matching_service import JobMatchingService
            match_service = JobMatchingService(self.db)
            match = match_service.evaluate_job_match(user_id, job_id)

        job = self.db.query(Job).filter(Job.id == job_id).first()
        if not job:
            raise ValueError("Job not found")

        # Extract data from match
        missing_skills = json.loads(match.missing_skills_json or "[]")
        matched_skills = json.loads(match.matched_skills_json or "[]")
        
        # 1. Career Growth Score
        growth_score = self.growth.calculate_growth_score(missing_skills, matched_skills)
        
        # 2. Ranking Factors
        factors = {
            "semantic_score": match.semantic_score or 0.0,
            "preferences_score": 80.0, # Mocked for MVP
            "behavior_score": 75.0,    # Mocked for MVP
            "career_growth_score": growth_score,
            "freshness_score": 90.0,   # Mocked for MVP
            "compensation_score": match.salary_score or 50.0,
            "company_score": 85.0      # Mocked for MVP
        }
        
        # 3. Overall Recommendation Score
        recommendation_score = self.ranking.calculate_recommendation(factors)
        category = self.ranking.categorize_score(recommendation_score)
        
        # Confidence Score (can be based on the amount of data we have)
        confidence_score = 92.5 # Mocked for MVP
        
        # 4. Generate Explanations
        explanations = self.explainer.generate_explanation(job.job_title, recommendation_score, matched_skills, missing_skills, growth_score)
        
        if not existing:
            existing = JobRecommendation(user_id=user_id, job_id=job_id)
            self.db.add(existing)
            
        existing.recommendation_score = recommendation_score
        existing.confidence_score = confidence_score
        existing.career_growth_score = growth_score
        existing.category = category
        existing.explanation_strengths_json = json.dumps(explanations["strengths"])
        existing.explanation_weaknesses_json = json.dumps(explanations["weaknesses"])
        existing.explanation_summary = explanations["summary"]
        existing.is_stale = False
        
        self.db.commit()
        return existing

    def refresh_recommendations(self, user_id: str):
        # Find all recently matched jobs and upgrade them to recommendations
        matches = self.db.query(JobMatchResult).filter_by(user_id=user_id).order_by(JobMatchResult.overall_score.desc()).limit(30).all()
        for match in matches:
            self.generate_recommendation(user_id, match.job_id)
            
    def get_recommendations(self, user_id: str, limit: int = 20):
        recs = self.db.query(JobRecommendation)\
            .filter(JobRecommendation.user_id == user_id, JobRecommendation.is_stale == False)\
            .order_by(JobRecommendation.recommendation_score.desc())\
            .limit(limit).all()
            
        results = []
        for rec in recs:
            job = self.db.query(Job).filter(Job.id == rec.job_id).first()
            match = self.db.query(JobMatchResult).filter_by(user_id=user_id, job_id=rec.job_id).first()
            
            if job and match:
                job_dict = {
                    "id": job.id,
                    "job_title": job.job_title,
                    "company_name": job.company_name,
                    "location": job.location,
                    "recommendation_score": rec.recommendation_score,
                    "semantic_score": match.semantic_score,
                    "career_growth_score": rec.career_growth_score,
                    "confidence_score": rec.confidence_score,
                    "category": rec.category,
                    "matched_skills": json.loads(match.matched_skills_json or "[]"),
                    "missing_skills": json.loads(match.missing_skills_json or "[]"),
                    "strengths": json.loads(rec.explanation_strengths_json or "[]"),
                    "weaknesses": json.loads(rec.explanation_weaknesses_json or "[]"),
                    "explanation_summary": rec.explanation_summary,
                }
                results.append(job_dict)
        return results
