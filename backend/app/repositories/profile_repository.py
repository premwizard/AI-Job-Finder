from sqlalchemy.orm import Session

from app.models.models import UserProfile


def get_profile_by_user_id(db: Session, user_id: str) -> UserProfile | None:
    return db.query(UserProfile).filter(UserProfile.user_id == user_id).first()


def create_profile(db: Session, profile: UserProfile) -> UserProfile:
    db.add(profile)
    db.commit()
    db.refresh(profile)
    return profile


def update_profile(
    db: Session, db_profile: UserProfile, update_data: dict
) -> UserProfile:
    for key, value in update_data.items():
        if value is not None:
            setattr(db_profile, key, value)
    db.commit()
    db.refresh(db_profile)
    return db_profile
