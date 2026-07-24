import os
from typing import List
from fastapi import APIRouter, Depends, status, UploadFile, File, HTTPException
from fastapi.responses import FileResponse
from sqlalchemy.orm import Session

from app.database.database import get_db
from app.middleware.auth_middleware import get_current_user
from app.models.models import Certification, Education, Experience, Project, Resume, Skill, User
from app.schemas import profile_schemas
from app.services.profile_service import ProfileService
from app.services.profile_approval_service import ApproveMergeRequest

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


@router.get(
    "/career-preferences", response_model=profile_schemas.CareerPreferenceResponse
)
def get_career_preferences(
    service: ProfileService = Depends(get_profile_service),
    current_user: User = Depends(get_current_user),
):
    return service.get_career_preferences(current_user.id)


@router.put(
    "/career-preferences", response_model=profile_schemas.CareerPreferenceResponse
)
def update_career_preferences(
    req: profile_schemas.CareerPreferenceUpdate,
    service: ProfileService = Depends(get_profile_service),
    current_user: User = Depends(get_current_user),
):
    return service.update_career_preferences(current_user.id, req)


@router.get("/social", response_model=profile_schemas.SocialProfileResponse)
def get_social_profiles(
    service: ProfileService = Depends(get_profile_service),
    current_user: User = Depends(get_current_user),
):
    return service.get_social_profiles(current_user.id)


@router.put("/social", response_model=profile_schemas.SocialProfileResponse)
def update_social_profiles(
    req: profile_schemas.SocialProfileUpdate,
    service: ProfileService = Depends(get_profile_service),
    current_user: User = Depends(get_current_user),
):
    return service.update_social_profiles(current_user.id, req)


@router.get("/ai-preferences", response_model=profile_schemas.AIPreferenceResponse)
def get_ai_preferences(
    service: ProfileService = Depends(get_profile_service),
    current_user: User = Depends(get_current_user),
):
    return service.get_ai_preferences(current_user.id)


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
@router.get(
    "/certifications",
    response_model=List[profile_schemas.CertificationResponse],
)
def get_certifications(
    service: ProfileService = Depends(get_profile_service),
    current_user: User = Depends(get_current_user),
):
    return service.get_certifications(current_user.id)


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


@router.post(
    "/certifications/upload",
    response_model=profile_schemas.ImageUploadResponse,
)
def upload_certification_file(
    file: UploadFile = File(...),
    service: ProfileService = Depends(get_profile_service),
    current_user: User = Depends(get_current_user),
):
    return service.upload_certification_file(file)


@router.put(
    "/certifications/{item_id}", response_model=profile_schemas.CertificationResponse
)
def update_certification(
    item_id: str,
    req: profile_schemas.CertificationUpdate,
    service: ProfileService = Depends(get_profile_service),
    current_user: User = Depends(get_current_user),
):
    return service._update_item(Certification, item_id, current_user.id, req)


@router.delete("/certifications/{item_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_certification(
    item_id: str,
    service: ProfileService = Depends(get_profile_service),
    current_user: User = Depends(get_current_user),
):
    service._delete_item(Certification, item_id, current_user.id)



# --- Projects ---
@router.get(
    "/projects",
    response_model=List[profile_schemas.ProjectResponse],
)
def get_projects(
    service: ProfileService = Depends(get_profile_service),
    current_user: User = Depends(get_current_user),
):
    return service.get_projects(current_user.id)


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


@router.post(
    "/projects/upload",
    response_model=profile_schemas.ImageUploadResponse,
)
def upload_project_file(
    file: UploadFile = File(...),
    service: ProfileService = Depends(get_profile_service),
    current_user: User = Depends(get_current_user),
):
    return service.upload_project_file(file)


@router.put("/projects/{item_id}", response_model=profile_schemas.ProjectResponse)
def update_project(
    item_id: str,
    req: profile_schemas.ProjectUpdate,
    service: ProfileService = Depends(get_profile_service),
    current_user: User = Depends(get_current_user),
):
    return service._update_item(Project, item_id, current_user.id, req)


@router.delete("/projects/{item_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_project(
    item_id: str,
    service: ProfileService = Depends(get_profile_service),
    current_user: User = Depends(get_current_user),
):
    service._delete_item(Project, item_id, current_user.id)


# --- Resume Center ---
@router.get(
    "/resume",
    response_model=List[profile_schemas.ResumeResponse],
)
def get_resumes(
    service: ProfileService = Depends(get_profile_service),
    current_user: User = Depends(get_current_user),
):
    return service.get_resumes(current_user.id)


@router.post(
    "/resume/upload",
    response_model=profile_schemas.ResumeResponse,
    status_code=status.HTTP_201_CREATED,
)
def upload_resume(
    file: UploadFile = File(...),
    service: ProfileService = Depends(get_profile_service),
    current_user: User = Depends(get_current_user),
):
    return service.upload_resume(current_user.id, file)


