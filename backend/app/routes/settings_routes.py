from fastapi import APIRouter, Depends, Request
from sqlalchemy.orm import Session
from app.database.database import get_db
from app.schemas.change_password_schema import ChangePasswordRequest, VerifyPasswordChangeRequest, SuccessResponse
from app.controllers import settings_controller
from app.middleware.auth_middleware import get_current_user
from app.models.models import User

router = APIRouter(prefix="/api/settings", tags=["Settings"])

@router.post("/change-password/request", response_model=SuccessResponse)
def request_password_change(req: ChangePasswordRequest, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    return settings_controller.request_password_change(db, current_user, req)

@router.post("/change-password/verify", response_model=SuccessResponse)
def verify_password_change(req: VerifyPasswordChangeRequest, request: Request, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    return settings_controller.verify_password_change(db, current_user, req, request)
