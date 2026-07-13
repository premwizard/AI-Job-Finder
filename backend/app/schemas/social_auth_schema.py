from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime
from app.models.models import AuthProvider

class OAuthCallbackRequest(BaseModel):
    code: str
    state: Optional[str] = None

class ConnectedAccountResponse(BaseModel):
    id: str
    provider: AuthProvider
    provider_user_id: str
    provider_email: Optional[str] = None
    connected_at: datetime
    
    class Config:
        orm_mode = True
        from_attributes = True

class ConnectProviderRequest(BaseModel):
    provider: AuthProvider
    code: str
