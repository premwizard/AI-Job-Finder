import secrets
import hashlib
from passlib.context import CryptContext

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def generate_secure_token() -> str:
    """Generate a URL-safe secure token."""
    return secrets.token_urlsafe(32)

def hash_token(token: str) -> str:
    """Hash a token using SHA-256 so it can be queried directly in the database."""
    return hashlib.sha256(token.encode("utf-8")).hexdigest()

def hash_otp(otp: str) -> str:
    """Hash an OTP using bcrypt for security against brute-force."""
    return pwd_context.hash(otp)

def verify_otp(plain_otp: str, hashed_otp: str) -> bool:
    """Verify a plain OTP against a bcrypt hashed value."""
    return pwd_context.verify(plain_otp, hashed_otp)
