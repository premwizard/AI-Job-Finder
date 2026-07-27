import os
import hashlib
import hmac

class CryptoUtils:
    """
    Standardized cryptographic utilities.
    """
    @staticmethod
    def generate_secure_hash(data: str, salt: str = None) -> str:
        """
        Generate a secure SHA-256 hash. Used for API Key hashing.
        For passwords, always use bcrypt/argon2 via passlib instead.
        """
        if not salt:
            salt = os.environ.get("SECURITY_SALT", "default_insecure_salt")
        
        return hmac.new(
            salt.encode('utf-8'),
            data.encode('utf-8'),
            hashlib.sha256
        ).hexdigest()

    @staticmethod
    def constant_time_compare(val1: str, val2: str) -> bool:
        """
        Compare strings in constant time to prevent timing attacks.
        """
        return hmac.compare_digest(val1, val2)
