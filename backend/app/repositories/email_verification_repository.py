from sqlalchemy.orm import Session
from app.models.models import EmailVerificationToken, User
from datetime import datetime

def create_verification_token(db: Session, user_id: str, token_hash: str, expires_at: datetime) -> EmailVerificationToken:
    # Invalidate existing unused tokens for this user
    db.query(EmailVerificationToken).filter(
        EmailVerificationToken.user_id == user_id,
        EmailVerificationToken.used == False
    ).update({"used": True})
    
    # Create new token
    db_token = EmailVerificationToken(
        user_id=user_id,
        token_hash=token_hash,
        expires_at=expires_at,
        used=False
    )
    db.add(db_token)
    db.commit()
    db.refresh(db_token)
    return db_token

def get_token_by_hash(db: Session, token_hash: str) -> EmailVerificationToken:
    return db.query(EmailVerificationToken).filter(EmailVerificationToken.token_hash == token_hash).first()

def mark_token_used(db: Session, token_id: str):
    db.query(EmailVerificationToken).filter(EmailVerificationToken.id == token_id).update({"used": True})
    db.commit()

def verify_user_email(db: Session, user_id: str):
    db.query(User).filter(User.id == user_id).update({
        "is_verified": True,
        "verified_at": datetime.utcnow()
    })
    db.commit()
