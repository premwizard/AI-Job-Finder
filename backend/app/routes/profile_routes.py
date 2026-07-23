from typing import List
from fastapi import APIRouter, Depends, status, UploadFile, File
from sqlalchemy.orm import Session

from app.database.database import get_db
from app.middleware.auth_middleware import get_current_user
from app.models.models import Certification, Education, Experience, Project, Skill, User
from app.schemas import profile_schemas
from app.services.profile_service import ProfileService

router = APIRouter(prefix="/api/profile", tags=["Profile"])


def get_profile_service(db: Session = Depends(get_db)):
    return ProfileService(db)


@router.get("", response_model=profile_schemas.FullProfileResponse)
def get_full_profile(
    service: ProfileService = Depends(get_profile_service),
    current_user: User = Depends(get_current_user),
):
    return service.get_full_profile(current_user.id)


@router.get("/completion", response_model=profile_schemas.ProfileCompletionResponse)
def get_profile_completion(
    service: ProfileService = Depends(get_profile_service),
    current_user: User = Depends(get_current_user),
):
    return service.calculate_completion_percentage(current_user.id)


@router.get("/strength", response_model=profile_schemas.ProfileStrengthResponse)
def get_profile_strength(
    service: ProfileService = Depends(get_profile_service),
    current_user: User = Depends(get_current_user),
):
    return service.get_profile_strength(current_user.id)


@router.post("/avatar", response_model=profile_schemas.ImageUploadResponse)
def upload_avatar(
    file: UploadFile = File(...),
    service: ProfileService = Depends(get_profile_service),
    current_user: User = Depends(get_current_user),
):
    return service.upload_avatar(current_user.id, file)


@router.post("/banner", response_model=profile_schemas.ImageUploadResponse)
def upload_banner(
    file: UploadFile = File(...),
    service: ProfileService = Depends(get_profile_service),
    current_user: User = Depends(get_current_user),
):
    return service.upload_banner(current_user.id, file)


@router.get("/personal", response_model=profile_schemas.PersonalInfoResponse)
def get_personal_info(
    service: ProfileService = Depends(get_profile_service),
    current_user: User = Depends(get_current_user),
):
    return service.get_personal_info(current_user.id)

@router.delete("/avatar", status_code=status.HTTP_204_NO_CONTENT)
def delete_avatar(
    service: ProfileService = Depends(get_profile_service),
    current_user: User = Depends(get_current_user),
):
    service.delete_avatar(current_user.id)

@router.put("/personal", response_model=profile_schemas.PersonalInfoResponse)
def update_personal_info(
    req: profile_schemas.PersonalInfoUpdate,
    service: ProfileService = Depends(get_profile_service),
    current_user: User = Depends(get_current_user),
):
    return service.update_personal_info(current_user.id, req)

# --- Professional Information (New Module) ---
@router.get("/professional", response_model=profile_schemas.ProfessionalInfoResponse)
def get_professional_info(
    service: ProfileService = Depends(get_profile_service),
    current_user: User = Depends(get_current_user),
):
    return service.get_professional_info(current_user.id)

@router.put("/professional", response_model=profile_schemas.ProfessionalInfoResponse)
def update_professional_info(
    req: profile_schemas.ProfessionalInfoUpdate,
    service: ProfileService = Depends(get_profile_service),
    current_user: User = Depends(get_current_user),
):
    return service.update_professional_info(current_user.id, req)


@router.put("/summary", response_model=profile_schemas.ProfessionalSummaryResponse)
def update_professional_summary(
    req: profile_schemas.ProfessionalSummaryUpdate,
    service: ProfileService = Depends(get_profile_service),
    current_user: User = Depends(get_current_user),
):
    return service.update_professional_summary(current_user.id, req)


@router.put(
    "/career-preferences", response_model=profile_schemas.CareerPreferenceResponse
)
def update_career_preferences(
    req: profile_schemas.CareerPreferenceUpdate,
    service: ProfileService = Depends(get_profile_service),
    current_user: User = Depends(get_current_user),
):
    return service.update_career_preferences(current_user.id, req)


@router.put("/social", response_model=profile_schemas.SocialProfileResponse)
def update_social_profiles(
    req: profile_schemas.SocialProfileUpdate,
    service: ProfileService = Depends(get_profile_service),
    current_user: User = Depends(get_current_user),
):
    return service.update_social_profiles(current_user.id, req)


@router.put("/ai-preferences", response_model=profile_schemas.AIPreferenceResponse)
def update_ai_preferences(
    req: profile_schemas.AIPreferenceUpdate,
    service: ProfileService = Depends(get_profile_service),
    current_user: User = Depends(get_current_user),
):
    return service.update_ai_preferences(current_user.id, req)


# --- Skills ---
@router.get("/skills", response_model=list[profile_schemas.SkillResponse])
def get_skills(
    service: ProfileService = Depends(get_profile_service),
    current_user: User = Depends(get_current_user),
):
    return service.get_skills(current_user.id)

@router.post(
    "/skills",
    response_model=profile_schemas.SkillResponse,
    status_code=status.HTTP_201_CREATED,
)
def add_skill(
    req: profile_schemas.SkillCreate,
    service: ProfileService = Depends(get_profile_service),
    current_user: User = Depends(get_current_user),
):
    return service._create_item(Skill, current_user.id, req)


