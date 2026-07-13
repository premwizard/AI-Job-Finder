import logging
from fastapi import HTTPException, Request
from sqlalchemy.orm import Session
from datetime import datetime, timedelta

from app.models.models import User, AccountDeletionRequest
from app.schemas.delete_account_schema import (
    DeleteAccountRequestSchema,
    VerifyDeleteOTPSchema,
    ExecuteDeleteSchema,
    SuccessResponse,
)
from app.repositories import delete_account_repository, refresh_token_repository, auth_repository
from app.services import auth_service, email_service
from app.utils.token import hash_otp, verify_otp, hash_token
from app.utils.otp import generate_otp

logger = logging.getLogger(__name__)

OTP_EXPIRY_MINUTES = 10
MAX_OTP_ATTEMPTS = 5


def request_account_deletion(
    db: Session,
    current_user: User,
    req: DeleteAccountRequestSchema,
) -> SuccessResponse:
    """Step 1+2: Validate password, generate OTP, send email."""
    if not auth_service.verify_password(req.current_password, current_user.password_hash):
        raise HTTPException(status_code=400, detail="Incorrect current password")

    # Invalidate any existing active deletion request for this user
    existing = delete_account_repository.get_active_request_by_user(db, current_user.id)
    if existing:
        existing.used = True
        delete_account_repository.update_request(db, existing)

    raw_otp = generate_otp(6)
    otp_hash = hash_otp(raw_otp)
    expires_at = datetime.utcnow() + timedelta(minutes=OTP_EXPIRY_MINUTES)

    new_request = AccountDeletionRequest(
        user_id=current_user.id,
        otp_hash=otp_hash,
        expires_at=expires_at,
        attempts=0,
        otp_verified=False,
        used=False,
    )
    delete_account_repository.create_request(db, new_request)

    email_service.send_account_deletion_otp_email(current_user.email, raw_otp)
    logger.info(f"Account deletion OTP sent for user {current_user.id}")

    return SuccessResponse(success=True, message="Verification code sent to your email.")


def verify_deletion_otp(
    db: Session,
    current_user: User,
    req: VerifyDeleteOTPSchema,
) -> SuccessResponse:
    """Step 3: Validate OTP and mark it as verified (does NOT delete the account yet)."""
    deletion_request = delete_account_repository.get_active_request_by_user(db, current_user.id)

    if not deletion_request:
        raise HTTPException(status_code=400, detail="No active deletion request found. Please start over.")

    if deletion_request.expires_at < datetime.utcnow():
        deletion_request.used = True
        delete_account_repository.update_request(db, deletion_request)
        raise HTTPException(status_code=400, detail="Verification code has expired. Please request a new one.")

    if deletion_request.attempts >= MAX_OTP_ATTEMPTS:
        deletion_request.used = True
        delete_account_repository.update_request(db, deletion_request)
        raise HTTPException(status_code=400, detail="Too many invalid attempts. Please request a new code.")

    if not verify_otp(req.otp, deletion_request.otp_hash):
        deletion_request.attempts += 1
        delete_account_repository.update_request(db, deletion_request)
        remaining = MAX_OTP_ATTEMPTS - deletion_request.attempts
        raise HTTPException(
            status_code=400,
            detail=f"Invalid verification code. {remaining} attempt(s) remaining."
        )

    # Mark OTP as verified — account not deleted yet
    deletion_request.otp_verified = True
    delete_account_repository.update_request(db, deletion_request)
    logger.info(f"Account deletion OTP verified for user {current_user.id}")

    return SuccessResponse(success=True, message="Code verified. Please confirm to delete your account.")


def execute_account_deletion(
    db: Session,
    current_user: User,
    req: ExecuteDeleteSchema,
    request: Request,
) -> SuccessResponse:
    """Step 4+5: Verify 'DELETE' confirmation, then soft-delete the account."""
    if req.confirmation != "DELETE":
        raise HTTPException(status_code=400, detail="Confirmation text must be exactly 'DELETE'.")

    # Ensure OTP was verified in this session
    deletion_request = delete_account_repository.get_active_request_by_user(db, current_user.id)
    if not deletion_request or not deletion_request.otp_verified:
        raise HTTPException(
            status_code=400,
            detail="OTP not verified. Please complete the verification step first."
        )

    if deletion_request.expires_at < datetime.utcnow():
        deletion_request.used = True
        delete_account_repository.update_request(db, deletion_request)
        raise HTTPException(status_code=400, detail="Verification session expired. Please start over.")

    # --- Soft delete the user ---
    current_user.is_deleted = True
    current_user.is_active = False
    current_user.deleted_at = datetime.utcnow()
    auth_repository.update_user(db, current_user)

    # Revoke all refresh tokens (all sessions)
    refresh_token_repository.revoke_all_user_tokens(db, current_user.id)

    # Mark the deletion request as used
    deletion_request.used = True
    delete_account_repository.update_request(db, deletion_request)

    logger.info(f"Account soft-deleted for user {current_user.id} at {current_user.deleted_at}")

    return SuccessResponse(success=True, message="Your account has been permanently deleted.")
