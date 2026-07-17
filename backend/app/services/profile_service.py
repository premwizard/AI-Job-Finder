import os
import shutil
import uuid
from fastapi import HTTPException, UploadFile
from sqlalchemy.orm import Session

from app.models.models import (
    AIPreference,
    CareerPreference,
    Certification,
    Education,
    Experience,
    Project,
    Resume,
    Skill,
    SocialProfile,
    UserProfile,
    Language,
    User,
)
from app.schemas import profile_schemas


class ProfileService:
    def __init__(self, db: Session):
        self.db = db

    def calculate_completion_percentage(self, user_id: str) -> profile_schemas.ProfileCompletionResponse:
        score = 0
        total_sections = 11
        missing_sections = []

        profile = (
            self.db.query(UserProfile).filter(UserProfile.user_id == user_id).first()
        )
        if profile:
            if profile.headline and profile.phone_number:
                score += 1
            else:
                missing_sections.append("Complete Personal Info")
            if profile.professional_summary and profile.current_job_title:
                score += 1
            else:
                missing_sections.append("Add Professional Summary")
        else:
            missing_sections.append("Complete Personal Info")
            missing_sections.append("Add Professional Summary")

        if self.db.query(Skill).filter(Skill.user_id == user_id).first():
            score += 1
        else:
            missing_sections.append("Add Skills")

        if self.db.query(Experience).filter(Experience.user_id == user_id).first():
            score += 1
        else:
            missing_sections.append("Add Work Experience")

        if self.db.query(Education).filter(Education.user_id == user_id).first():
            score += 1
        else:
            missing_sections.append("Add Education")

        if (
            self.db.query(Certification)
            .filter(Certification.user_id == user_id)
            .first()
        ):
            score += 1
        else:
            missing_sections.append("Add Certifications")

        if self.db.query(Project).filter(Project.user_id == user_id).first():
            score += 1
        else:
            missing_sections.append("Add Projects")

        pref = (
            self.db.query(CareerPreference)
            .filter(CareerPreference.user_id == user_id)
            .first()
        )
        if pref and pref.preferred_roles:
            score += 1
        else:
            missing_sections.append("Set Career Preferences")

        social = (
            self.db.query(SocialProfile)
            .filter(SocialProfile.user_id == user_id)
            .first()
        )
        if social and (social.linkedin_url or social.github_url):
            score += 1
        else:
            missing_sections.append("Link Social Profiles")

        ai_pref = (
            self.db.query(AIPreference).filter(AIPreference.user_id == user_id).first()
        )
        if ai_pref and ai_pref.career_objectives:
            score += 1
        else:
            missing_sections.append("Set AI Preferences")

        if self.db.query(Resume).filter(Resume.user_id == user_id).first():
            score += 1
        else:
            missing_sections.append("Upload Resume")

        percentage = int((score / total_sections) * 100)
        return profile_schemas.ProfileCompletionResponse(
            completion_percentage=percentage,
            missing_sections=missing_sections
        )

    def get_full_profile(self, user_id: str) -> profile_schemas.FullProfileResponse:
        profile = (
            self.db.query(UserProfile).filter(UserProfile.user_id == user_id).first()
        )

        # Ensure a base profile exists
        if not profile:
            profile = UserProfile(user_id=user_id)
            self.db.add(profile)
            self.db.commit()
            self.db.refresh(profile)

        # Get all related models
        skills = self.db.query(Skill).filter(Skill.user_id == user_id).all()
        experiences = (
            self.db.query(Experience)
            .filter(Experience.user_id == user_id)
            .order_by(Experience.start_date.desc())
            .all()
        )
        educations = (
            self.db.query(Education)
            .filter(Education.user_id == user_id)
            .order_by(Education.start_date.desc())
            .all()
        )
        certifications = (
            self.db.query(Certification).filter(Certification.user_id == user_id).all()
        )
        projects = self.db.query(Project).filter(Project.user_id == user_id).all()
        career_pref = (
            self.db.query(CareerPreference)
            .filter(CareerPreference.user_id == user_id)
            .first()
        )
        social_prof = (
            self.db.query(SocialProfile)
            .filter(SocialProfile.user_id == user_id)
            .first()
        )
        ai_pref = (
            self.db.query(AIPreference).filter(AIPreference.user_id == user_id).first()
        )
        resumes = self.db.query(Resume).filter(Resume.user_id == user_id).all()

        completion_response = self.calculate_completion_percentage(user_id)

        # Map UserProfile to PersonalInfo and ProfessionalSummary
        personal_info = (
            profile_schemas.PersonalInfoResponse(**profile.__dict__)
            if profile
            else None
        )
        prof_summary = (
            profile_schemas.ProfessionalSummaryResponse(**profile.__dict__)
            if profile
            else None
        )

        return profile_schemas.FullProfileResponse(
            completion_percentage=completion_response.completion_percentage,
            personal_info=personal_info,
            professional_summary=prof_summary,
            skills=[profile_schemas.SkillResponse.model_validate(s) for s in skills],
            experiences=[
                profile_schemas.ExperienceResponse.model_validate(e)
                for e in experiences
            ],
            educations=[
                profile_schemas.EducationResponse.model_validate(e) for e in educations
            ],
            certifications=[
                profile_schemas.CertificationResponse.model_validate(c)
                for c in certifications
            ],
            projects=[
                profile_schemas.ProjectResponse.model_validate(p) for p in projects
            ],
            career_preferences=profile_schemas.CareerPreferenceResponse(
                **career_pref.__dict__
            )
            if career_pref
            else None,
            social_profiles=profile_schemas.SocialProfileResponse(
                **social_prof.__dict__
            )
            if social_prof
            else None,
            ai_preferences=profile_schemas.AIPreferenceResponse(**ai_pref.__dict__)
            if ai_pref
            else None,
            resumes=[profile_schemas.ResumeResponse.model_validate(r) for r in resumes],
        )

    def get_profile_strength(self, user_id: str) -> profile_schemas.ProfileStrengthResponse:
        completion_response = self.calculate_completion_percentage(user_id)
        score = completion_response.completion_percentage
        
        if score < 30:
            category = "Beginner"
            explanation = "Your profile is just getting started. Add more details to stand out."
        elif score < 60:
            category = "Intermediate"
            explanation = "You're making good progress. Complete more sections to improve visibility."
        elif score < 85:
            category = "Strong"
            explanation = "Your profile is looking great and is highly visible to recruiters."
        else:
            category = "Excellent"
            explanation = "Outstanding! Your profile is fully optimized for top opportunities."
            
        return profile_schemas.ProfileStrengthResponse(
            score=score,
            category=category,
            explanation=explanation
        )

    def _save_upload_file(self, file: UploadFile, sub_folder: str) -> str:
        upload_dir = os.path.join("uploads", sub_folder)
        os.makedirs(upload_dir, exist_ok=True)
        
        file_ext = os.path.splitext(file.filename)[1] if file.filename else ".png"
        unique_filename = f"{uuid.uuid4()}{file_ext}"
        file_path = os.path.join(upload_dir, unique_filename)
        
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
            
        return f"/uploads/{sub_folder}/{unique_filename}"

    def upload_avatar(self, user_id: str, file: UploadFile) -> profile_schemas.ImageUploadResponse:
        url = self._save_upload_file(file, "avatars")
        profile = self.db.query(UserProfile).filter(UserProfile.user_id == user_id).first()
        if not profile:
            profile = UserProfile(user_id=user_id)
            self.db.add(profile)
        profile.profile_picture_url = url
        self.db.commit()
        return profile_schemas.ImageUploadResponse(url=url)

    def upload_banner(self, user_id: str, file: UploadFile) -> profile_schemas.ImageUploadResponse:
        url = self._save_upload_file(file, "banners")
        profile = self.db.query(UserProfile).filter(UserProfile.user_id == user_id).first()
        if not profile:
            profile = UserProfile(user_id=user_id)
            self.db.add(profile)
        profile.cover_banner_url = url
        self.db.commit()
        return profile_schemas.ImageUploadResponse(url=url)

    # --- Personal Information ---
    def get_personal_info(self, user_id: str) -> profile_schemas.PersonalInfoResponse:
        profile = self.db.query(UserProfile).filter(UserProfile.user_id == user_id).first()
        user = self.db.query(User).filter(User.id == user_id).first()
        
        if not profile:
            profile = UserProfile(user_id=user_id)
            self.db.add(profile)
            self.db.commit()
            self.db.refresh(profile)
            
        languages = self.db.query(Language).filter(Language.profile_id == profile.id).all()
        
        resp_data = {**profile.__dict__}
        if user:
            resp_data["email"] = user.email
            resp_data["is_verified"] = user.is_verified
            resp_data["first_name"] = user.first_name
            resp_data["last_name"] = user.last_name
            
        resp_data["languages"] = [profile_schemas.LanguageResponse.model_validate(lang) for lang in languages]
        
        return profile_schemas.PersonalInfoResponse(**resp_data)

    def delete_avatar(self, user_id: str):
        profile = self.db.query(UserProfile).filter(UserProfile.user_id == user_id).first()
        if profile and profile.profile_picture_url:
            # We could optionally delete the file from the filesystem here if it exists locally
            # file_path = os.path.join(".", profile.profile_picture_url.lstrip("/"))
            # if os.path.exists(file_path): os.remove(file_path)
            profile.profile_picture_url = None
            self.db.commit()

    def update_personal_info(
        self, user_id: str, data: profile_schemas.PersonalInfoUpdate
    ):
        profile = (
            self.db.query(UserProfile).filter(UserProfile.user_id == user_id).first()
        )
        if not profile:
            profile = UserProfile(user_id=user_id)
            self.db.add(profile)
            self.db.commit()
            self.db.refresh(profile)
            
        user = self.db.query(User).filter(User.id == user_id).first()
        
        data_dict = data.model_dump(exclude_unset=True)
        
        if "first_name" in data_dict and user:
            user.first_name = data_dict.pop("first_name")
        if "last_name" in data_dict and user:
            user.last_name = data_dict.pop("last_name")
            
        languages_data = data_dict.pop("languages", None)

        for key, value in data_dict.items():
            setattr(profile, key, value)
            
        if languages_data is not None:
            # Delete existing languages
            self.db.query(Language).filter(Language.profile_id == profile.id).delete()
            # Add new languages
            for lang_data in languages_data:
                new_lang = Language(user_id=user_id, profile_id=profile.id, name=lang_data["name"], proficiency=lang_data["proficiency"])
                self.db.add(new_lang)

        self.db.commit()
        self.db.refresh(profile)
        
        return self.get_personal_info(user_id)

    def update_professional_summary(
        self, user_id: str, data: profile_schemas.ProfessionalSummaryUpdate
    ):
        profile = (
            self.db.query(UserProfile).filter(UserProfile.user_id == user_id).first()
        )
        if not profile:
            profile = UserProfile(user_id=user_id)
            self.db.add(profile)
        for key, value in data.model_dump(exclude_unset=True).items():
            setattr(profile, key, value)
        self.db.commit()
        self.db.refresh(profile)
        return profile_schemas.ProfessionalSummaryResponse(**profile.__dict__)

    def update_career_preferences(
        self, user_id: str, data: profile_schemas.CareerPreferenceUpdate
    ):
        pref = (
            self.db.query(CareerPreference)
            .filter(CareerPreference.user_id == user_id)
            .first()
        )
        if not pref:
            pref = CareerPreference(user_id=user_id)
            self.db.add(pref)
        for key, value in data.model_dump(exclude_unset=True).items():
            setattr(pref, key, value)
        self.db.commit()
        self.db.refresh(pref)
        return profile_schemas.CareerPreferenceResponse(**pref.__dict__)

    # --- Professional Information (New Module) ---
    def get_professional_info(self, user_id: str) -> profile_schemas.ProfessionalInfoResponse:
        profile = self.db.query(UserProfile).filter(UserProfile.user_id == user_id).first()
        career_pref = self.db.query(CareerPreference).filter(CareerPreference.user_id == user_id).first()

        if not profile:
            profile = UserProfile(user_id=user_id)
            self.db.add(profile)
        if not career_pref:
            career_pref = CareerPreference(user_id=user_id)
            self.db.add(career_pref)
            
        self.db.commit()

        resp_data = {}
        if profile:
            resp_data.update(profile.__dict__)
        if career_pref:
            resp_data.update(career_pref.__dict__)
            
        return profile_schemas.ProfessionalInfoResponse(**resp_data)

    def update_professional_info(self, user_id: str, data: profile_schemas.ProfessionalInfoUpdate) -> profile_schemas.ProfessionalInfoResponse:
        profile = self.db.query(UserProfile).filter(UserProfile.user_id == user_id).first()
        career_pref = self.db.query(CareerPreference).filter(CareerPreference.user_id == user_id).first()

        if not profile:
            profile = UserProfile(user_id=user_id)
            self.db.add(profile)
        if not career_pref:
            career_pref = CareerPreference(user_id=user_id)
            self.db.add(career_pref)

        data_dict = data.model_dump(exclude_unset=True)
        
        # Determine which fields go to UserProfile and which go to CareerPreference
        profile_fields = [
            "current_job_title", "current_company", "employment_status", 
            "years_of_experience", "total_months_of_experience", "industry", 
            "career_level", "current_annual_salary", "current_salary_currency", 
            "salary_type", "notice_period"
        ]
        
        career_pref_fields = [
            "expected_salary", "expected_joining_bonus", "negotiable_salary",
            "preferred_currency", "employment_types", "work_setup", 
            "preferred_locations", "preferred_time_zone", "willing_to_relocate", 
            "relocation_countries", "visa_status", "travel_willingness"
        ]
        
        for key, value in data_dict.items():
            if key in profile_fields:
                setattr(profile, key, value)
            elif key in career_pref_fields:
                setattr(career_pref, key, value)

        self.db.commit()
        
        return self.get_professional_info(user_id)

    def update_social_profiles(
        self, user_id: str, data: profile_schemas.SocialProfileUpdate
    ):
        social = (
            self.db.query(SocialProfile)
            .filter(SocialProfile.user_id == user_id)
            .first()
        )
        if not social:
            social = SocialProfile(user_id=user_id)
            self.db.add(social)
        for key, value in data.model_dump(exclude_unset=True).items():
            setattr(social, key, value)
        self.db.commit()
        self.db.refresh(social)
        return profile_schemas.SocialProfileResponse(**social.__dict__)

    def update_ai_preferences(
        self, user_id: str, data: profile_schemas.AIPreferenceUpdate
    ):
        pref = (
            self.db.query(AIPreference).filter(AIPreference.user_id == user_id).first()
        )
        if not pref:
            pref = AIPreference(user_id=user_id)
            self.db.add(pref)
        for key, value in data.model_dump(exclude_unset=True).items():
            setattr(pref, key, value)
        self.db.commit()
        self.db.refresh(pref)
        return profile_schemas.AIPreferenceResponse(**pref.__dict__)

    # --- Generic List CRUD Helpers ---
    def _create_item(self, model_class, user_id: str, data):
        item = model_class(user_id=user_id, **data.model_dump())
        self.db.add(item)
        self.db.commit()
        self.db.refresh(item)
        return item

    def _update_item(self, model_class, item_id, user_id, data):
        item = (
            self.db.query(model_class)
            .filter(model_class.id == item_id, model_class.user_id == user_id)
            .first()
        )
        if not item:
            raise HTTPException(status_code=404, detail="Item not found")
        for key, value in data.model_dump(exclude_unset=True).items():
            setattr(item, key, value)
        self.db.commit()
        self.db.refresh(item)
        return item

    def _delete_item(self, model_class, item_id, user_id):
        item = (
            self.db.query(model_class)
            .filter(model_class.id == item_id, model_class.user_id == user_id)
            .first()
        )
        if not item:
            raise HTTPException(status_code=404, detail="Item not found")
        self.db.delete(item)
        self.db.commit()
        return True
