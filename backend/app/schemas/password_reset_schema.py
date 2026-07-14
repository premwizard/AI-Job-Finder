from pydantic import BaseModel, EmailStr, Field


class ForgotPasswordRequest(BaseModel):
    email: EmailStr


class ResetPasswordVerifyRequest(BaseModel):
    token: str


class ResetPasswordRequest(BaseModel):
    token: str
    otp: str = Field(..., min_length=6, max_length=6)
    new_password: str = Field(..., min_length=8)
    confirm_password: str = Field(..., min_length=8)


class SuccessResponse(BaseModel):
    success: bool = True
    message: str


class VerifyResponse(BaseModel):
    valid: bool
