import uuid
from datetime import datetime

from sqlalchemy.orm import Session

from app.models.models import RefreshToken
from app.schemas.refresh_token_schema import RefreshTokenCreate


def create_refresh_token(db: Session, token_data: RefreshTokenCreate) -> RefreshToken:
    db_token = RefreshToken(
        id=str(uuid.uuid4()),
        user_id=token_data.user_id,
        token_hash=token_data.token_hash,
        device_name=token_data.device_name,
        ip_address=token_data.ip_address,
        user_agent=token_data.user_agent,
        expires_at=token_data.expires_at,
        created_at=datetime.utcnow(),
    )
    db.add(db_token)
    db.commit()
    db.refresh(db_token)
    return db_token


def get_refresh_token_by_hash(db: Session, token_hash: str) -> RefreshToken | None:
    return db.query(RefreshToken).filter(RefreshToken.token_hash == token_hash).first()


def revoke_refresh_token(db: Session, db_token: RefreshToken):
    db_token.revoked = True
    db_token.last_used_at = datetime.utcnow()
    db.commit()
    db.refresh(db_token)


def delete_refresh_token(db: Session, db_token: RefreshToken):
    db.delete(db_token)
    db.commit()


def get_active_refresh_tokens_by_user(db: Session, user_id: str) -> list[RefreshToken]:
    return (
        db.query(RefreshToken)
        .filter(
            RefreshToken.user_id == user_id,
            RefreshToken.revoked.is_(False),
            RefreshToken.expires_at > datetime.utcnow(),
        )
        .all()
    )


def revoke_all_user_tokens(db: Session, user_id: str):
    db.query(RefreshToken).filter(RefreshToken.user_id == user_id).update(
        {"revoked": True}
    )
    db.commit()
