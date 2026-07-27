import os

class ConfigManager:
    """
    Safely exposes sanitized system metadata and environment variables to the admin panel.
    """
    @staticmethod
    def get_safe_system_config() -> dict:
        """
        Returns environment metadata while explicitly filtering out secrets.
        """
        # Determine environment type
        env = os.environ.get("ENVIRONMENT", "development")
        
        # Build safe config dictionary
        safe_config = {
            "environment": env,
            "version": "1.0.0",
            "redis_enabled": "REDIS_URL" in os.environ,
            "database_dialect": "postgresql" if "postgresql" in os.environ.get("DATABASE_URL", "") else "sqlite",
            "cors_origins": os.environ.get("CORS_ORIGINS", "http://localhost:3000")
        }
        
        return safe_config
