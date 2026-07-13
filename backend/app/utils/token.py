import secrets
import hashlib
import bcrypt

def generate_secure_token() -> str:
    """Generate a URL-safe secure token."""
    return secrets.token_urlsafe(32)

def hash_token(token: str) -> str:
    """Hash a token using SHA-256 so it can be queried directly in the database."""
    return hashlib.sha256(token.encode("utf-8")).hexdigest()

def hash_otp(otp: str) -> str:
    """Hash an OTP using bcrypt for security against brute-force."""
    salt = bcrypt.gensalt()
    return bcrypt.hashpw(otp.encode('utf-8'), salt).decode('utf-8')

def verify_otp(plain_otp: str, hashed_otp: str) -> bool:
    """Verify a plain OTP against a bcrypt hashed value."""
    try:
        return bcrypt.checkpw(plain_otp.encode('utf-8'), hashed_otp.encode('utf-8'))
    except Exception:
        return False
