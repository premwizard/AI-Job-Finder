from fastapi import HTTPException

class AppException(HTTPException):
    def __init__(self, status_code: int, detail: str, error_code: str = "INTERNAL_ERROR"):
        super().__init__(status_code=status_code, detail=detail)
        self.error_code = error_code

class NotFoundException(AppException):
    def __init__(self, detail: str = "Resource not found"):
        super().__init__(status_code=404, detail=detail, error_code="NOT_FOUND")

class ValidationException(AppException):
    def __init__(self, detail: str = "Validation failed"):
        super().__init__(status_code=422, detail=detail, error_code="VALIDATION_ERROR")

class AuthException(AppException):
    def __init__(self, detail: str = "Authentication failed"):
        super().__init__(status_code=401, detail=detail, error_code="UNAUTHORIZED")
