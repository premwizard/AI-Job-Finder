from sqlalchemy.orm import Session
from app.models.models import ChatMessage
from typing import List, Dict

class MemoryManager:
    def __init__(self, db: Session):
        self.db = db

    def get_recent_history(self, user_id: str, limit: int = 10) -> List[Dict[str, str]]:
        messages = self.db.query(ChatMessage).filter(ChatMessage.user_id == user_id).order_by(ChatMessage.created_at.desc()).limit(limit).all()
        history = []
        # Return in chronological order
        for msg in reversed(messages):
            history.append({
                "role": msg.role,
                "parts": [msg.content]
            })
        return history

    def add_message(self, user_id: str, role: str, content: str, citations: str = "[]", actions: str = "[]"):
        msg = ChatMessage(
            user_id=user_id,
            role=role,
            content=content,
            citations_json=citations,
            suggested_actions_json=actions
        )
        self.db.add(msg)
        self.db.commit()

    def clear_history(self, user_id: str):
        self.db.query(ChatMessage).filter(ChatMessage.user_id == user_id).delete()
        self.db.commit()
