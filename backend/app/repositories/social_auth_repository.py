from sqlalchemy.orm import Session
from app.models.models import ConnectedAccount, AuthProvider
from typing import List, Optional

class SocialAuthRepository:
    def create_connected_account(
        self, db: Session, user_id: str, provider: AuthProvider, provider_user_id: str, provider_email: Optional[str] = None
    ) -> ConnectedAccount:
        db_account = ConnectedAccount(
            user_id=user_id,
            provider=provider,
            provider_user_id=provider_user_id,
            provider_email=provider_email
        )
        db.add(db_account)
        db.commit()
        db.refresh(db_account)
        return db_account

    def get_account_by_provider_id(
        self, db: Session, provider: AuthProvider, provider_user_id: str
    ) -> Optional[ConnectedAccount]:
        return db.query(ConnectedAccount).filter(
            ConnectedAccount.provider == provider,
            ConnectedAccount.provider_user_id == provider_user_id
        ).first()

    def get_accounts_by_user(self, db: Session, user_id: str) -> List[ConnectedAccount]:
        return db.query(ConnectedAccount).filter(ConnectedAccount.user_id == user_id).all()

    def delete_connected_account(self, db: Session, user_id: str, provider: AuthProvider) -> bool:
        account = db.query(ConnectedAccount).filter(
            ConnectedAccount.user_id == user_id,
            ConnectedAccount.provider == provider
        ).first()
        if account:
            db.delete(account)
            db.commit()
            return True
        return False
