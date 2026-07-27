from sqlalchemy.orm import Session
from app.modules.auth.interfaces.auth_interfaces import IAuthRepository
from app.models.models import User

class AuthRepository(IAuthRepository):
    def __init__(self, db: Session):
        self.db = db
        
    def get_user_by_email(self, email: str) -> User | None:
        return self.db.query(User).filter(User.email == email).first()
        
    def create_user(self, user_data: dict) -> User:
        user = User(**user_data)
        self.db.add(user)
        self.db.commit()
        self.db.refresh(user)
        return user