@router.post(
    "/resume/replace/{resume_id}",
    response_model=profile_schemas.ResumeResponse,
)
@router.put(
    "/resume/replace/{resume_id}",
    response_model=profile_schemas.ResumeResponse,
)
def replace_resume(
    resume_id: int,
    file: UploadFile = File(...),
    service: ProfileService = Depends(get_profile_service),
    current_user: User = Depends(get_current_user),
):
    return service.replace_resume(current_user.id, resume_id, file)


@router.put(
    "/resume/activate/{resume_id}",
    response_model=profile_schemas.ResumeResponse,
)
def set_active_resume(
    resume_id: int,
    service: ProfileService = Depends(get_profile_service),
    current_user: User = Depends(get_current_user),
):
    return service.set_active_resume(current_user.id, resume_id)


@router.delete("/resume/{resume_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_resume(
    resume_id: int,
    service: ProfileService = Depends(get_profile_service),
    current_user: User = Depends(get_current_user),
):
    service.delete_resume(current_user.id, resume_id)


@router.post(
    "/resume/{resume_id}/process",
    response_model=profile_schemas.ResumeResponse,
)
def process_resume_document(
    resume_id: int,
    service: ProfileService = Depends(get_profile_service),
    current_user: User = Depends(get_current_user),
):
    return service.process_resume_document(current_user.id, resume_id)


@router.post(
    "/resume/{resume_id}/clean",
    response_model=profile_schemas.ResumeResponse,
)
def clean_resume_text(
    resume_id: int,
    service: ProfileService = Depends(get_profile_service),
    current_user: User = Depends(get_current_user),
):
    return service.clean_resume_text(current_user.id, resume_id)


@router.post(
    "/resume/{resume_id}/parse",
    response_model=profile_schemas.ResumeResponse,
)
def parse_resume_ai(
    resume_id: int,
    service: ProfileService = Depends(get_profile_service),
    current_user: User = Depends(get_current_user),
):
    return service.parse_resume_ai(current_user.id, resume_id)


@router.get("/resume/{resume_id}/parsed-data")
def get_resume_parsed_data(
    resume_id: int,
    service: ProfileService = Depends(get_profile_service),
    current_user: User = Depends(get_current_user),
):
    resumes = service.get_resumes(current_user.id)
    target = next((r for r in resumes if r.id == resume_id), None)
    if not target:
        raise HTTPException(status_code=404, detail="Resume not found")
    parsed_json = {}
    if target.parsed_data_json:
        try:
            import json
            parsed_json = json.loads(target.parsed_data_json)
        except Exception:
            pass
    return {
        "id": target.id,
        "file_name": target.file_name,
        "parsing_status": target.parsing_status,
        "parsed_at": target.parsed_at,
        "parsed_data": parsed_json,
    }


@router.get("/resume/{resume_id}/merge-suggestions")
def get_resume_merge_suggestions(
    resume_id: int,
    service: ProfileService = Depends(get_profile_service),
    current_user: User = Depends(get_current_user),
):
    return service.get_merge_suggestions(current_user.id, resume_id)


@router.post("/resume/{resume_id}/approve-merge")
def approve_resume_merge(
    resume_id: int,
    request: ApproveMergeRequest,
    service: ProfileService = Depends(get_profile_service),
    current_user: User = Depends(get_current_user),
):
    request.resume_id = resume_id
    return service.approve_resume_merge(current_user.id, request)


@router.get("/resume/{resume_id}/text")
@router.get("/resume/{resume_id}/cleaned-text")
def get_resume_raw_and_cleaned_text(
    resume_id: int,
    service: ProfileService = Depends(get_profile_service),
    current_user: User = Depends(get_current_user),
):
    resumes = service.get_resumes(current_user.id)
    target = next((r for r in resumes if r.id == resume_id), None)
    if not target:
        raise HTTPException(status_code=404, detail="Resume not found")
    return {
        "id": target.id,
        "file_name": target.file_name,
        "parsing_status": target.parsing_status,
        "raw_text": target.raw_text,
        "clean_text": target.clean_text,
        "processing_error": target.processing_error,
        "processed_at": target.processed_at,
        "cleaned_at": target.cleaned_at,
    }


@router.get("/resume/{resume_id}/download")
def download_resume(
    resume_id: int,
    service: ProfileService = Depends(get_profile_service),
    current_user: User = Depends(get_current_user),
):
    resumes = service.get_resumes(current_user.id)
    target = next((r for r in resumes if r.id == resume_id), None)
    if not target:
        raise HTTPException(status_code=404, detail="Resume not found")
    file_path = target.file_url.lstrip("/")
    if not os.path.exists(file_path):
        raise HTTPException(status_code=404, detail="Resume file missing from storage")
    return FileResponse(
        path=file_path,
        filename=target.file_name or f"resume_v{target.version}.pdf",
        media_type=target.mime_type or "application/octet-stream",
    )


