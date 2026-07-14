import secrets


def generate_otp(length: int = 6) -> str:
    """Generate a secure numeric OTP of the specified length."""
    # Generate a secure number from 0 to 10^length - 1
    max_val = (10**length) - 1
    otp_val = secrets.randbelow(max_val + 1)
    # Format to ensure it has the requested length, padding with zeros if necessary
    return f"{otp_val:0{length}d}"
