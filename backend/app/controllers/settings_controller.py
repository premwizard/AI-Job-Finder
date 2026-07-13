from fastapi import HTTPException, Request, Response
from sqlalchemy.orm import Session
from datetime import datetime, timedelta
from app.models.models import User, PasswordChangeRequest, RefreshToken
from app.schemas.change_password_schema import ChangePasswordRequest, VerifyPasswordChangeRequest, SuccessResponse
from app.repositories import password_change_repository, auth_repository, refresh_token_repository
from app.services import auth_service, email_service
from app.utils.token import hash_otp, verify_otp
from app.utils.otp import generate_otp

def request_password_change(db: Session, current_user: User, req: ChangePasswordRequest) -> SuccessResponse:
    if not auth_service.verify_password(req.current_password, current_user.password_hash):
        raise HTTPException(status_code=400, detail="Incorrect current password")

    if req.new_password != req.confirm_password:
        raise HTTPException(status_code=400, detail="Passwords do not match")
        
    if not auth_service.validate_password_strength(req.new_password):
        raise HTTPException(status_code=400, detail="Password does not meet strength requirements")
        
    if auth_service.verify_password(req.new_password, current_user.password_hash):
        raise HTTPException(status_code=400, detail="New password cannot be the same as the current password")
        
    # Invalidate any existing active password change requests
    existing_request = password_change_repository.get_active_request_by_user(db, current_user.id)
    if existing_request:
        existing_request.used = True
        password_change_repository.update_request(db, existing_request)
        
    raw_otp = generate_otp(6)
    otp_hash = hash_otp(raw_otp)
    expires_at = datetime.utcnow() + timedelta(minutes=10)
    
    new_password_hash = auth_service.get_password_hash(req.new_password)
    
    new_request = PasswordChangeRequest(
        user_id=current_user.id,
        otp_hash=otp_hash,
        new_password_hash=new_password_hash,
        expires_at=expires_at,
        attempts=0,
        used=False
    )
    
    password_change_repository.create_request(db, new_request)
    
    email_service.send_password_change_otp_email(current_user.email, raw_otp)
    
    return SuccessResponse(success=True, message="Verification code sent to your email.")

def verify_password_change(db: Session, current_user: User, req: VerifyPasswordChangeRequest, request: Request) -> SuccessResponse:
    change_request = password_change_repository.get_active_request_by_user(db, current_user.id)
    
    if not change_request:
        raise HTTPException(status_code=400, detail="No active password change request found")
        
    if change_request.expires_at < datetime.utcnow():
        change_request.used = True
        password_change_repository.update_request(db, change_request)
        raise HTTPException(status_code=400, detail="Verification code expired")
        
    if change_request.attempts >= 5:
        change_request.used = True
        password_change_repository.update_request(db, change_request)
        raise HTTPException(status_code=400, detail="Too many invalid attempts. Request a new code.")
        
    if not verify_otp(req.otp, change_request.otp_hash):
        change_request.attempts += 1
        password_change_repository.update_request(db, change_request)
        raise HTTPException(status_code=400, detail="Invalid verification code")
        
    # Validation passed. Update password.
    current_user.password_hash = change_request.new_password_hash
    current_user.updated_at = datetime.utcnow()
    auth_repository.update_user(db, current_user)
    
    # Invalidate all other active sessions
    # We find all refresh tokens for this user
    all_user_tokens = refresh_token_repository.get_active_refresh_tokens_by_user(db, current_user.id)
    current_cookie_token = request.cookies.get("refresh_token")
    
    # We want to revoke all tokens EXCEPT the one matching the current cookie
    if current_cookie_token:
        # We need to hash it to compare with db tokens
        from app.utils.token import hash_token
        current_hash = hash_token(current_cookie_token)
        for t in all_user_tokens:
            if t.token_hash != current_hash:
                refresh_token_repository.revoke_refresh_token(db, t)
    else:
        # If no cookie (which shouldn't happen for authenticated endpoints usually, 
        # but just in case), revoke them all
        for t in all_user_tokens:
            refresh_token_repository.revoke_refresh_token(db, t)
            
    # Delete the request
    password_change_repository.delete_request(db, change_request)
    
    return SuccessResponse(success=True, message="Password updated successfully.")