# --- Achievements ---
@router.get(
    "/achievements",
    response_model=List[profile_schemas.AchievementResponse],
)
def get_achievements(
    type: str = None,
    service: ProfileService = Depends(get_profile_service),
    current_user: User = Depends(get_current_user),
):
    return service.get_achievements(current_user.id, achievement_type=type)


@router.post(
    "/achievements",
    response_model=profile_schemas.AchievementResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_achievement(
    req: profile_schemas.AchievementCreate,
    service: ProfileService = Depends(get_profile_service),
    current_user: User = Depends(get_current_user),
):
    return service.create_achievement(current_user.id, req)


@router.put(
    "/achievements/{achievement_id}",
    response_model=profile_schemas.AchievementResponse,
)
def update_achievement(
    achievement_id: str,
    req: profile_schemas.AchievementUpdate,
    service: ProfileService = Depends(get_profile_service),
    current_user: User = Depends(get_current_user),
):
    return service.update_achievement(current_user.id, achievement_id, req)


@router.delete("/achievements/{achievement_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_achievement(
    achievement_id: str,
    service: ProfileService = Depends(get_profile_service),
    current_user: User = Depends(get_current_user),
):
    service.delete_achievement(current_user.id, achievement_id)


@router.post(
    "/achievements/{achievement_id}/upload",
    response_model=profile_schemas.AchievementResponse,
)
def upload_achievement_file(
    achievement_id: str,
    file: UploadFile = File(...),
    service: ProfileService = Depends(get_profile_service),
    current_user: User = Depends(get_current_user),
):
    return service.upload_achievement_file(current_user.id, achievement_id, file)


# --- Job Search Preferences ---
@router.get(
    "/job-search-preferences",
    response_model=profile_schemas.JobSearchPreferenceResponse,
)
def get_job_search_preferences(
    service: ProfileService = Depends(get_profile_service),
    current_user: User = Depends(get_current_user),
):
    return service.get_job_search_preferences(current_user.id)


@router.put(
    "/job-search-preferences",
    response_model=profile_schemas.JobSearchPreferenceResponse,
)
def update_job_search_preferences(
    req: profile_schemas.JobSearchPreferenceUpdate,
    service: ProfileService = Depends(get_profile_service),
    current_user: User = Depends(get_current_user),
):
    return service.update_job_search_preferences(current_user.id, req)


# --- Profile Analytics ---
@router.get(
    "/analytics",
    response_model=profile_schemas.ProfileAnalyticsResponse,
)
def get_profile_analytics(
    service: ProfileService = Depends(get_profile_service),
    current_user: User = Depends(get_current_user),
):
    return service.get_profile_analytics(current_user.id)


# --- Privacy Settings ---
@router.get(
    "/privacy-settings",
    response_model=profile_schemas.PrivacySettingResponse,
)
def get_privacy_settings(
    service: ProfileService = Depends(get_profile_service),
    current_user: User = Depends(get_current_user),
):
    return service.get_privacy_settings(current_user.id)


@router.put(
    "/privacy-settings",
    response_model=profile_schemas.PrivacySettingResponse,
)
def update_privacy_settings(
    req: profile_schemas.PrivacySettingUpdate,
    service: ProfileService = Depends(get_profile_service),
    current_user: User = Depends(get_current_user),
):
    return service.update_privacy_settings(current_user.id, req)


@router.get("/export-data")
def export_user_data(
    service: ProfileService = Depends(get_profile_service),
    current_user: User = Depends(get_current_user),
):
    return service.export_user_data(current_user.id)


# --- Notification Settings ---
@router.get(
    "/notification-settings",
    response_model=profile_schemas.NotificationSettingResponse,
)
def get_notification_settings(
    service: ProfileService = Depends(get_profile_service),
    current_user: User = Depends(get_current_user),
):
    return service.get_notification_settings(current_user.id)


@router.put(
    "/notification-settings",
    response_model=profile_schemas.NotificationSettingResponse,
)
def update_notification_settings(
    req: profile_schemas.NotificationSettingUpdate,
    service: ProfileService = Depends(get_profile_service),
    current_user: User = Depends(get_current_user),
):
    return service.update_notification_settings(current_user.id, req)


@router.get("/analytics")
def get_profile_analytics(
    service: ProfileService = Depends(get_profile_service),
    current_user: User = Depends(get_current_user),
):
    return service.get_profile_analytics(current_user.id)





