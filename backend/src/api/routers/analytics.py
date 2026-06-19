from fastapi import APIRouter
from typing import List
from src.schemas.analytics import AnalyticsResponse, WeeklySummaryResponse, WeeklyStat
from src.services.analytics_service import get_current_analytics, get_weekly_summary

router = APIRouter(tags=["Analytics"])

@router.get("/analytics", response_model=AnalyticsResponse)
def get_analytics():
    return get_current_analytics()

@router.get("/weekly-summary", response_model=WeeklySummaryResponse)
def weekly_summary():
    stats = get_weekly_summary()
    return {"stats": stats}
