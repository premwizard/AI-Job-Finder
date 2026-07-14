from datetime import datetime

from sqlalchemy.orm import Session

from app.models.models import AccountDeletionRequest


def create_request(
    db: Session, request: AccountDeletionRequest
) -> AccountDeletionRequest:
    db.add(request)
    db.commit()
    db.refresh(request)
    return request


def get_active_request_by_user(
    db: Session, user_id: str
) -> AccountDeletionRequest | None:
    return (
        db.query(AccountDeletionRequest)
        .filter(
            AccountDeletionRequest.user_id == user_id,
            AccountDeletionRequest.used.is_(False),
            AccountDeletionRequest.expires_at > datetime.utcnow(),
        )
        .first()
    )


def update_request(db: Session, request: AccountDeletionRequest):
    db.commit()
    db.refresh(request)


def delete_request(db: Session, request: AccountDeletionRequest):
    db.delete(request)
    db.commit()
