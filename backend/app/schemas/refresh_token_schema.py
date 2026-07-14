from datetime import datetime
from typing import Optional

from pydantic import BaseModel


class RefreshTokenCreate(BaseModel):
    user_id: str
    token_hash: str
    device_name: Optional[str] = None
    ip_address: Optional[str] = None
    user_agent: Optional[str] = None
    expires_at: datetime


class RefreshTokenResponse(BaseModel):
    id: str
    user_id: str
    device_name: Optional[str] = None
    expires_at: datetime
    created_at: datetime
    last_used_at: Optional[datetime] = None


class RefreshRequest(BaseModel):
    pass
