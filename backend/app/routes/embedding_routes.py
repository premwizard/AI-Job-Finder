from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database.database import get_db
from app.models.models import User, Skill, Project, Experience, Education, Certification, Resume
from app.middleware.auth_middleware import get_current_user
from app.services.embedding_service import EmbeddingService
from app.services.profile_service import ProfileService

router = APIRouter(prefix="/api/profile/embeddings", tags=["Embeddings"])

@router.post("/sync")
def sync_all_embeddings(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    Utility endpoint to manually generate/sync embeddings for all items in the user's profile.
    Useful for migrating existing users or recovering lost embeddings.
    """
    user_id = current_user.id
    ps = ProfileService(db)
    es = EmbeddingService(db)
    
    count = 0
    
    # Skills
    skills = db.query(Skill).filter(Skill.user_id == user_id).all()
    for s in skills:
        ps._trigger_embedding_update(user_id, "skill", s)
        count += 1
        
    # Projects
    projects = db.query(Project).filter(Project.user_id == user_id).all()
    for p in projects:
        ps._trigger_embedding_update(user_id, "project", p)
        count += 1
        
    # Experience
    experiences = db.query(Experience).filter(Experience.user_id == user_id).all()
    for exp in experiences:
        ps._trigger_embedding_update(user_id, "experience", exp)
        count += 1
        
    # Education
    educations = db.query(Education).filter(Education.user_id == user_id).all()
    for edu in educations:
        ps._trigger_embedding_update(user_id, "education", edu)
        count += 1
        
    # Certifications
    certs = db.query(Certification).filter(Certification.user_id == user_id).all()
    for cert in certs:
        ps._trigger_embedding_update(user_id, "certification", cert)
        count += 1
        
    # Active Resume
    resume = db.query(Resume).filter(Resume.user_id == user_id, Resume.is_active == True).first()
    if resume and resume.clean_text:
        es.embed_item(
            user_id=user_id,
            item_type="resume",
            item_id=str(resume.id),
            text=resume.clean_text,
            chunk_large_text=True
        )
        count += 1
        
    return {"message": f"Successfully synced embeddings for {count} profile items."}
