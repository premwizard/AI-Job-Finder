from fastapi import HTTPException
from sqlalchemy.orm import Session
from app.schemas.auth_schema import RegisterRequest, LoginRequest, RegisterResponse, TokenResponse
from app.repositories import auth_repository
from app.services import auth_service
from app.models.models import User
from datetime import timedelta
from app.config.config import ACCESS_TOKEN_EXPIRE_MINUTES

def register_user(db: Session, req: RegisterRequest) -> RegisterResponse:
    if req.password != req.confirm_password:
        raise HTTPException(status_code=400, detail="Passwords do not match")

    if not auth_service.validate_password_strength(req.password):
        raise HTTPException(status_code=400, detail="Password does not meet strength requirements")
        
    existing_user = auth_repository.get_user_by_email(db, req.email)
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")

    hashed_password = auth_service.get_password_hash(req.password)
    
    new_user = User(
        first_name=req.first_name,
        last_name=req.last_name,
        email=req.email,
        password_hash=hashed_password,
        is_verified=False,
        is_active=True
    )
    
    saved_user = auth_repository.create_user(db, new_user)
    
    access_token = auth_service.create_access_token(
        data={"sub": saved_user.email},
        expires_delta=timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    )
    
    return RegisterResponse(user=saved_user, token=access_token)

def login_user(db: Session, req: LoginRequest) -> TokenResponse:
    user = auth_repository.get_user_by_email(db, req.email)
    if not user:
        raise HTTPException(status_code=401, detail="Invalid email or password")
        
    if not auth_service.verify_password(req.password, user.password_hash):
        raise HTTPException(status_code=401, detail="Invalid email or password")
        
    if not user.is_active:
        raise HTTPException(status_code=400, detail="User is inactive")
        
    access_token = auth_service.create_access_token(
        data={"sub": user.email},
        expires_delta=timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    )
    
    return TokenResponse(access_token=access_token, user=user)

def get_current_user_profile(user: User):
    return user
