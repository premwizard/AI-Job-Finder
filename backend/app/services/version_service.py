from sqlalchemy.orm import Session
from app.models.models import Resume, ResumeVersion

class VersionService:
    @staticmethod
    def create_snapshot(resume: Resume, change_summary: str, db: Session):
        """
        Creates a new version snapshot of the current resume state.
        Increments the resume's version number.
        Must be called BEFORE or AFTER saving the new state, depending on context.
        Typically, call this AFTER the change is made but BEFORE db.commit(), 
        or commit the main change, then call this and commit again.
        """
        # Increment head version
        resume.version = (resume.version or 0) + 1
        
        # Create snapshot
        snapshot = ResumeVersion(
            resume_id=resume.id,
            version_number=resume.version,
            change_summary=change_summary,
            parsed_data_json=resume.parsed_data_json,
            clean_text=resume.clean_text,
            ats_score=resume.ats_score,
            quality_score=None # Could fetch from latest quality history if needed, but None is fine for now
        )
        
        db.add(snapshot)
        db.commit()
        return snapshot

    @staticmethod
    def restore_version(resume: Resume, version_id: str, db: Session):
        """
        Restores a resume to a specific historical version snapshot.
        Creates a NEW version snapshot capturing this rollback.
        """
        target_version = db.query(ResumeVersion).filter(ResumeVersion.id == version_id, ResumeVersion.resume_id == resume.id).first()
        if not target_version:
            raise ValueError("Version not found")

        # Revert fields
        resume.parsed_data_json = target_version.parsed_data_json
        resume.clean_text = target_version.clean_text
        resume.ats_score = target_version.ats_score
        # Quality score omitted for brevity

        # Create new snapshot for the rollback action
        VersionService.create_snapshot(
            resume=resume,
            change_summary=f"Restored to Version {target_version.version_number}",
            db=db
        )
        return resume
