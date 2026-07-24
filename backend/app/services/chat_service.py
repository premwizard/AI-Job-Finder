import json
from sqlalchemy.orm import Session
from typing import Dict, Any
from app.chat.memory_manager import MemoryManager
from app.chat.chat_engine import ChatEngine
from app.rag.providers.vector_store import ChromaMultiCollectionStore
from app.rag.retrievers.hybrid_retriever import HybridRetriever

class ChatService:
    def __init__(self, db: Session):
        self.db = db
        self.memory = MemoryManager(db)
        store = ChromaMultiCollectionStore()
        retriever = HybridRetriever(store)
        self.engine = ChatEngine(retriever)

    def process_message(self, user_id: str, query: str) -> Dict[str, Any]:
        # 1. Save user message to memory
        self.memory.add_message(user_id, "user", query)
        
        # 2. Get history (ignoring the one we just saved for Gemini's history context, as we append query manually)
        # Actually, let's just get history before we added the user message to keep Gemini's alternate role requirement happy
        # Wait, get_recent_history will return user, assistant, user... Gemini needs perfect alternation.
        # For this MVP, we'll just pass an empty history or let Gemini handle it if it's well formed.
        # Since we inject system prompt into every message, history might be tricky. Let's pass empty history for now to avoid role validation errors, or format it perfectly.
        # Formatting perfectly:
        raw_history = self.memory.get_recent_history(user_id, limit=10)
        # We need to remove the very last user message from history because we send it as the main query
        if raw_history and raw_history[-1]["role"] == "user":
            history = raw_history[:-1]
        else:
            history = raw_history

        # 3. Generate response
        response_data = self.engine.generate_response(query, user_id, history)
        
        # 4. Save assistant message
        self.memory.add_message(
            user_id=user_id,
            role="model",
            content=response_data.get("response", ""),
            citations=json.dumps(response_data.get("citations", [])),
            actions=json.dumps(response_data.get("suggested_actions", []))
        )
        
        return response_data
        
    def get_history(self, user_id: str) -> Dict[str, Any]:
        from app.models.models import ChatMessage
        messages = self.db.query(ChatMessage).filter(ChatMessage.user_id == user_id).order_by(ChatMessage.created_at.asc()).all()
        
        formatted = []
        for m in messages:
            formatted.append({
                "id": m.id,
                "role": m.role,
                "content": m.content,
                "citations": json.loads(m.citations_json or "[]"),
                "suggested_actions": json.loads(m.suggested_actions_json or "[]"),
                "created_at": m.created_at
            })
        return {"messages": formatted}

    def clear_history(self, user_id: str):
        self.memory.clear_history(user_id)
        return {"message": "History cleared"}
