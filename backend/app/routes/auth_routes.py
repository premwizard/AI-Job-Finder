from fastapi import APIRouter, Depends, Response
from sqlalchemy.orm import Session
from app.database.database import get_db
from app.schemas.auth_schema import RegisterRequest, LoginRequest, RegisterResponse, TokenResponse, UserResponse
from app.controllers import auth_controller
from app.middleware.auth_middleware import get_current_user
from app.models.models import User

router = APIRouter(prefix="/api/auth", tags=["Auth"])

@router.post("/register", response_model=RegisterResponse)
def register(req: RegisterRequest, db: Session = Depends(get_db)):
    return auth_controller.register_user(db, req)

@router.post("/login", response_model=TokenResponse)
def login(req: LoginRequest, db: Session = Depends(get_db)):
    return auth_controller.login_user(db, req)

@router.get("/me", response_model=UserResponse)
def get_me(current_user: User = Depends(get_current_user)):
    return auth_controller.get_current_user_profile(current_user)

@router.post("/logout")
def logout():
    # Since we are using stateless JWT, logout is mostly handled on the client side 
    # by deleting the token. We can just return success here.
    return {"success": True, "message": "Logged out successfully"}
