from abc import ABC, abstractmethod
from typing import Optional, Any
from app.models.models import User

class IAuthRepository(ABC):
    @abstractmethod
    def get_user_by_email(self, email: str) -> Optional[User]:
        pass
        
    @abstractmethod
    def create_user(self, user_data: dict) -> User:
        pass

class IAuthService(ABC):
    @abstractmethod
    def register(self, register_req: Any) -> Any:
        pass
        
    @abstractmethod
    def login(self, login_req: Any) -> Any:
        pass
