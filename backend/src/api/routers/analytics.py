from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from src.api.deps import get_current_user
from src.database.database import get_db
from src.models import models
from src.schemas import schemas

router = APIRouter(tags=["Analytics"])


@router.get("/analytics", response_model=schemas.AnalyticsResponse)
def get_analytics(
    db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)
):
    analytics = (
        db.query(models.Analytics)
        .filter(models.Analytics.user_id == current_user.id)
        .first()
    )
    if not analytics:
        # Create it if it doesn't exist
        analytics = models.Analytics(user_id=current_user.id)
        db.add(analytics)
        db.commit()
        db.refresh(analytics)
    return analytics