@router.put("/skills/{item_id}", response_model=profile_schemas.SkillResponse)
def update_skill(
    item_id: int,
    req: profile_schemas.SkillUpdate,
    service: ProfileService = Depends(get_profile_service),
    current_user: User = Depends(get_current_user),
):
    return service._update_item(Skill, item_id, current_user.id, req)


@router.delete("/skills/{item_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_skill(
    item_id: int,
    service: ProfileService = Depends(get_profile_service),
    current_user: User = Depends(get_current_user),
):
    service._delete_item(Skill, item_id, current_user.id)

# --- Experience ---
@router.get("/experience", response_model=list[profile_schemas.ExperienceResponse])
def get_experiences(
    service: ProfileService = Depends(get_profile_service),
    current_user: User = Depends(get_current_user),
):
    return service.get_experiences(current_user.id)

@router.post(
    "/experience",
    response_model=profile_schemas.ExperienceResponse,
    status_code=status.HTTP_201_CREATED,
)
def add_experience(
    req: profile_schemas.ExperienceCreate,
    service: ProfileService = Depends(get_profile_service),
    current_user: User = Depends(get_current_user),
):
    return service.create_experience(current_user.id, req)


@router.put("/experience/{item_id}", response_model=profile_schemas.ExperienceResponse)
def update_experience(
    item_id: str,
    req: profile_schemas.ExperienceUpdate,
    service: ProfileService = Depends(get_profile_service),
    current_user: User = Depends(get_current_user),
):
    return service.update_experience(item_id, current_user.id, req)


@router.delete("/experience/{item_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_experience(
    item_id: str,
    service: ProfileService = Depends(get_profile_service),
    current_user: User = Depends(get_current_user),
):
    service._delete_item(Experience, item_id, current_user.id)


# --- Education ---
@router.get(
    "/education",
    response_model=List[profile_schemas.EducationResponse],
)
def get_education(
    service: ProfileService = Depends(get_profile_service),
    current_user: User = Depends(get_current_user),
):
    return service.get_educations(current_user.id)


@router.post(
    "/education",
    response_model=profile_schemas.EducationResponse,
    status_code=status.HTTP_201_CREATED,
)
def add_education(
    req: profile_schemas.EducationCreate,
    service: ProfileService = Depends(get_profile_service),
    current_user: User = Depends(get_current_user),
):
    return service._create_item(Education, current_user.id, req)


@router.post(
    "/education/upload",
    response_model=profile_schemas.ImageUploadResponse,
)
def upload_education_file(
    file: UploadFile = File(...),
    service: ProfileService = Depends(get_profile_service),
    current_user: User = Depends(get_current_user),
):
    return service.upload_education_file(file)


@router.put("/education/{item_id}", response_model=profile_schemas.EducationResponse)
def update_education(
    item_id: str,
    req: profile_schemas.EducationUpdate,
    service: ProfileService = Depends(get_profile_service),
    current_user: User = Depends(get_current_user),
):
    return service._update_item(Education, item_id, current_user.id, req)


@router.delete("/education/{item_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_education(
    item_id: str,
    service: ProfileService = Depends(get_profile_service),
    current_user: User = Depends(get_current_user),
):
    service._delete_item(Education, item_id, current_user.id)



# --- Certifications ---
@router.post(
    "/certifications",
    response_model=profile_schemas.CertificationResponse,
    status_code=status.HTTP_201_CREATED,
)
def add_certification(
    req: profile_schemas.CertificationCreate,
    service: ProfileService = Depends(get_profile_service),
    current_user: User = Depends(get_current_user),
):
    return service._create_item(Certification, current_user.id, req)


@router.put(
    "/certifications/{item_id}", response_model=profile_schemas.CertificationResponse
)
def update_certification(
    item_id: int,
    req: profile_schemas.CertificationUpdate,
    service: ProfileService = Depends(get_profile_service),
    current_user: User = Depends(get_current_user),
):
    return service._update_item(Certification, item_id, current_user.id, req)


@router.delete("/certifications/{item_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_certification(
    item_id: int,
    service: ProfileService = Depends(get_profile_service),
    current_user: User = Depends(get_current_user),
):
    service._delete_item(Certification, item_id, current_user.id)


# --- Projects ---
@router.post(
    "/projects",
    response_model=profile_schemas.ProjectResponse,
    status_code=status.HTTP_201_CREATED,
)
def add_project(
    req: profile_schemas.ProjectCreate,
    service: ProfileService = Depends(get_profile_service),
    current_user: User = Depends(get_current_user),
):
    return service._create_item(Project, current_user.id, req)


@router.put("/projects/{item_id}", response_model=profile_schemas.ProjectResponse)
def update_project(
    item_id: int,
    req: profile_schemas.ProjectUpdate,
    service: ProfileService = Depends(get_profile_service),
    current_user: User = Depends(get_current_user),
):
    return service._update_item(Project, item_id, current_user.id, req)


@router.delete("/projects/{item_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_project(
    item_id: int,
    service: ProfileService = Depends(get_profile_service),
    current_user: User = Depends(get_current_user),
):
    service._delete_item(Project, item_id, current_user.id)
