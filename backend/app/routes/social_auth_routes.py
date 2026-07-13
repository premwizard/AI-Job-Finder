from fastapi import APIRouter
from app.controllers import social_auth_controller

router = APIRouter(prefix="/api", tags=["Social Authentication"])

router.include_router(social_auth_controller.router)
