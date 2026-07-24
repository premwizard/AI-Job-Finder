from sqlalchemy.orm import Session
from sqlalchemy import func, or_, desc
from app.models.models import Job, JobLocation, JobSkill, JobRequirement, JobBenefit
from typing import List, Optional, Tuple, Dict
from datetime import date

class JobRepository:
    def __init__(self, db: Session):
        self.db = db

    def get_job_by_id(self, job_id: int) -> Optional[Job]:
        return self.db.query(Job).filter(Job.id == job_id).first()

    def get_job_by_hash(self, job_hash: str) -> Optional[Job]:
        return self.db.query(Job).filter(Job.job_hash == job_hash).first()

    def get_jobs(
        self,
        skip: int = 0,
        limit: int = 20,
        search: Optional[str] = None,
        company: Optional[str] = None,
        role: Optional[str] = None,
        location: Optional[str] = None,
        is_remote: Optional[bool] = None,
        source: Optional[str] = None
    ) -> Tuple[int, List[Job]]:
        query = self.db.query(Job)

        if search:
            query = query.filter(
                or_(
                    Job.job_title.ilike(f"%{search}%"),
                    Job.company_name.ilike(f"%{search}%"),
                    Job.description_clean.ilike(f"%{search}%")
                )
            )
        
        if company:
            query = query.filter(Job.company_name.ilike(f"%{company}%"))
            
        if role:
            query = query.filter(Job.job_title.ilike(f"%{role}%"))
            
        if location:
            query = query.join(JobLocation).filter(
                or_(
                    JobLocation.city.ilike(f"%{location}%"),
                    JobLocation.country.ilike(f"%{location}%")
                )
            )

        if is_remote is not None:
            # Requires outerjoin or similar if locations exist, but we can do it via a simple filter if we joined JobLocation
            # For simplicity, if we haven't joined yet:
            if not location:
                query = query.join(JobLocation)
            query = query.filter(JobLocation.is_remote == is_remote)

        if source:
            query = query.filter(Job.source == source)

        total = query.count()
        jobs = query.order_by(desc(Job.collected_date)).offset(skip).limit(limit).all()
        return total, jobs

    def create_job(self, job_data: dict, locations: List[dict] = [], skills: List[dict] = [], requirements: List[str] = [], benefits: List[str] = []) -> Job:
        new_job = Job(**job_data)
        self.db.add(new_job)
        self.db.flush() # To get the ID
        
        for loc in locations:
            self.db.add(JobLocation(job_id=new_job.id, **loc))
            
        for skill in skills:
            self.db.add(JobSkill(job_id=new_job.id, **skill))
            
        for req in requirements:
            self.db.add(JobRequirement(job_id=new_job.id, requirement_text=req))
            
        for ben in benefits:
            self.db.add(JobBenefit(job_id=new_job.id, benefit_text=ben))
            
        self.db.commit()
        self.db.refresh(new_job)
        return new_job

    def get_statistics(self) -> Dict:
        total_jobs = self.db.query(func.count(Job.id)).scalar() or 0
        
        today = date.today()
        # Ensure we count jobs collected today
        jobs_today = self.db.query(func.count(Job.id)).filter(func.date(Job.collected_date) == today).scalar() or 0
        
        # Remote jobs
        remote_jobs = self.db.query(func.count(Job.id)).join(JobLocation).filter(JobLocation.is_remote == True).scalar() or 0
        
        # Top skills
        top_skills_query = (
            self.db.query(JobSkill.skill_name, func.count(JobSkill.id).label('count'))
            .group_by(JobSkill.skill_name)
            .order_by(desc('count'))
            .limit(10)
            .all()
        )
        top_skills = [{"name": s[0], "count": s[1]} for s in top_skills_query]
        
        # Top companies
        top_companies_query = (
            self.db.query(Job.company_name, func.count(Job.id).label('count'))
            .group_by(Job.company_name)
            .order_by(desc('count'))
            .limit(10)
            .all()
        )
        top_companies = [{"name": c[0], "count": c[1]} for c in top_companies_query]
        
        # Top sources
        top_sources_query = (
            self.db.query(Job.source, func.count(Job.id).label('count'))
            .group_by(Job.source)
            .order_by(desc('count'))
            .limit(10)
            .all()
        )
        top_sources = [{"name": s[0], "count": s[1]} for s in top_sources_query]
        
        return {
            "total_jobs": total_jobs,
            "jobs_today": jobs_today,
            "remote_jobs": remote_jobs,
            "top_skills": top_skills,
            "top_companies": top_companies,
            "top_sources": top_sources
        }
