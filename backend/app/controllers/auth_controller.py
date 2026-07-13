from fastapi import HTTPException
from sqlalchemy.orm import Session
from datetime import datetime, timedelta
from app.schemas.auth_schema import RegisterRequest, LoginRequest, RegisterResponse, TokenResponse
from app.schemas.password_reset_schema import ForgotPasswordRequest, ResetPasswordVerifyRequest, ResetPasswordRequest, SuccessResponse, VerifyResponse
from app.repositories import auth_repository, password_reset_repository
from app.services import auth_service, email_service
from app.models.models import User, PasswordResetToken, EmailVerificationToken
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

from fastapi import Request, Response
from app.schemas.refresh_token_schema import RefreshTokenCreate
from app.repositories import refresh_token_repository
from app.config.config import REFRESH_TOKEN_EXPIRE_DAYS

def login_user(db: Session, req: LoginRequest, request: Request, response: Response) -> TokenResponse:
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
    
    # Generate Refresh Token
    raw_refresh_token = generate_secure_token()
    token_hash = hash_token(raw_refresh_token)
    
    expires_at = datetime.utcnow() + timedelta(days=REFRESH_TOKEN_EXPIRE_DAYS)
    
    rt_create = RefreshTokenCreate(
        user_id=user.id,
        token_hash=token_hash,
        device_name=request.headers.get('User-Agent', '')[:200],
        ip_address=request.client.host if request.client else None,
        user_agent=request.headers.get('User-Agent', '')[:500],
        expires_at=expires_at
    )
    refresh_token_repository.create_refresh_token(db, rt_create)
    
    # Set Cookie
    cookie_kwargs = {
        'key': 'refresh_token',
        'value': raw_refresh_token,
        'httponly': True,
        'secure': False,  # Should be True in production with HTTPS
        'samesite': 'lax',
        'path': '/api/auth/refresh'
    }
    if req.remember_me:
        cookie_kwargs['max_age'] = REFRESH_TOKEN_EXPIRE_DAYS * 24 * 60 * 60
        cookie_kwargs['expires'] = expires_at.strftime('%a, %d %b %Y %H:%M:%S GMT')
    
    response.set_cookie(**cookie_kwargs)
    
    return TokenResponse(access_token=access_token, user=user)

def refresh_access_token(db: Session, request: Request, response: Response) -> TokenResponse:
    refresh_token = request.cookies.get('refresh_token')
    if not refresh_token:
        raise HTTPException(status_code=401, detail="Refresh token missing")
        
    token_hash = hash_token(refresh_token)
    db_token = refresh_token_repository.get_refresh_token_by_hash(db, token_hash)
    
    if not db_token or db_token.revoked or db_token.expires_at < datetime.utcnow():
        response.delete_cookie('refresh_token', path='/api/auth/refresh')
        raise HTTPException(status_code=401, detail="Invalid or expired refresh token")
        
    user = auth_repository.get_user_by_id(db, db_token.user_id)
    if not user or not user.is_active:
        raise HTTPException(status_code=401, detail="User not found or inactive")
        
    # Rotate refresh token
    refresh_token_repository.revoke_refresh_token(db, db_token)
    
    new_raw_refresh_token = generate_secure_token()
    new_token_hash = hash_token(new_raw_refresh_token)
    new_expires_at = datetime.utcnow() + timedelta(days=REFRESH_TOKEN_EXPIRE_DAYS)
    
    rt_create = RefreshTokenCreate(
        user_id=user.id,
        token_hash=new_token_hash,
        device_name=request.headers.get('User-Agent', '')[:200],
        ip_address=request.client.host if request.client else None,
        user_agent=request.headers.get('User-Agent', '')[:500],
        expires_at=new_expires_at
    )
    refresh_token_repository.create_refresh_token(db, rt_create)
    
    access_token = auth_service.create_access_token(
        data={"sub": user.email},
        expires_delta=timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    )
    
    days_left = (db_token.expires_at - datetime.utcnow()).days
    
    cookie_kwargs = {
        'key': 'refresh_token',
        'value': new_raw_refresh_token,
        'httponly': True,
        'secure': False,
        'samesite': 'lax',
        'path': '/api/auth/refresh'
    }
    
    if days_left > 1:
        cookie_kwargs['max_age'] = REFRESH_TOKEN_EXPIRE_DAYS * 24 * 60 * 60
        cookie_kwargs['expires'] = new_expires_at.strftime('%a, %d %b %Y %H:%M:%S GMT')
        
    response.set_cookie(**cookie_kwargs)
    
    return TokenResponse(access_token=access_token, user=user)

def logout_user(db: Session, request: Request, response: Response):
    refresh_token = request.cookies.get('refresh_token')
    if refresh_token:
        token_hash = hash_token(refresh_token)
        db_token = refresh_token_repository.get_refresh_token_by_hash(db, token_hash)
        if db_token:
            refresh_token_repository.revoke_refresh_token(db, db_token)
            
    response.delete_cookie('refresh_token', path='/api/auth/refresh')
    return {"success": True, "message": "Logged out successfully"}

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

from app.schemas.email_verification_schema import VerificationStatusResponse
from app.repositories import email_verification_repository

def send_verification_email(db: Session, user: User) -> SuccessResponse:
    if user.is_verified:
        raise HTTPException(status_code=400, detail="Email is already verified")
        
    # Check cooldown (60 seconds)
    existing_tokens = db.query(EmailVerificationToken).filter(
        EmailVerificationToken.user_id == user.id,
        EmailVerificationToken.used == False
    ).all()
    
    for t in existing_tokens:
        if t.created_at > datetime.utcnow() - timedelta(seconds=60):
            return SuccessResponse(message="Verification email sent.") # Silently throttle
            
    raw_token = generate_secure_token()
    token_hash = hash_token(raw_token)
    expires_at = datetime.utcnow() + timedelta(hours=24)
    
    email_verification_repository.create_verification_token(db, user.id, token_hash, expires_at)
    
    verification_link = f"http://localhost:3000/verify-email?token={raw_token}"
    email_service.send_verification_email(user.email, verification_link)
    
    return SuccessResponse(message="Verification email sent.")

def verify_email(db: Session, token: str) -> SuccessResponse:
    token_hash = hash_token(token)
    record = email_verification_repository.get_token_by_hash(db, token_hash)
    
    if not record:
        raise HTTPException(status_code=400, detail="Invalid token")
        
    if record.used or record.expires_at < datetime.utcnow():
        raise HTTPException(status_code=400, detail="This verification link is invalid or has expired")
        
    email_verification_repository.verify_user_email(db, record.user_id)
    email_verification_repository.mark_token_used(db, record.id)
    
    return SuccessResponse(message="Email verified successfully.")

def get_verification_status(user: User) -> VerificationStatusResponse:
    return VerificationStatusResponse(is_verified=user.is_verified)
