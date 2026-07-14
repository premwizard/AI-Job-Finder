from datetime import datetime

from pydantic import BaseModel


class VerificationStatusResponse(BaseModel):
    is_verified: bool


class VerifyEmailRequest(BaseModel):
    token: str


class EmailVerificationTokenCreate(BaseModel):
    user_id: str
    token_hash: str
    expires_at: datetime
