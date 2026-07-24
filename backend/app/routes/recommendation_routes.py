from fastapi import APIRouter, Depends, BackgroundTasks
from sqlalchemy.orm import Session
from app.database.database import get_db
from app.services.recommendation_service import RecommendationService
from app.routes.auth_routes import get_current_user
from app.models.models import User

router = APIRouter(prefix="/api/recommendations", tags=["recommendations"])

@router.get("/")
def get_recommendations(limit: int = 20, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    service = RecommendationService(db)
    return service.get_recommendations(current_user.id, limit)

@router.post("/refresh")
def refresh_recommendations(background_tasks: BackgroundTasks, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    user_id = current_user.id
    
    def process_queue():
        from app.database.database import SessionLocal
        bg_db = SessionLocal()
        try:
            bg_service = RecommendationService(bg_db)
            bg_service.refresh_recommendations(user_id)
        finally:
            bg_db.close()
            
    background_tasks.add_task(process_queue)
    return {"message": "Recommendation refresh started in the background"}
