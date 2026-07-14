from sqlalchemy.orm import Session

from app.models.models import User, UserProfile
from app.repositories import profile_repository
from app.schemas.profile_schema import UserProfileResponse, UserProfileUpdate


def get_profile(db: Session, current_user: User) -> UserProfileResponse:
    profile = profile_repository.get_profile_by_user_id(db, current_user.id)
    if not profile:
        # Create an empty profile if it doesn't exist
        new_profile = UserProfile(user_id=current_user.id)
        profile = profile_repository.create_profile(db, new_profile)
    return profile


def update_profile(
    db: Session, current_user: User, req: UserProfileUpdate
) -> UserProfileResponse:
    profile = profile_repository.get_profile_by_user_id(db, current_user.id)
    if not profile:
        profile = UserProfile(user_id=current_user.id)
        profile = profile_repository.create_profile(db, profile)

    updated_profile = profile_repository.update_profile(
        db, profile, req.dict(exclude_unset=True)
    )
    return updated_profile
