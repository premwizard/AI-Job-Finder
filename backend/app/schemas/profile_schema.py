from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime

class UserProfileBase(BaseModel):
    current_job_title: Optional[str] = None
    preferred_role: Optional[str] = None
    years_of_experience: Optional[str] = None
    highest_education: Optional[str] = None
    current_company: Optional[str] = None
    preferred_locations: Optional[str] = None
    work_preference: Optional[str] = None
    expected_salary: Optional[str] = None
    preferred_companies: Optional[str] = None
    notice_period: Optional[str] = None
    open_to_relocation: Optional[bool] = False
    job_type: Optional[str] = None

class UserProfileCreate(UserProfileBase):
    pass

class UserProfileUpdate(UserProfileBase):
    pass

class UserProfileResponse(UserProfileBase):
    id: str
    user_id: str
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
