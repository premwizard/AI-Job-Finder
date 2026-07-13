from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class VerificationStatusResponse(BaseModel):
    is_verified: bool

class VerifyEmailRequest(BaseModel):
    token: str

class EmailVerificationTokenCreate(BaseModel):
    user_id: str
    token_hash: str
    expires_at: datetime
