import json
from sqlalchemy.orm import Session
from app.models.models import Job, JobMatchResult
from app.ai.matching.semantic_matcher import SemanticMatcher
from app.ai.matching.structured_matcher import StructuredMatcher
from app.ai.matching.match_scorer import MatchScorer
from app.ai.matching.match_explainer import MatchExplainer

class JobMatchingService:
    def __init__(self, db: Session):
        self.db = db
        self.semantic = SemanticMatcher(db)
        self.structured = StructuredMatcher(db)
        self.scorer = MatchScorer()
        self.explainer = MatchExplainer()

    def evaluate_job_match(self, user_id: str, job_id: int) -> JobMatchResult:
        # Check cache
        existing = self.db.query(JobMatchResult).filter_by(user_id=user_id, job_id=job_id).first()
        if existing and not existing.is_stale:
            return existing

        job = self.db.query(Job).filter(Job.id == job_id).first()
        if not job:
            raise ValueError("Job not found")

        # Calculate Scores
        semantic_score = self.semantic.get_semantic_score(user_id, job_id)
        struct_data = self.structured.evaluate_job(user_id, job_id)
        
        scores = {
            "semantic_score": semantic_score,
            "skills_score": struct_data["skills_score"],
            "experience_score": struct_data["experience_score"],
            "salary_score": struct_data["salary_score"]
        }
        
        overall = self.scorer.calculate_overall_score(scores)
        
        # Generate Explanations using AI
        matched = struct_data["matched_skills"]
        missing = struct_data["missing_skills"]
        explanations = self.explainer.generate_explanation(job.job_title, overall, matched, missing)
        
        if not existing:
            existing = JobMatchResult(user_id=user_id, job_id=job_id)
            self.db.add(existing)
            
        existing.overall_score = overall
        existing.semantic_score = semantic_score
        existing.skills_score = scores["skills_score"]
        existing.experience_score = scores["experience_score"]
        existing.salary_score = scores["salary_score"]
        existing.matched_skills_json = json.dumps(matched)
        existing.missing_skills_json = json.dumps(missing)
        existing.explanation_summary = explanations["explanation_summary"]
        existing.explanation_missing = explanations["explanation_missing"]
        existing.is_stale = False
        
        self.db.commit()
        return existing

    def recalculate_matches(self, user_id: str):
        # We find all jobs that are AI Processed
        # For a massive database we'd do a two-pass: vector search first to get Top 100, then detailed evaluation.
        # Since this is an MVP, we evaluate the last 50 processed jobs.
        jobs = self.db.query(Job).filter(Job.ai_processed == True).order_by(Job.id.desc()).limit(50).all()
        for job in jobs:
            self.evaluate_job_match(user_id, job.id)
            
    def get_recommended_jobs(self, user_id: str, limit: int = 10):
        # Return jobs ordered by overall_score
        matches = self.db.query(JobMatchResult)\
            .filter(JobMatchResult.user_id == user_id, JobMatchResult.is_stale == False)\
            .order_by(JobMatchResult.overall_score.desc())\
            .limit(limit).all()
            
        results = []
        for match in matches:
            job = self.db.query(Job).filter(Job.id == match.job_id).first()
            if job:
                job_dict = {
                    "id": job.id,
                    "job_title": job.job_title,
                    "company_name": job.company_name,
                    "location": job.location,
                    "overall_score": match.overall_score,
                    "matched_skills": json.loads(match.matched_skills_json or "[]"),
                    "missing_skills": json.loads(match.missing_skills_json or "[]"),
                    "explanation_summary": match.explanation_summary,
                }
                results.append(job_dict)
        return results
