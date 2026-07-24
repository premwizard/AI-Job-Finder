from pydantic import BaseModel, EmailStr, Field


class RegisterRequest(BaseModel):
    first_name: str = Field(..., min_length=1)
    last_name: str = Field(..., min_length=1)
    email: EmailStr
    password: str = Field(..., min_length=8)
    confirm_password: str = Field(..., min_length=8)


class LoginRequest(BaseModel):
    email: EmailStr
    password: str = Field(..., min_length=1)
    remember_me: bool = False


class UserResponse(BaseModel):
    id: str
    first_name: Optional[str] = ""
    last_name: Optional[str] = ""
    email: str
    is_verified: Optional[bool] = False
    is_active: Optional[bool] = True

    class Config:
        from_attributes = True
        populate_by_name = True


class TokenResponse(BaseModel):
    success: bool = True
    access_token: str
    token_type: str = "bearer"
    user: UserResponse


class RegisterResponse(BaseModel):
    success: bool = True
    user: UserResponse
    token: str
