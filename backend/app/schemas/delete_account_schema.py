from pydantic import BaseModel


class DeleteAccountRequestSchema(BaseModel):
    current_password: str


class VerifyDeleteOTPSchema(BaseModel):
    otp: str


class ExecuteDeleteSchema(BaseModel):
    confirmation: str  # Must exactly equal "DELETE"


class SuccessResponse(BaseModel):
    success: bool
    message: str
