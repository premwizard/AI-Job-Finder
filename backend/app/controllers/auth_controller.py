from fastapi import HTTPException
from sqlalchemy.orm import Session
from datetime import datetime, timedelta
from app.schemas.auth_schema import RegisterRequest, LoginRequest, RegisterResponse, TokenResponse
from app.schemas.password_reset_schema import ForgotPasswordRequest, ResetPasswordVerifyRequest, ResetPasswordRequest, SuccessResponse, VerifyResponse
from app.repositories import auth_repository, password_reset_repository
from app.services import auth_service, email_service
from app.models.models import User, PasswordResetToken
from app.utils.token import generate_secure_token, hash_token, hash_otp, verify_otp
from app.utils.otp import generate_otp
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

def forgot_password(db: Session, req: ForgotPasswordRequest) -> SuccessResponse:
    user = auth_repository.get_user_by_email(db, req.email)
    
    if user:
        # Check if user already requested in the last 60 seconds
        existing_tokens = password_reset_repository.get_tokens_by_user(db, user.id)
        for t in existing_tokens:
            if not t.used and t.created_at > datetime.utcnow() - timedelta(seconds=60):
                # Return success anyway to not leak info, but don't send email
                return SuccessResponse(message="Recovery email sent.")
            elif not t.used:
                # Invalidate older active tokens for this user
                t.used = True
                password_reset_repository.update_token(db, t)
        
        raw_token = generate_secure_token()
        raw_otp = generate_otp(6)
        
        token_hash = hash_token(raw_token)
        otp_hash = hash_otp(raw_otp)
        
        expires_at = datetime.utcnow() + timedelta(minutes=10)
        
        reset_record = PasswordResetToken(
            user_id=user.id,
            token_hash=token_hash,
            otp_hash=otp_hash,
            expires_at=expires_at,
            attempts=0,
            used=False
        )
        password_reset_repository.create_reset_token(db, reset_record)
        
        reset_link = f"http://localhost:3000/reset-password?token={raw_token}"
        
        # Send email in background ideally, but doing synchronous for simplicity
        email_service.send_password_reset_email(user.email, reset_link, raw_otp)
        
    return SuccessResponse(message="Recovery email sent.")

def verify_reset_token(db: Session, token: str) -> VerifyResponse:
    token_hash = hash_token(token)
    record = password_reset_repository.get_token_record(db, token_hash)
    
    if not record or record.used or record.expires_at < datetime.utcnow():
        return VerifyResponse(valid=False)
        
    return VerifyResponse(valid=True)

def reset_password(db: Session, req: ResetPasswordRequest) -> SuccessResponse:
    if req.new_password != req.confirm_password:
        raise HTTPException(status_code=400, detail="Passwords do not match")
        
    if not auth_service.validate_password_strength(req.new_password):
        raise HTTPException(status_code=400, detail="Password does not meet strength requirements")
        
    token_hash = hash_token(req.token)
    record = password_reset_repository.get_token_record(db, token_hash)
    
    if not record:
        raise HTTPException(status_code=400, detail="Invalid token")
        
    if record.used or record.expires_at < datetime.utcnow():
        raise HTTPException(status_code=400, detail="Reset link expired")
        
    if record.attempts >= 5:
        record.used = True
        password_reset_repository.update_token(db, record)
        raise HTTPException(status_code=400, detail="Too many invalid attempts. Request a new link.")
        
    if not verify_otp(req.otp, record.otp_hash):
        record.attempts += 1
        password_reset_repository.update_token(db, record)
        raise HTTPException(status_code=400, detail="Invalid OTP")
        
    user = auth_repository.get_user_by_email(db, record.user.email) # user relationship is loaded
    if auth_service.verify_password(req.new_password, user.password_hash):
        raise HTTPException(status_code=400, detail="New password cannot be the same as current password")
        
    # Success
    user.password_hash = auth_service.get_password_hash(req.new_password)
    # Important: To invalidate active sessions without a separate sessions table,
    # some systems track `updated_at` or a `password_version` in the JWT token.
    # We will assume changing the password_hash automatically invalidates the user's mind state 
    # and we just rely on client clearing localstorage. In a robust setup, you might store `jti` in a blacklist.
    user.updated_at = datetime.utcnow()
    auth_repository.update_user(db, user)
    
    password_reset_repository.delete_token(db, record)
    
    return SuccessResponse(message="Password updated successfully.")
