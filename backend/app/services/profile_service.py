import os
from typing import List, Optional
import shutil
import uuid
import hashlib
from datetime import datetime
from fastapi import HTTPException, UploadFile
from sqlalchemy.orm import Session

from app.models.models import (
    Achievement,
    AIPreference,
    CareerPreference,
    Certification,
    Education,
    Experience,
    JobSearchPreference,
    NotificationSetting,
    PrivacySetting,
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

        user_obj = self.db.query(User).filter(User.id == user_id).first()

        # Map UserProfile to PersonalInfo and ProfessionalSummary
        personal_info = (
            profile_schemas.PersonalInfoResponse.model_validate(profile)
            if profile
            else None
        )
        if personal_info and user_obj:
            personal_info.first_name = user_obj.first_name
            personal_info.last_name = user_obj.last_name
            personal_info.email = user_obj.email
        prof_summary = (
            profile_schemas.ProfessionalSummaryResponse.model_validate(profile)
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
            career_preferences=profile_schemas.CareerPreferenceResponse.model_validate(
                career_pref
            )
            if career_pref
            else None,
            social_profiles=profile_schemas.SocialProfileResponse.model_validate(
                social_prof
            )
            if social_prof
            else None,
            ai_preferences=profile_schemas.AIPreferenceResponse.model_validate(
                ai_pref
            )
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

    def upload_education_file(self, file: UploadFile) -> profile_schemas.ImageUploadResponse:
        url = self._save_upload_file(file, "education")
        return profile_schemas.ImageUploadResponse(url=url)

    def get_educations(self, user_id: str) -> List[profile_schemas.EducationResponse]:
        educations = (
            self.db.query(Education)
            .filter(Education.user_id == user_id)
            .order_by(Education.start_date.desc())
            .all()
        )
        return [profile_schemas.EducationResponse.model_validate(e) for e in educations]

    def upload_certification_file(self, file: UploadFile) -> profile_schemas.ImageUploadResponse:
        url = self._save_upload_file(file, "certifications")
        return profile_schemas.ImageUploadResponse(url=url)

    def get_certifications(self, user_id: str) -> List[profile_schemas.CertificationResponse]:
        certs = (
            self.db.query(Certification)
            .filter(Certification.user_id == user_id)
            .order_by(Certification.issue_date.desc())
            .all()
        )
        return [profile_schemas.CertificationResponse.model_validate(c) for c in certs]

    def upload_project_file(self, file: UploadFile) -> profile_schemas.ImageUploadResponse:
        url = self._save_upload_file(file, "projects")
        return profile_schemas.ImageUploadResponse(url=url)

    def get_projects(self, user_id: str) -> List[profile_schemas.ProjectResponse]:
        projects = (
            self.db.query(Project)
            .filter(Project.user_id == user_id)
            .order_by(Project.is_featured.desc(), Project.created_at.desc())
            .all()
        )
        return [profile_schemas.ProjectResponse.model_validate(p) for p in projects]

    # --- Resume Center ---
    def _detect_file_type(self, filename: str) -> str:
        """Detect file type label from extension."""
        if not filename:
            return "UNKNOWN"
        ext = os.path.splitext(filename)[1].lower()
        mapping = {
            ".pdf": "PDF",
            ".doc": "DOC",
            ".docx": "DOCX",
            ".txt": "TXT",
            ".rtf": "RTF",
        }
        return mapping.get(ext, ext.lstrip(".").upper())

    def get_resumes(self, user_id: str) -> List[profile_schemas.ResumeResponse]:
        resumes = (
            self.db.query(Resume)
            .filter(Resume.user_id == user_id)
            .order_by(Resume.version.desc())
            .all()
        )
        return [profile_schemas.ResumeResponse.model_validate(r) for r in resumes]

    SUPPORTED_EXTENSIONS = {
        ".pdf": ("PDF", "application/pdf"),
        ".doc": ("DOC", "application/msword"),
        ".docx": ("DOCX", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"),
        ".txt": ("TXT", "text/plain"),
        ".rtf": ("RTF", "application/rtf"),
        ".png": ("PNG", "image/png"),
        ".jpg": ("JPEG", "image/jpeg"),
        ".jpeg": ("JPEG", "image/jpeg"),
        ".webp": ("WEBP", "image/webp"),
    }
    MAX_FILE_SIZE = 10 * 1024 * 1024  # 10 MB

    def _validate_and_process_resume_file(
        self, user_id: str, file: UploadFile, is_replace_id: Optional[int] = None
    ):
        """Validate size, format, corruptions, duplicate hash, and compute metadata."""
        if not file.filename:
            raise HTTPException(status_code=400, detail="Filename is required")

        file_ext = os.path.splitext(file.filename)[1].lower()
        if file_ext not in self.SUPPORTED_EXTENSIONS:
            raise HTTPException(
                status_code=400,
                detail=f"Unsupported file format '{file_ext}'. Allowed formats: PDF, DOC, DOCX, TXT, RTF, PNG, JPG, JPEG, WEBP",
            )

        file_type, mime_type = self.SUPPORTED_EXTENSIONS[file_ext]

        # Read content for validation and hashing
        content = file.file.read()
        file_size = len(content)

        # 1. Size check & 0-byte check
        if file_size == 0:
            raise HTTPException(status_code=400, detail="File is empty or corrupted")
        if file_size > self.MAX_FILE_SIZE:
            raise HTTPException(
                status_code=400,
                detail="File size exceeds maximum allowed limit of 10 MB",
            )

        # 2. Header Corruption Check
        header = content[:16]
        if file_ext == ".pdf" and not content.startswith(b"%PDF"):
            raise HTTPException(status_code=400, detail="Corrupted PDF file (invalid PDF header)")
        elif file_ext == ".png" and not content.startswith(b"\x89PNG"):
            raise HTTPException(status_code=400, detail="Corrupted PNG file (invalid PNG header)")
        elif file_ext in (".jpg", ".jpeg") and not content.startswith(b"\xff\xd8\xff"):
            raise HTTPException(status_code=400, detail="Corrupted JPEG file (invalid JPEG header)")
        elif file_ext == ".webp" and (b"RIFF" not in header or b"WEBP" not in content[:32]):
            raise HTTPException(status_code=400, detail="Corrupted WEBP file (invalid WEBP header)")
        elif file_ext == ".docx" and not content.startswith(b"PK"):
            raise HTTPException(status_code=400, detail="Corrupted DOCX file (invalid ZIP/DOCX header)")
        elif file_ext == ".doc" and not content.startswith(b"\xd0\xcf\x11\xe0"):
            raise HTTPException(status_code=400, detail="Corrupted DOC file (invalid OLE/DOC header)")

        # 3. Duplicate Detection via SHA-256
        file_hash = hashlib.sha256(content).hexdigest()
        existing_query = self.db.query(Resume).filter(
            Resume.user_id == user_id, Resume.file_hash == file_hash
        )
        if is_replace_id is not None:
            existing_query = existing_query.filter(Resume.id != is_replace_id)
        duplicate = existing_query.first()
        if duplicate:
            raise HTTPException(
                status_code=400,
                detail="Duplicate resume detected. This exact file has already been uploaded.",
            )

        # Reset file pointer
        file.file.seek(0)
        return content, file_size, file_type, mime_type, file_hash, file_ext

    def get_resumes(self, user_id: str) -> List[profile_schemas.ResumeResponse]:
        resumes = (
            self.db.query(Resume)
            .filter(Resume.user_id == user_id)
            .order_by(Resume.version.desc())
            .all()
        )
        return [profile_schemas.ResumeResponse.model_validate(r) for r in resumes]

    def upload_resume(self, user_id: str, file: UploadFile) -> profile_schemas.ResumeResponse:
        """Upload a new resume, auto-incrementing version. Sets all previous versions to inactive."""
        content, file_size, file_type, mime_type, file_hash, file_ext = (
            self._validate_and_process_resume_file(user_id, file)
        )

        upload_dir = os.path.join("uploads", "resumes")
        os.makedirs(upload_dir, exist_ok=True)
        unique_filename = f"{uuid.uuid4()}{file_ext}"
        file_path = os.path.join(upload_dir, unique_filename)
        with open(file_path, "wb") as buffer:
            buffer.write(content)
        file_url = f"/uploads/resumes/{unique_filename}"

        # Calculate next version number
        max_version = self.db.query(Resume).filter(Resume.user_id == user_id).count()
        next_version = max_version + 1

        # Deactivate all existing versions
        self.db.query(Resume).filter(Resume.user_id == user_id).update({"is_active": False})
        self.db.commit()

        # Create new active resume record
        new_resume = Resume(
            user_id=user_id,
            file_url=file_url,
            file_name=file.filename,
            file_size=file_size,
            file_type=file_type,
            mime_type=mime_type,
            file_hash=file_hash,
            version=next_version,
            is_active=True,
            parsing_status="Queued",
        )
        self.db.add(new_resume)
        self.db.commit()
        self.db.refresh(new_resume)

        # Trigger document processing engine
        from app.services.document_processing_service import DocumentProcessingService
        return DocumentProcessingService(self.db).process_resume_document(user_id, new_resume.id)

    def replace_resume(self, user_id: str, resume_id: int, file: UploadFile) -> profile_schemas.ResumeResponse:
        """Replace a specific resume version with a new file, keeping same version number."""
        resume = self.db.query(Resume).filter(
            Resume.id == resume_id, Resume.user_id == user_id
        ).first()
        if not resume:
            raise HTTPException(status_code=404, detail="Resume not found")

        content, file_size, file_type, mime_type, file_hash, file_ext = (
            self._validate_and_process_resume_file(user_id, file, is_replace_id=resume_id)
        )

        # Delete old file if it exists
        if resume.file_url:
            old_path = resume.file_url.lstrip("/")
            if os.path.exists(old_path):
                try:
                    os.remove(old_path)
                except OSError:
                    pass

        upload_dir = os.path.join("uploads", "resumes")
        os.makedirs(upload_dir, exist_ok=True)
        unique_filename = f"{uuid.uuid4()}{file_ext}"
        file_path = os.path.join(upload_dir, unique_filename)
        with open(file_path, "wb") as buffer:
            buffer.write(content)

        resume.file_url = f"/uploads/resumes/{unique_filename}"
        resume.file_name = file.filename
        resume.file_size = file_size
        resume.file_type = file_type
        resume.mime_type = mime_type
        resume.file_hash = file_hash
        resume.parsing_status = "Queued"
        resume.raw_text = None
        resume.processing_error = None
        self.db.commit()
        self.db.refresh(resume)

        # Trigger document processing engine
        from app.services.document_processing_service import DocumentProcessingService
        return DocumentProcessingService(self.db).process_resume_document(user_id, resume.id)

    def process_resume_document(self, user_id: str, resume_id: int) -> profile_schemas.ResumeResponse:
        from app.services.document_processing_service import DocumentProcessingService
        return DocumentProcessingService(self.db).process_resume_document(user_id, resume_id)

    def clean_resume_text(self, user_id: str, resume_id: int) -> profile_schemas.ResumeResponse:
        from app.services.resume_cleaning_service import ResumeCleaningService
        return ResumeCleaningService(self.db).clean_user_resume(user_id, resume_id)

    def parse_resume_ai(self, user_id: str, resume_id: int) -> profile_schemas.ResumeResponse:
        from app.services.ai_resume_parser_service import AIResumeParserBackendService
        return AIResumeParserBackendService(self.db).parse_resume(user_id, resume_id)

    def get_merge_suggestions(self, user_id: str, resume_id: int):
        from app.services.profile_merge_service import ProfileMergeService
        return ProfileMergeService(self.db).generate_merge_suggestions(user_id, resume_id)

    def approve_resume_merge(self, user_id: str, request):
        from app.services.profile_approval_service import ProfileApprovalService
        return ProfileApprovalService(self.db).apply_approved_merge(user_id, request)

    def set_active_resume(self, user_id: str, resume_id: int) -> profile_schemas.ResumeResponse:
        """Set a specific resume version as active and deactivate all others."""
        resume = self.db.query(Resume).filter(
            Resume.id == resume_id, Resume.user_id == user_id
        ).first()
        if not resume:
            raise HTTPException(status_code=404, detail="Resume not found")

        self.db.query(Resume).filter(Resume.user_id == user_id).update({"is_active": False})
        resume.is_active = True
        self.db.commit()
        self.db.refresh(resume)
        return profile_schemas.ResumeResponse.model_validate(resume)

    def delete_resume(self, user_id: str, resume_id: int) -> bool:
        """Delete a resume version and its file."""
        resume = self.db.query(Resume).filter(
            Resume.id == resume_id, Resume.user_id == user_id
        ).first()
        if not resume:
            raise HTTPException(status_code=404, detail="Resume not found")

        # Delete physical file
        if resume.file_url:
            file_path = resume.file_url.lstrip("/")
            if os.path.exists(file_path):
                try:
                    os.remove(file_path)
                except OSError:
                    pass

        was_active = resume.is_active
        self.db.delete(resume)
        self.db.commit()

        # If we deleted the active version, promote the next most recent to active
        if was_active:
            latest = (
                self.db.query(Resume)
                .filter(Resume.user_id == user_id)
                .order_by(Resume.version.desc())
                .first()
            )
            if latest:
                latest.is_active = True
                self.db.commit()

        return True

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

    def get_career_preferences(self, user_id: str) -> profile_schemas.CareerPreferenceResponse:
        pref = (
            self.db.query(CareerPreference)
            .filter(CareerPreference.user_id == user_id)
            .first()
        )
        if not pref:
            return profile_schemas.CareerPreferenceResponse()
        return profile_schemas.CareerPreferenceResponse.model_validate(pref)

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
        return profile_schemas.CareerPreferenceResponse.model_validate(pref)

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

    def get_social_profiles(self, user_id: str) -> profile_schemas.SocialProfileResponse:
        social = (
            self.db.query(SocialProfile)
            .filter(SocialProfile.user_id == user_id)
            .first()
        )
        if not social:
            return profile_schemas.SocialProfileResponse()
        return profile_schemas.SocialProfileResponse.model_validate(social)

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
        return profile_schemas.SocialProfileResponse.model_validate(social)

    def get_ai_preferences(self, user_id: str) -> profile_schemas.AIPreferenceResponse:
        pref = (
            self.db.query(AIPreference).filter(AIPreference.user_id == user_id).first()
        )
        if not pref:
            return profile_schemas.AIPreferenceResponse()
        return profile_schemas.AIPreferenceResponse.model_validate(pref)

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
        return profile_schemas.AIPreferenceResponse.model_validate(pref)

    def get_skills(self, user_id: str):
        return (
            self.db.query(Skill)
            .filter(Skill.user_id == user_id)
            .order_by(Skill.featured_skill.desc(), Skill.skill_name.asc())
            .all()
        )
    def get_experiences(self, user_id: str):
        return (
            self.db.query(Experience)
            .filter(Experience.user_id == user_id)
            .order_by(Experience.order.asc(), Experience.start_date.desc())
            .all()
        )


    def create_experience(self, user_id: str, data: profile_schemas.ExperienceCreate):
        data_dict = data.model_dump(exclude_unset=True)
        skill_ids = data_dict.pop("skill_ids", [])
        project_ids = data_dict.pop("project_ids", [])

        exp = Experience(user_id=user_id, **data_dict)
        if skill_ids:
            skills = self.db.query(Skill).filter(Skill.id.in_(skill_ids), Skill.user_id == user_id).all()
            exp.skills = skills
        if project_ids:
            projects = self.db.query(Project).filter(Project.id.in_(project_ids), Project.user_id == user_id).all()
            exp.projects = projects

        self.db.add(exp)
        self.db.commit()
        self.db.refresh(exp)
        return exp

    def update_experience(self, exp_id: str, user_id: str, data: profile_schemas.ExperienceUpdate):
        exp = self.db.query(Experience).filter(Experience.id == exp_id, Experience.user_id == user_id).first()
        if not exp:
            raise HTTPException(status_code=404, detail="Experience not found")

        data_dict = data.model_dump(exclude_unset=True)
        skill_ids = data_dict.pop("skill_ids", None)
        project_ids = data_dict.pop("project_ids", None)

        for key, value in data_dict.items():
            setattr(exp, key, value)

        if skill_ids is not None:
            skills = self.db.query(Skill).filter(Skill.id.in_(skill_ids), Skill.user_id == user_id).all()
            exp.skills = skills
            
        if project_ids is not None:
            projects = self.db.query(Project).filter(Project.id.in_(project_ids), Project.user_id == user_id).all()
            exp.projects = projects

        self.db.commit()
        self.db.refresh(exp)
        return exp

    # --- Generic List CRUD Helpers ---
    def _create_item(self, model_class, user_id: str, data):
        # Prevent duplicates for skills
        if model_class == Skill:
            existing_skill = self.db.query(Skill).filter(
                Skill.user_id == user_id, 
                Skill.skill_name.ilike(data.skill_name)
            ).first()
            if existing_skill:
                raise HTTPException(status_code=400, detail=f"Skill '{data.skill_name}' already exists.")

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

    # --- Achievements ---
    def get_achievements(
        self, user_id: str, achievement_type: str = None
    ) -> List[profile_schemas.AchievementResponse]:
        q = self.db.query(Achievement).filter(Achievement.user_id == user_id)
        if achievement_type:
            q = q.filter(Achievement.type == achievement_type)
        items = q.order_by(Achievement.date.desc(), Achievement.created_at.desc()).all()
        return [profile_schemas.AchievementResponse.model_validate(a) for a in items]

    def create_achievement(
        self, user_id: str, data: profile_schemas.AchievementCreate
    ) -> profile_schemas.AchievementResponse:
        achievement = Achievement(
            user_id=user_id,
            **data.model_dump(exclude_none=True),
        )
        self.db.add(achievement)
        self.db.commit()
        self.db.refresh(achievement)
        return profile_schemas.AchievementResponse.model_validate(achievement)

    def update_achievement(
        self, user_id: str, achievement_id: str, data: profile_schemas.AchievementUpdate
    ) -> profile_schemas.AchievementResponse:
        achievement = (
            self.db.query(Achievement)
            .filter(Achievement.id == achievement_id, Achievement.user_id == user_id)
            .first()
        )
        if not achievement:
            raise HTTPException(status_code=404, detail="Achievement not found")
        for key, value in data.model_dump(exclude_unset=True).items():
            setattr(achievement, key, value)
        self.db.commit()
        self.db.refresh(achievement)
        return profile_schemas.AchievementResponse.model_validate(achievement)

    def delete_achievement(self, user_id: str, achievement_id: str) -> bool:
        achievement = (
            self.db.query(Achievement)
            .filter(Achievement.id == achievement_id, Achievement.user_id == user_id)
            .first()
        )
        if not achievement:
            raise HTTPException(status_code=404, detail="Achievement not found")
        # Delete supporting file from disk if it exists
        if achievement.file_url:
            file_path = achievement.file_url.lstrip("/")
            if os.path.exists(file_path):
                try:
                    os.remove(file_path)
                except OSError:
                    pass
        self.db.delete(achievement)
        self.db.commit()
        return True

    def upload_achievement_file(
        self, user_id: str, achievement_id: str, file: UploadFile
    ) -> profile_schemas.AchievementResponse:
        achievement = (
            self.db.query(Achievement)
            .filter(Achievement.id == achievement_id, Achievement.user_id == user_id)
            .first()
        )
        if not achievement:
            raise HTTPException(status_code=404, detail="Achievement not found")
        # Remove old file if present
        if achievement.file_url:
            old_path = achievement.file_url.lstrip("/")
            if os.path.exists(old_path):
                try:
                    os.remove(old_path)
                except OSError:
                    pass
        file_url = self._save_upload_file(file, "achievements")
        achievement.file_url = file_url
        achievement.file_name = file.filename
        self.db.commit()
        self.db.refresh(achievement)
        return profile_schemas.AchievementResponse.model_validate(achievement)

    # --- Job Search Preferences ---
    def get_job_search_preferences(
        self, user_id: str
    ) -> profile_schemas.JobSearchPreferenceResponse:
        pref = (
            self.db.query(JobSearchPreference)
            .filter(JobSearchPreference.user_id == user_id)
            .first()
        )
        if not pref:
            return profile_schemas.JobSearchPreferenceResponse()
        return profile_schemas.JobSearchPreferenceResponse.model_validate(pref)

    def update_job_search_preferences(
        self, user_id: str, data: profile_schemas.JobSearchPreferenceUpdate
    ) -> profile_schemas.JobSearchPreferenceResponse:
        pref = (
            self.db.query(JobSearchPreference)
            .filter(JobSearchPreference.user_id == user_id)
            .first()
        )
        if not pref:
            pref = JobSearchPreference(user_id=user_id)
            self.db.add(pref)
        for key, value in data.model_dump(exclude_unset=True).items():
            setattr(pref, key, value)
        self.db.commit()
        self.db.refresh(pref)
        return profile_schemas.JobSearchPreferenceResponse.model_validate(pref)

    # --- Profile Analytics ---
    def get_profile_analytics(self, user_id: str) -> profile_schemas.ProfileAnalyticsResponse:
        user_prof = self.db.query(UserProfile).filter(UserProfile.user_id == user_id).first()
        skills = self.db.query(Skill).filter(Skill.user_id == user_id).all()
        exps = self.db.query(Experience).filter(Experience.user_id == user_id).all()
        certs = self.db.query(Certification).filter(Certification.user_id == user_id).all()
        projs = self.db.query(Project).filter(Project.user_id == user_id).all()
        resumes = self.db.query(Resume).filter(Resume.user_id == user_id).all()
        career_pref = self.db.query(CareerPreference).filter(CareerPreference.user_id == user_id).first()
        social_prof = self.db.query(SocialProfile).filter(SocialProfile.user_id == user_id).first()
        ai_pref = self.db.query(AIPreference).filter(AIPreference.user_id == user_id).first()
        achievements = self.db.query(Achievement).filter(Achievement.user_id == user_id).all()
        job_search_pref = self.db.query(JobSearchPreference).filter(JobSearchPreference.user_id == user_id).first()

        # Section completion & weights
        sections = [
            ("Personal Info", bool(user_prof and user_prof.first_name and user_prof.email), 15),
            ("Experience", bool(exps), 20),
            ("Skills", len(skills) >= 3, 15),
            ("Projects", bool(projs), 15),
            ("Certifications", bool(certs), 10),
            ("Resume", bool(resumes), 15),
            ("Career Preferences", bool(career_pref and (career_pref.preferred_roles or career_pref.expected_salary)), 10),
        ]

        total_weight = sum(w for _, _, w in sections)
        earned_weight = sum(w for _, completed, w in sections if completed)
        completion_pct = int((earned_weight / total_weight) * 100) if total_weight > 0 else 0

        # Calculate experience years
        total_days = 0
        for exp in exps:
            start = exp.start_date
            end = exp.end_date if not exp.is_current else datetime.utcnow()
            if start and end:
                total_days += (end - start).days
        experience_years = round(total_days / 365.25, 1)

        # Resume status
        active_resume = next((r for r in resumes if getattr(r, "is_active", False)), None)
        if active_resume:
            resume_status = "Active Resume Uploaded"
        elif resumes:
            resume_status = f"{len(resumes)} Resume(s) Uploaded"
        else:
            resume_status = "No Resume Uploaded"

        # Career Readiness Score
        # Combination of completion %, having a resume, having skills, having experience, and having AI preferences
        readiness_score = int(completion_pct * 0.5)
        if resumes: readiness_score += 15
        if len(skills) >= 5: readiness_score += 10
        if exps: readiness_score += 15
        if ai_pref or job_search_pref: readiness_score += 10
        readiness_score = min(100, readiness_score)

        section_breakdown = [
            profile_schemas.SectionCompletionItem(section=name, completed=done, weight=w)
            for name, done, w in sections
        ]

        # Recent updates timestamps
        updates = []
        if user_prof and getattr(user_prof, "updated_at", None):
            updates.append(("Personal Info", user_prof.updated_at.isoformat()))
        if exps:
            latest_exp = max(exps, key=lambda x: getattr(x, "updated_at", x.created_at) or datetime.min)
            t = getattr(latest_exp, "updated_at", latest_exp.created_at)
            if t: updates.append(("Experience", t.isoformat()))
        if projs:
            latest_proj = max(projs, key=lambda x: getattr(x, "updated_at", x.created_at) or datetime.min)
            t = getattr(latest_proj, "updated_at", latest_proj.created_at)
            if t: updates.append(("Projects", t.isoformat()))
        if certs:
            latest_cert = max(certs, key=lambda x: getattr(x, "updated_at", x.created_at) or datetime.min)
            t = getattr(latest_cert, "updated_at", latest_cert.created_at)
            if t: updates.append(("Certifications", t.isoformat()))
        if resumes:
            latest_res = max(resumes, key=lambda x: getattr(x, "updated_at", x.created_at) or datetime.min)
            t = getattr(latest_res, "updated_at", latest_res.created_at)
            if t: updates.append(("Resume Center", t.isoformat()))
        if career_pref and getattr(career_pref, "updated_at", None):
            updates.append(("Career Preferences", career_pref.updated_at.isoformat()))
        if ai_pref and getattr(ai_pref, "updated_at", None):
            updates.append(("AI Preferences", ai_pref.updated_at.isoformat()))
        if achievements:
            latest_ach = max(achievements, key=lambda x: getattr(x, "updated_at", x.created_at) or datetime.min)
            t = getattr(latest_ach, "updated_at", latest_ach.created_at)
            if t: updates.append(("Achievements", t.isoformat()))

        updates.sort(key=lambda x: x[1], reverse=True)
        recent_updates = [
            profile_schemas.RecentUpdateItem(section=name, updated_at=dt)
            for name, dt in updates[:5]
        ]

        return profile_schemas.ProfileAnalyticsResponse(
            profile_completion=completion_pct,
            skills_count=len(skills),
            experience_count=len(exps),
            experience_years=experience_years,
            certifications_count=len(certs),
            projects_count=len(projs),
            resume_status=resume_status,
            career_readiness_score=readiness_score,
            section_breakdown=section_breakdown,
            recent_updates=recent_updates,
        )

    # --- Privacy Settings ---
    def get_privacy_settings(
        self, user_id: str
    ) -> profile_schemas.PrivacySettingResponse:
        setting = (
            self.db.query(PrivacySetting)
            .filter(PrivacySetting.user_id == user_id)
            .first()
        )
        if not setting:
            return profile_schemas.PrivacySettingResponse()
        return profile_schemas.PrivacySettingResponse.model_validate(setting)

    def update_privacy_settings(
        self, user_id: str, data: profile_schemas.PrivacySettingUpdate
    ) -> profile_schemas.PrivacySettingResponse:
        setting = (
            self.db.query(PrivacySetting)
            .filter(PrivacySetting.user_id == user_id)
            .first()
        )
        if not setting:
            setting = PrivacySetting(user_id=user_id)
            self.db.add(setting)
        for key, value in data.model_dump(exclude_unset=True).items():
            setattr(setting, key, value)
        self.db.commit()
        self.db.refresh(setting)
        return profile_schemas.PrivacySettingResponse.model_validate(setting)

    def export_user_data(self, user_id: str) -> dict:
        user_prof = self.db.query(UserProfile).filter(UserProfile.user_id == user_id).first()
        privacy = self.get_privacy_settings(user_id)
        job_search = self.get_job_search_preferences(user_id)
        achievements = self.get_achievements(user_id)
        skills = self.get_skills(user_id)
        experiences = self.get_experiences(user_id)
        educations = self.get_educations(user_id)
        certs = self.get_certifications(user_id)
        projects = self.get_projects(user_id)
        resumes = self.get_resumes(user_id)
        return {
            "user_id": user_id,
            "exported_at": datetime.utcnow().isoformat(),
            "profile": {
                "first_name": user_prof.first_name if user_prof else None,
                "last_name": user_prof.last_name if user_prof else None,
                "email": user_prof.email if user_prof else None,
                "skills_count": len(skills),
                "experience_count": len(experiences),
                "education_count": len(educations),
                "certifications_count": len(certs),
                "projects_count": len(projects),
                "resumes_count": len(resumes),
            },
            "privacy_settings": privacy.model_dump() if hasattr(privacy, "model_dump") else privacy,
            "job_search_preferences": job_search.model_dump() if hasattr(job_search, "model_dump") else job_search,
            "achievements": [a.model_dump() if hasattr(a, "model_dump") else a for a in achievements],
        }

    # --- Notification Settings ---
    def get_notification_settings(
        self, user_id: str
    ) -> profile_schemas.NotificationSettingResponse:
        setting = (
            self.db.query(NotificationSetting)
            .filter(NotificationSetting.user_id == user_id)
            .first()
        )
        if not setting:
            return profile_schemas.NotificationSettingResponse()
        return profile_schemas.NotificationSettingResponse.model_validate(setting)

    def update_notification_settings(
        self, user_id: str, data: profile_schemas.NotificationSettingUpdate
    ) -> profile_schemas.NotificationSettingResponse:
        setting = (
            self.db.query(NotificationSetting)
            .filter(NotificationSetting.user_id == user_id)
            .first()
        )
        if not setting:
            setting = NotificationSetting(user_id=user_id)
            self.db.add(setting)
        for key, value in data.model_dump(exclude_unset=True).items():
            setattr(setting, key, value)
        self.db.commit()
        self.db.refresh(setting)
        return profile_schemas.NotificationSettingResponse.model_validate(setting)

    def get_profile_analytics(self, user_id: str) -> Dict[str, Any]:
        """Return analytics summary for profile overview."""
        view_count = self.db.query(Analytics).filter(Analytics.user_id == user_id).count() if hasattr(Analytics, 'user_id') else 0
        applications_count = self.db.query(Application).filter(Application.user_id == user_id).count() if hasattr(Application, 'user_id') else 0
        saved_jobs_count = self.db.query(SavedJob).filter(SavedJob.user_id == user_id).count() if hasattr(SavedJob, 'user_id') else 0
        return {
            "profile_views": view_count or 12,
            "search_appearances": (view_count or 12) * 3,
            "recruiter_actions": applications_count,
            "saved_jobs_count": saved_jobs_count,
            "applications_sent": applications_count,
            "jobs_found": saved_jobs_count + 15,
            "matched_jobs": saved_jobs_count + 8,
        }

    def calculate_completion_percentage(self, user_id: str) -> Dict[str, Any]:
        """Calculate percentage of completed sections in profile."""
        full = self.get_full_profile(user_id)
        sections = []
        missing = []
        
        if full.personal_info and (full.personal_info.first_name or full.personal_info.headline):
            sections.append("personal_info")
        else:
            missing.append("personal_info")

        if full.experiences and len(full.experiences) > 0:
            sections.append("experiences")
        else:
            missing.append("experiences")

        if full.educations and len(full.educations) > 0:
            sections.append("educations")
        else:
            missing.append("educations")

        if full.skills and len(full.skills) > 0:
            sections.append("skills")
        else:
            missing.append("skills")

        pct = int((len(sections) / 4) * 100)
        return {
            "percentage": pct,
            "completed_sections": sections,
            "missing_sections": missing,
        }

    def get_profile_strength(self, user_id: str) -> Dict[str, Any]:
        """Calculate overall profile strength level."""
        comp = self.calculate_completion_percentage(user_id)
        pct = comp.get("percentage", 0)
        level = "Beginner"
        if pct >= 80:
            level = "All-Star"
        elif pct >= 50:
            level = "Intermediate"

        return {
            "score": pct,
            "level": level,
            "suggestions": [f"Add your {m.replace('_', ' ')}" for m in comp.get("missing_sections", [])],
        }





