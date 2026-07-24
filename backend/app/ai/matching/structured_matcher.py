import json
from typing import List, Dict, Any, Tuple
from sqlalchemy.orm import Session
from app.models.models import Job, UserProfile, Skill

class StructuredMatcher:
    def __init__(self, db: Session):
        self.db = db

    def extract_skills_match(self, user_skills: List[str], job_skills: List[str]) -> Tuple[List[str], List[str]]:
        """Returns (matched_skills, missing_skills)"""
        if not job_skills:
            return [], []
            
        user_skills_lower = [s.lower().strip() for s in user_skills]
        job_skills_lower = [s.lower().strip() for s in job_skills]
        
        matched = []
        missing = []
        
        for i, js in enumerate(job_skills_lower):
            if js in user_skills_lower:
                matched.append(job_skills[i])
            else:
                missing.append(job_skills[i])
                
        return matched, missing

    def get_skills_score(self, matched: List[str], missing: List[str]) -> float:
        total = len(matched) + len(missing)
        if total == 0:
            return 100.0 # No skills required
        return round((len(matched) / total) * 100, 2)

    def get_experience_score(self, user_months: int, job_data: dict) -> float:
        # Default if no specific requirement
        if not user_months:
            return 50.0
            
        # Very naive heuristic for now.
        # Can be expanded based on the job's AI parsed experience level requirement.
        return 100.0

    def get_salary_score(self, expected_salary: str, job_data: dict) -> float:
        # Fallback to high score if not provided
        return 100.0

    def evaluate_job(self, user_id: str, job_id: int) -> Dict[str, Any]:
        job = self.db.query(Job).filter(Job.id == job_id).first()
        if not job or not job.parsed_data_json:
            return {"skills_score": 0, "matched": [], "missing": []}
            
        try:
            job_data = json.loads(job.parsed_data_json)
        except json.JSONDecodeError:
            return {"skills_score": 0, "matched": [], "missing": []}
            
        skills = self.db.query(Skill).filter(Skill.user_id == user_id).all()
        user_skill_names = [s.skill_name for s in skills]
        
        # Collect job skills
        job_reqs = job_data.get("technical_skills", {})
        all_job_skills = []
        if isinstance(job_reqs, dict):
            for cat, s_list in job_reqs.items():
                if isinstance(s_list, list):
                    all_job_skills.extend(s_list)
        elif isinstance(job_reqs, list):
            all_job_skills.extend(job_reqs)
            
        matched, missing = self.extract_skills_match(user_skill_names, all_job_skills)
        skills_score = self.get_skills_score(matched, missing)
        
        profile = self.db.query(UserProfile).filter(UserProfile.user_id == user_id).first()
        user_months = profile.total_months_of_experience if profile else 0
        exp_score = self.get_experience_score(user_months, job_data)
        
        return {
            "skills_score": skills_score,
            "matched_skills": matched,
            "missing_skills": missing,
            "experience_score": exp_score,
            "salary_score": 100.0
        }
