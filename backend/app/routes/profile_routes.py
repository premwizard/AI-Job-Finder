from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database.database import get_db
from app.schemas.profile_schema import UserProfileUpdate, UserProfileResponse
from app.controllers import profile_controller
from app.middleware.auth_middleware import get_current_user
from app.models.models import User

router = APIRouter(prefix="/api/profile", tags=["Profile"])

@router.get("", response_model=UserProfileResponse)
def get_profile(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    return profile_controller.get_profile(db, current_user)

@router.put("", response_model=UserProfileResponse)
def update_profile(req: UserProfileUpdate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    return profile_controller.update_profile(db, current_user, req)
