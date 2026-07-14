from fastapi import APIRouter, Depends

from src.api.deps import get_current_user
from src.models import models
from src.schemas import schemas

router = APIRouter(prefix="/users", tags=["Users"])


@router.get("/me", response_model=schemas.UserResponse)
def read_users_me(current_user: models.User = Depends(get_current_user)):
    return current_user
