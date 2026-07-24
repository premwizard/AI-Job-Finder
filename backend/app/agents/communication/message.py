from typing import Dict, Any, Optional
from datetime import datetime

class Message:
    def __init__(self, sender: str, receiver: str, task_id: int, goal_id: int, payload: Dict[str, Any], priority: int = 1):
        self.sender = sender
        self.receiver = receiver
        self.task_id = task_id
        self.goal_id = goal_id
        self.payload = payload
        self.priority = priority
        self.timestamp = datetime.utcnow()
        self.status = "sent" # sent, delivered, processed, failed
        self.metadata: Dict[str, Any] = {}

    def mark_processed(self, result: Dict[str, Any] = None):
        self.status = "processed"
        if result:
            self.metadata["result"] = result

    def mark_failed(self, error: str):
        self.status = "failed"
        self.metadata["error"] = error
