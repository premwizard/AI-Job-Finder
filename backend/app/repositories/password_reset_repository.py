from typing import List

from sqlalchemy.orm import Session

from app.models.models import PasswordResetToken


def create_reset_token(
    db: Session, reset_token: PasswordResetToken
) -> PasswordResetToken:
    db.add(reset_token)
    db.commit()
    db.refresh(reset_token)
    return reset_token


def get_tokens_by_user(db: Session, user_id: str) -> List[PasswordResetToken]:
    return (
        db.query(PasswordResetToken).filter(PasswordResetToken.user_id == user_id).all()
    )


def get_token_record(db: Session, token_hash: str) -> PasswordResetToken | None:
    return (
        db.query(PasswordResetToken)
        .filter(PasswordResetToken.token_hash == token_hash)
        .first()
    )


def update_token(db: Session, reset_token: PasswordResetToken):
    db.add(reset_token)
    db.commit()
    db.refresh(reset_token)


def delete_token(db: Session, reset_token: PasswordResetToken):
    db.delete(reset_token)
    db.commit()
