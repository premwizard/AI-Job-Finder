from fastapi import APIRouter, Depends, Request, Response
from sqlalchemy.orm import Session

from app.controllers import auth_controller
from app.database.database import get_db
from app.middleware.auth_middleware import get_current_user
from app.models.models import User
from app.schemas.auth_schema import (LoginRequest, RegisterRequest,
                                     RegisterResponse, TokenResponse,
                                     UserResponse)
from app.schemas.email_verification_schema import VerificationStatusResponse
from app.schemas.password_reset_schema import (ForgotPasswordRequest,
                                               ResetPasswordRequest,
                                               SuccessResponse, VerifyResponse)

router = APIRouter(prefix="/api/auth", tags=["Auth"])


@router.post("/register", response_model=RegisterResponse)
def register(req: RegisterRequest, db: Session = Depends(get_db)):
    return auth_controller.register_user(db, req)


@router.post("/login", response_model=TokenResponse)
def login(
    req: LoginRequest,
    request: Request,
    response: Response,
    db: Session = Depends(get_db),
):
    return auth_controller.login_user(db, req, request, response)


@router.get("/me", response_model=UserResponse)
def get_me(current_user: User = Depends(get_current_user)):
    return current_user


@router.post("/refresh", response_model=TokenResponse)
def refresh_token(request: Request, response: Response, db: Session = Depends(get_db)):
    return auth_controller.refresh_access_token(db, request, response)


@router.post("/logout")
def logout(request: Request, response: Response, db: Session = Depends(get_db)):
    return auth_controller.logout_user(db, request, response)


@router.post("/forgot-password", response_model=SuccessResponse)
def forgot_password(req: ForgotPasswordRequest, db: Session = Depends(get_db)):
    return auth_controller.forgot_password(db, req)


@router.get("/reset-password/verify", response_model=VerifyResponse)
def verify_reset_token(token: str, db: Session = Depends(get_db)):
    return auth_controller.verify_reset_token(db, token)


@router.post("/reset-password", response_model=SuccessResponse)
def reset_password(req: ResetPasswordRequest, db: Session = Depends(get_db)):
    return auth_controller.reset_password(db, req)


@router.post("/send-verification-email", response_model=SuccessResponse)
def send_verification_email(
    current_user: User = Depends(get_current_user), db: Session = Depends(get_db)
):
    return auth_controller.send_verification_email(db, current_user)


@router.get("/verify-email", response_model=SuccessResponse)
def verify_email(token: str, db: Session = Depends(get_db)):
    return auth_controller.verify_email(db, token)


@router.get("/verification-status", response_model=VerificationStatusResponse)
def get_verification_status(current_user: User = Depends(get_current_user)):
    return auth_controller.get_verification_status(current_user)
