from datetime import datetime
from sqlalchemy.orm import Session
from sqlalchemy import func
from app.models.models import Resume, ResumeVersion, ResumeImprovementSuggestion, Skill, Experience, Project

class ResumeAnalyticsService:
    def __init__(self, db: Session):
        self.db = db

    def get_resume_analytics(self, user_id: str) -> dict:
        """
        Aggregates historical data to populate the Resume Analytics Dashboard.
        """
        analytics = {}

        # 1. Base Resume Stats
        resume = self.db.query(Resume).filter(
            Resume.user_id == user_id, 
            Resume.is_active == True
        ).first()

        if resume:
            analytics["current_ats_score"] = resume.ats_score or 0
            analytics["latest_version"] = resume.version
            if resume.uploaded_at:
                age_delta = datetime.utcnow() - resume.uploaded_at
                analytics["resume_age_days"] = age_delta.days
            else:
                analytics["resume_age_days"] = 0
        else:
            analytics["current_ats_score"] = 0
            analytics["latest_version"] = 0
            analytics["resume_age_days"] = 0

        # Highest ATS Score across all versions of the active resume
        if resume:
            highest_ats = self.db.query(func.max(ResumeVersion.ats_score)).filter(
                ResumeVersion.resume_id == resume.id
            ).scalar()
            
            if not highest_ats:
                highest_ats = resume.ats_score
                
            analytics["highest_ats_score"] = highest_ats or 0
        else:
            analytics["highest_ats_score"] = 0

        # Total Improvements Accepted
        improvements_count = self.db.query(ResumeImprovementSuggestion).filter(
            ResumeImprovementSuggestion.user_id == user_id,
            ResumeImprovementSuggestion.status == "ACCEPTED"
        ).count()
        analytics["total_improvements_accepted"] = improvements_count

        # Total Skills
        total_skills = self.db.query(Skill).filter(Skill.user_id == user_id).count()
        analytics["total_skills"] = total_skills

        # 2. Trend Data
        
        # ATS & Quality Trend
        if resume:
            versions = self.db.query(ResumeVersion).filter(
                ResumeVersion.resume_id == resume.id
            ).order_by(ResumeVersion.created_at.asc()).all()
        else:
            versions = []
        
        ats_trend = []
        quality_trend = []
        
        for v in versions:
            date_str = v.created_at.strftime("%Y-%m-%d %H:%M")
            if v.ats_score is not None:
                ats_trend.append({"date": date_str, "score": v.ats_score, "version": v.version_number})
            if v.quality_score is not None:
                quality_trend.append({"date": date_str, "score": v.quality_score, "version": v.version_number})
                
        # If the head resume has scores and no versions exist, use it
        if not ats_trend and resume and resume.ats_score is not None:
            ats_trend.append({"date": datetime.utcnow().strftime("%Y-%m-%d %H:%M"), "score": resume.ats_score, "version": resume.version})
        if not quality_trend and resume and resume.quality_score is not None:
            quality_trend.append({"date": datetime.utcnow().strftime("%Y-%m-%d %H:%M"), "score": resume.quality_score, "version": resume.version})
            
        analytics["ats_trend"] = ats_trend
        analytics["quality_trend"] = quality_trend
        
        # Growth Data (Cumulative)
        analytics["skills_growth"] = self._get_cumulative_growth(Skill, user_id)
        analytics["experience_growth"] = self._get_cumulative_growth(Experience, user_id)
        analytics["projects_growth"] = self._get_cumulative_growth(Project, user_id)
        
        # 3. Recent Activity
        analytics["recent_versions"] = [
            {"id": v.id, "version_number": v.version_number, "change_summary": v.change_summary, "date": v.created_at.isoformat()}
            for v in sorted(versions, key=lambda x: x.created_at, reverse=True)[:5]
        ]
        
        recent_improvements = self.db.query(ResumeImprovementSuggestion).filter(
            ResumeImprovementSuggestion.user_id == user_id,
            ResumeImprovementSuggestion.status == "ACCEPTED"
        ).order_by(ResumeImprovementSuggestion.resolved_at.desc()).limit(5).all()
        
        analytics["recent_improvements"] = [
            {"id": i.id, "section": i.section, "type": i.improvement_type, "date": (i.resolved_at or i.created_at).isoformat()}
            for i in recent_improvements
        ]

        return analytics

    def _get_cumulative_growth(self, model_class, user_id: str) -> list:
        records = self.db.query(model_class).filter(
            model_class.user_id == user_id
        ).all()
        
        # Try to sort by created_at if it exists, else start_date, else just group all today
        def get_date(r):
            if hasattr(r, 'created_at') and r.created_at:
                return r.created_at
            if hasattr(r, 'start_date') and r.start_date:
                return r.start_date
            return datetime.utcnow()
            
        records = sorted(records, key=get_date)
        
        growth = []
        cumulative_count = 0
        for r in records:
            cumulative_count += 1
            d = get_date(r)
            growth.append({
                "date": d.strftime("%Y-%m-%d"),
                "count": cumulative_count
            })
            
        # If no records, just return empty list
        return growth
