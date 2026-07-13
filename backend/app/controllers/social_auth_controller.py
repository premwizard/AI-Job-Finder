from fastapi import APIRouter, Depends, HTTPException, status, Query
from fastapi.responses import RedirectResponse
from sqlalchemy.orm import Session
from app.database.database import get_db
from app.models.models import AuthProvider, User, UserProfile
from app.services.social_auth_service import social_auth_service
from app.repositories.social_auth_repository import SocialAuthRepository
from app.repositories import auth_repository
from app.services.auth_service import create_access_token, create_refresh_token
from app.config import config
from app.middleware.auth_middleware import get_current_user

router = APIRouter()
social_auth_repo = SocialAuthRepository()


@router.get("/auth/{provider}")
def login_via_provider(provider: AuthProvider):
    # Generates URL and redirects user to provider
    auth_url = social_auth_service.get_authorization_url(provider)
    return RedirectResponse(url=auth_url)

@router.get("/auth/{provider}/callback")
def provider_callback(
    provider: AuthProvider, 
    code: str = Query(None), 
    error: str = Query(None),
    db: Session = Depends(get_db)
):
    if error:
        # Redirect to frontend login page with error
        return RedirectResponse(url=f"{config.FRONTEND_URL}/login?error={error}")
        
    if not code:
        return RedirectResponse(url=f"{config.FRONTEND_URL}/login?error=Missing authorization code")

    try:
        # Exchange code for token
        access_token = social_auth_service.exchange_code_for_token(provider, code)
        
        # Get user info
        user_info = social_auth_service.get_user_info(provider, access_token)
        
        provider_id = user_info["id"]
        email = user_info["email"]
        
        # 1. Check if connected account exists
        connected_account = social_auth_repo.get_account_by_provider_id(db, provider, provider_id)
        
        if connected_account:
            user = connected_account.user
        else:
            # 2. If no connected account, check if user with this email exists
            user = auth_repository.get_user_by_email(db, email)
            
            if user:
                # Link account automatically
                social_auth_repo.create_connected_account(db, user.id, provider, provider_id, email)
            else:
                # 3. Create new user
                user = User(
                    email=email,
                    first_name=user_info["first_name"],
                    last_name=user_info["last_name"],
                    password_hash=None,
                    is_verified=True,
                    auth_provider=provider
                )
                db.add(user)
                db.commit()
                db.refresh(user)
                
                # Create user profile
                profile = UserProfile(user_id=user.id)
                db.add(profile)
                
                # Link connected account
                social_auth_repo.create_connected_account(db, user.id, provider, provider_id, email)
                db.commit()

        if user.is_deleted:
            return RedirectResponse(url=f"{config.FRONTEND_URL}/login?error=Account is deleted")

        # Generate tokens
        access_token_jwt = create_access_token(data={"sub": user.email, "id": user.id})
        refresh_token_jwt = create_refresh_token(data={"sub": user.email, "id": user.id})

        # Redirect to frontend with tokens in URL parameters
        # A small script on the frontend dashboard page can capture these, store them, and clear the URL
        redirect_url = f"{config.FRONTEND_URL}/login?access_token={access_token_jwt}&refresh_token={refresh_token_jwt}"
        return RedirectResponse(url=redirect_url)
        
    except Exception as e:
        print(f"Social Auth Error: {e}")
        return RedirectResponse(url=f"{config.FRONTEND_URL}/login?error=Authentication failed")
