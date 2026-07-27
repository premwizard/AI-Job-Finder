from typing import Dict, Any

class FlagService:
    """
    In-memory registry for Feature Flags.
    In a production database, this should sync with a `feature_flags` SQL table or LaunchDarkly.
    """
    _flags: Dict[str, bool] = {
        "beta_ai_copilot": False,
        "new_dashboard_ui": True,
        "mcp_google_drive_sync": False,
        "advanced_analytics": True
    }

    @classmethod
    def get_all_flags(cls) -> Dict[str, bool]:
        return cls._flags

    @classmethod
    def get_flag(cls, flag_name: str, default: bool = False) -> bool:
        return cls._flags.get(flag_name, default)

    @classmethod
    def set_flag(cls, flag_name: str, enabled: bool) -> Dict[str, Any]:
        cls._flags[flag_name] = enabled
        # In a real app, emit an audit log event here
        from app.modules.security.audit.audit_logger import AuditLogger
        AuditLogger.log_event(
            event_type="FEATURE_FLAG_CHANGE",
            user_id="ADMIN",
            action=f"Changed feature flag {flag_name} to {enabled}",
            ip_address="internal"
        )
        return {"flag": flag_name, "enabled": enabled}
