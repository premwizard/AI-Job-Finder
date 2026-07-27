import os
from pydantic_settings import BaseSettings, SettingsConfigDict

class AppSettings(BaseSettings):
    app_name: str = "Crown Atlas API"
    version: str = "1.0.0"
    environment: str = "development"
    secret_key: str = os.environ.get("SECRET_KEY", "your-super-secret-key")
    algorithm: str = "HS256"
    access_token_expire_minutes: int = 10080
    frontend_url: str = os.environ.get("FRONTEND_URL", "http://localhost:3000")
    database_url: str = os.environ.get("DATABASE_URL", "sqlite:///./sql_app.db")

    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

settings = AppSettings()
