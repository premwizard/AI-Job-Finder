from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import desc

from src.database.database import get_db
from src.models.models import User, WorkExperience, Skill, Project
from src.schemas.schemas import WorkExperienceCreate, WorkExperienceUpdate, WorkExperienceResponse
from src.api.deps import get_current_user

router = APIRouter(
    prefix="/work-experience",
    tags=["Work Experience"]
)

@router.get("/", response_model=List[WorkExperienceResponse])
def get_work_experiences(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Get all work experiences for the current user.
    """
    work_experiences = db.query(WorkExperience).filter(
        WorkExperience.user_id == current_user.id
    ).order_by(desc(WorkExperience.start_date)).all()
    
    return work_experiences


@router.post("/", response_model=WorkExperienceResponse, status_code=status.HTTP_201_CREATED)
def create_work_experience(
    work_experience_in: WorkExperienceCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Create a new work experience entry.
    """
    # Duplicate check
    existing = db.query(WorkExperience).filter(
        WorkExperience.user_id == current_user.id,
        WorkExperience.company_name == work_experience_in.company_name,
        WorkExperience.role == work_experience_in.role,
        WorkExperience.start_date == work_experience_in.start_date
    ).first()
    
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="A work experience entry with this company, role, and start date already exists."
        )

    db_work_experience = WorkExperience(
        user_id=current_user.id,
        **work_experience_in.model_dump(exclude={'skill_ids', 'project_ids'})
    )
    
    # Handle Skills
    if work_experience_in.skill_ids:
        skills = db.query(Skill).filter(Skill.id.in_(work_experience_in.skill_ids)).all()
        db_work_experience.skills_used = skills
        
    # Handle Projects
    if work_experience_in.project_ids:
        projects = db.query(Project).filter(Project.id.in_(work_experience_in.project_ids)).all()
        db_work_experience.projects = projects

    db.add(db_work_experience)
    db.commit()
    db.refresh(db_work_experience)
    return db_work_experience


@router.put("/{work_experience_id}", response_model=WorkExperienceResponse)
def update_work_experience(
    work_experience_id: int,
    work_experience_in: WorkExperienceUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Update a work experience entry.
    """
    db_work_experience = db.query(WorkExperience).filter(
        WorkExperience.id == work_experience_id,
        WorkExperience.user_id == current_user.id
    ).first()

    if not db_work_experience:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Work experience not found"
        )

    update_data = work_experience_in.model_dump(exclude_unset=True)
    
    # Handle Skills update
    if 'skill_ids' in update_data:
        skill_ids = update_data.pop('skill_ids')
        if skill_ids is not None:
            skills = db.query(Skill).filter(Skill.id.in_(skill_ids)).all()
            db_work_experience.skills_used = skills
            
    # Handle Projects update
    if 'project_ids' in update_data:
        project_ids = update_data.pop('project_ids')
        if project_ids is not None:
            projects = db.query(Project).filter(Project.id.in_(project_ids)).all()
            db_work_experience.projects = projects

    for field, value in update_data.items():
        setattr(db_work_experience, field, value)

    db.commit()
    db.refresh(db_work_experience)
    return db_work_experience


@router.delete("/{work_experience_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_work_experience(
    work_experience_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Delete a work experience entry.
    """
    db_work_experience = db.query(WorkExperience).filter(
        WorkExperience.id == work_experience_id,
        WorkExperience.user_id == current_user.id
    ).first()

    if not db_work_experience:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Work experience not found"
        )

    db.delete(db_work_experience)
    db.commit()
    return None
