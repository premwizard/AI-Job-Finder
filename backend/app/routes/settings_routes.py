from typing import List

from fastapi import APIRouter, Depends, HTTPException, Request
from sqlalchemy.orm import Session

from app.controllers import delete_account_controller, settings_controller
from app.database.database import get_db
from app.middleware.auth_middleware import get_current_user
from app.models.models import AuthProvider, User
from app.repositories.social_auth_repository import SocialAuthRepository
from app.schemas.change_password_schema import (
    ChangePasswordRequest,
    SuccessResponse,
    VerifyPasswordChangeRequest,
)
from app.schemas.delete_account_schema import (
    DeleteAccountRequestSchema,
    ExecuteDeleteSchema,
)
from app.schemas.delete_account_schema import SuccessResponse as DeleteSuccessResponse
from app.schemas.delete_account_schema import VerifyDeleteOTPSchema
from app.schemas.social_auth_schema import ConnectedAccountResponse

router = APIRouter(prefix="/api/settings", tags=["Settings"])


@router.post("/change-password/request", response_model=SuccessResponse)
def request_password_change(
    req: ChangePasswordRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    return settings_controller.request_password_change(db, current_user, req)


@router.post("/change-password/verify", response_model=SuccessResponse)
def verify_password_change(
    req: VerifyPasswordChangeRequest,
    request: Request,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    return settings_controller.verify_password_change(db, current_user, req, request)


# --- Delete Account ---


@router.post("/delete-account/request", response_model=DeleteSuccessResponse)
def request_account_deletion(
    req: DeleteAccountRequestSchema,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    return delete_account_controller.request_account_deletion(db, current_user, req)


@router.post("/delete-account/verify", response_model=DeleteSuccessResponse)
def verify_deletion_otp(
    req: VerifyDeleteOTPSchema,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    return delete_account_controller.verify_deletion_otp(db, current_user, req)


@router.delete("/delete-account", response_model=DeleteSuccessResponse)
def execute_account_deletion(
    req: ExecuteDeleteSchema,
    request: Request,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    return delete_account_controller.execute_account_deletion(
        db, current_user, req, request
    )


# --- Connected Accounts ---
social_auth_repo = SocialAuthRepository()


@router.get("/connected-accounts", response_model=List[ConnectedAccountResponse])
def get_connected_accounts(
    current_user: User = Depends(get_current_user), db: Session = Depends(get_db)
):
    return social_auth_repo.get_accounts_by_user(db, current_user.id)


@router.delete("/connected-accounts/{provider}")
def disconnect_account(
    provider: AuthProvider,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    accounts = social_auth_repo.get_accounts_by_user(db, current_user.id)

    if len(accounts) == 0:
        raise HTTPException(status_code=400, detail="No connected accounts found")

    # Prevent disconnecting the last available login method if they don't have a password
    if (
        current_user.password_hash is None
        and len(accounts) == 1
        and accounts[0].provider == provider
    ):
        raise HTTPException(
            status_code=400,
            detail="Cannot disconnect the only available login method. Please set a password first.",
        )

    success = social_auth_repo.delete_connected_account(db, current_user.id, provider)
    if not success:
        raise HTTPException(status_code=404, detail="Connected account not found")

    return {"message": "Account disconnected successfully"}
