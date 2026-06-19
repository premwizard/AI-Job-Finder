from pydantic import BaseModel
from typing import Dict, List, Any

class SourceHealth(BaseModel):
    fetched: int
    status: str

class AnalyticsResponse(BaseModel):
    raw_jobs: int
    duplicates: int
    new_jobs: int
    rejection_reasons: Dict[str, int]
    source_health: Dict[str, SourceHealth]

class WeeklyStat(BaseModel):
    date: str
    raw_jobs: int
    new_jobs: int
    source_health: Dict[str, SourceHealth]

class WeeklySummaryResponse(BaseModel):
    stats: List[WeeklyStat]
