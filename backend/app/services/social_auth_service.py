import requests
from fastapi import HTTPException, status
from app.config import config
from app.models.models import AuthProvider

class SocialAuthService:
    def get_provider_config(self, provider: AuthProvider):
        configs = {
            AuthProvider.google: {
                "client_id": config.GOOGLE_CLIENT_ID,
                "client_secret": config.GOOGLE_CLIENT_SECRET,
                "auth_url": "https://accounts.google.com/o/oauth2/v2/auth",
                "token_url": "https://oauth2.googleapis.com/token",
                "userinfo_url": "https://www.googleapis.com/oauth2/v2/userinfo",
                "scopes": "email profile",
            },
            AuthProvider.github: {
                "client_id": config.GITHUB_CLIENT_ID,
                "client_secret": config.GITHUB_CLIENT_SECRET,
                "auth_url": "https://github.com/login/oauth/authorize",
                "token_url": "https://github.com/login/oauth/access_token",
                "userinfo_url": "https://api.github.com/user",
                "scopes": "read:user user:email",
            },
            AuthProvider.microsoft: {
                "client_id": config.MICROSOFT_CLIENT_ID,
                "client_secret": config.MICROSOFT_CLIENT_SECRET,
                "auth_url": "https://login.microsoftonline.com/common/oauth2/v2.0/authorize",
                "token_url": "https://login.microsoftonline.com/common/oauth2/v2.0/token",
                "userinfo_url": "https://graph.microsoft.com/v1.0/me",
                "scopes": "User.Read",
            },
            AuthProvider.linkedin: {
                "client_id": config.LINKEDIN_CLIENT_ID,
                "client_secret": config.LINKEDIN_CLIENT_SECRET,
                "auth_url": "https://www.linkedin.com/oauth/v2/authorization",
                "token_url": "https://www.linkedin.com/oauth/v2/accessToken",
                "userinfo_url": "https://api.linkedin.com/v2/userinfo",
                "scopes": "openid profile email",
            }
        }
        
        provider_config = configs.get(provider)
        if not provider_config:
            raise HTTPException(status_code=400, detail="Unsupported provider")
            
        if not provider_config["client_id"] or not provider_config["client_secret"]:
            raise HTTPException(status_code=501, detail=f"{provider.value.title()} authentication is not configured.")
            
        return provider_config

    def get_redirect_uri(self, provider: AuthProvider) -> str:
        return f"{config.FRONTEND_URL}/api/auth/{provider.value}/callback"
        
    def get_authorization_url(self, provider: AuthProvider, state: str = "random_state_string") -> str:
        provider_config = self.get_provider_config(provider)
        redirect_uri = self.get_redirect_uri(provider)
        
        params = [
            f"client_id={provider_config['client_id']}",
            f"redirect_uri={redirect_uri}",
            f"response_type=code",
            f"scope={provider_config['scopes']}",
            f"state={state}",
        ]
        
        if provider == AuthProvider.google:
            params.append("access_type=offline")
            params.append("prompt=consent")
            
        return f"{provider_config['auth_url']}?{'&'.join(params)}"

    def exchange_code_for_token(self, provider: AuthProvider, code: str) -> str:
        provider_config = self.get_provider_config(provider)
        redirect_uri = self.get_redirect_uri(provider)
        
        data = {
            "client_id": provider_config["client_id"],
            "client_secret": provider_config["client_secret"],
            "code": code,
            "redirect_uri": redirect_uri,
            "grant_type": "authorization_code"
        }
        
        headers = {"Accept": "application/json"}
        response = requests.post(provider_config["token_url"], data=data, headers=headers)
        
        if response.status_code != 200:
            raise HTTPException(status_code=400, detail=f"Failed to exchange code: {response.text}")
            
        token_data = response.json()
        access_token = token_data.get("access_token")
        if not access_token:
            raise HTTPException(status_code=400, detail="No access token received")
            
        return access_token

    def get_user_info(self, provider: AuthProvider, access_token: str) -> dict:
        provider_config = self.get_provider_config(provider)
        headers = {"Authorization": f"Bearer {access_token}", "Accept": "application/json"}
        
        response = requests.get(provider_config["userinfo_url"], headers=headers)
        
        if response.status_code != 200:
            raise HTTPException(status_code=400, detail=f"Failed to fetch user info: {response.text}")
            
        user_data = response.json()
        
        # Normalize the user info
        normalized_data = {
            "id": "",
            "email": "",
            "first_name": "",
            "last_name": ""
        }
        
        if provider == AuthProvider.google:
            normalized_data["id"] = user_data.get("id")
            normalized_data["email"] = user_data.get("email")
            normalized_data["first_name"] = user_data.get("given_name", "")
            normalized_data["last_name"] = user_data.get("family_name", "")
            
        elif provider == AuthProvider.github:
            normalized_data["id"] = str(user_data.get("id"))
            # GitHub might not return email in main profile if it's private
            email = user_data.get("email")
            if not email:
                # Fetch emails specifically
                emails_response = requests.get("https://api.github.com/user/emails", headers=headers)
                if emails_response.status_code == 200:
                    emails = emails_response.json()
                    primary = next((e for e in emails if e.get("primary")), None)
                    if primary:
                        email = primary.get("email")
            normalized_data["email"] = email
            
            name_parts = (user_data.get("name") or user_data.get("login", "")).split(" ", 1)
            normalized_data["first_name"] = name_parts[0]
            normalized_data["last_name"] = name_parts[1] if len(name_parts) > 1 else ""
            
        elif provider == AuthProvider.microsoft:
            normalized_data["id"] = user_data.get("id")
            normalized_data["email"] = user_data.get("mail") or user_data.get("userPrincipalName")
            normalized_data["first_name"] = user_data.get("givenName", "")
            normalized_data["last_name"] = user_data.get("surname", "")
            
        elif provider == AuthProvider.linkedin:
            normalized_data["id"] = user_data.get("sub")
            normalized_data["email"] = user_data.get("email")
            normalized_data["first_name"] = user_data.get("given_name", "")
            normalized_data["last_name"] = user_data.get("family_name", "")

        if not normalized_data["id"] or not normalized_data["email"]:
            raise HTTPException(status_code=400, detail="Failed to parse required user info from provider")
            
        return normalized_data

social_auth_service = SocialAuthService()
