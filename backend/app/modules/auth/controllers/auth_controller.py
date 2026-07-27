from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.shared.database.session import get_db
from app.modules.auth.services.auth_service import AuthService
from app.modules.auth.repositories.auth_repository import AuthRepository

router = APIRouter(prefix="/api/v2/auth", tags=["Auth V2"])

def get_auth_service(db: Session = Depends(get_db)) -> AuthService:
    repo = AuthRepository(db)
    return AuthService(repo)

@router.get("/health")
def auth_health():
    return {"status": "Auth module is running on V2 Architecture"}
