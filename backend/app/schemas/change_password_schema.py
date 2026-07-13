from pydantic import BaseModel, EmailStr
from typing import Optional

class ChangePasswordRequest(BaseModel):
    current_password: str
    new_password: str
    confirm_password: str

class VerifyPasswordChangeRequest(BaseModel):
    otp: str

class SuccessResponse(BaseModel):
    success: bool
    message: str
