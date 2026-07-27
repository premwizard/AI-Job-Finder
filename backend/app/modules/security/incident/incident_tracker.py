from app.modules.security.audit.audit_logger import AuditLogger, AuditEvent

class IncidentTracker:
    """
    Tracks and escalates suspicious security activity.
    """
    @staticmethod
    def record_failed_login(username: str, ip_address: str):
        """
        Logs a failed login. A Redis counter could be added here to trigger account lockouts.
        """
        AuditLogger.log_event(
            event_type=AuditEvent.LOGIN_FAILED,
            user_id=username,
            action="Failed login attempt",
            ip_address=ip_address
        )
        
    @staticmethod
    def escalate_incident(severity: str, description: str, ip_address: str):
        """
        Records a major security incident.
        """
        AuditLogger.log_event(
            event_type=AuditEvent.SECURITY_INCIDENT,
            user_id="SYSTEM",
            action=description,
            ip_address=ip_address,
            metadata={"severity": severity}
        )
