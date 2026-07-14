from sqlalchemy.orm import Session

from app.models.models import PasswordChangeRequest


def create_request(
    db: Session, request: PasswordChangeRequest
) -> PasswordChangeRequest:
    db.add(request)
    db.commit()
    db.refresh(request)
    return request


def get_active_request_by_user(db: Session, user_id: str) -> PasswordChangeRequest:
    return (
        db.query(PasswordChangeRequest)
        .filter(
            PasswordChangeRequest.user_id == user_id,
            PasswordChangeRequest.used.is_(False),
        )
        .order_by(PasswordChangeRequest.created_at.desc())
        .first()
    )


def update_request(db: Session, request: PasswordChangeRequest):
    db.add(request)
    db.commit()


def delete_request(db: Session, request: PasswordChangeRequest):
    db.delete(request)
    db.commit()
