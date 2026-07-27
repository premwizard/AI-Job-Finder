import logging
import json
from datetime import datetime

logger = logging.getLogger("security_audit")

class AuditEvent:
    LOGIN_SUCCESS = "LOGIN_SUCCESS"
    LOGIN_FAILED = "LOGIN_FAILED"
    PERMISSION_CHANGE = "PERMISSION_CHANGE"
    SECURITY_INCIDENT = "SECURITY_INCIDENT"

class AuditLogger:
    """
    A specialized logger for immutable security audit events.
    In production, this should write to a separate append-only data store or SIEM.
    """
    @staticmethod
    def log_event(event_type: str, user_id: str, action: str, ip_address: str, metadata: dict = None):
        if metadata is None:
            metadata = {}
            
        audit_record = {
            "timestamp": datetime.utcnow().isoformat(),
            "event_type": event_type,
            "user_id": user_id,
            "action": action,
            "ip_address": ip_address,
            "metadata": metadata
        }
        
        # We output this to the structured logs, but it could easily be sent to CloudWatch/DataDog
        logger.info(json.dumps(audit_record))
