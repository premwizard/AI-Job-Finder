from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session
from app.database.database import get_db
from app.schemas import profile_schemas
from app.services.profile_service import ProfileService
from app.middleware.auth_middleware import get_current_user
from app.models.models import User

router = APIRouter(prefix="/api/profile", tags=["Profile"])

def get_profile_service(db: Session = Depends(get_db)):
    return ProfileService(db)

@router.get("", response_model=profile_schemas.FullProfileResponse)
def get_full_profile(
    service: ProfileService = Depends(get_profile_service), 
    current_user: User = Depends(get_current_user)
):
    return service.get_full_profile(current_user.id)

@router.put("/personal", response_model=profile_schemas.PersonalInfoResponse)
def update_personal_info(
    req: profile_schemas.PersonalInfoUpdate,
    service: ProfileService = Depends(get_profile_service), 
    current_user: User = Depends(get_current_user)
):
    return service.update_personal_info(current_user.id, req)

@router.put("/summary", response_model=profile_schemas.ProfessionalSummaryResponse)
def update_professional_summary(
    req: profile_schemas.ProfessionalSummaryUpdate,
    service: ProfileService = Depends(get_profile_service), 
    current_user: User = Depends(get_current_user)
):
    return service.update_professional_summary(current_user.id, req)

@router.put("/career-preferences", response_model=profile_schemas.CareerPreferenceResponse)
def update_career_preferences(
    req: profile_schemas.CareerPreferenceUpdate,
    service: ProfileService = Depends(get_profile_service), 
    current_user: User = Depends(get_current_user)
):
    return service.update_career_preferences(current_user.id, req)

@router.put("/social", response_model=profile_schemas.SocialProfileResponse)
def update_social_profiles(
    req: profile_schemas.SocialProfileUpdate,
    service: ProfileService = Depends(get_profile_service), 
    current_user: User = Depends(get_current_user)
):
    return service.update_social_profiles(current_user.id, req)

@router.put("/ai-preferences", response_model=profile_schemas.AIPreferenceResponse)
def update_ai_preferences(
    req: profile_schemas.AIPreferenceUpdate,
    service: ProfileService = Depends(get_profile_service), 
    current_user: User = Depends(get_current_user)
):
    return service.update_ai_preferences(current_user.id, req)
