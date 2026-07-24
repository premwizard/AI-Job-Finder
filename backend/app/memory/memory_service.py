from sqlalchemy.orm import Session
from app.models.models import UserMemory
from app.services.rag_service import RAGService
from fastapi import HTTPException
from datetime import datetime

class MemoryService:
    def __init__(self, db: Session):
        self.db = db
        self.rag = RAGService(db)

    def create_memory(self, user_id: str, memory_type: str, content: str, title: str = None, importance: int = 3, source: str = None, tags: str = None):
        mem = UserMemory(
            user_id=user_id,
            memory_type=memory_type,
            title=title,
            content=content,
            importance_score=importance,
            source=source,
            tags=tags
        )
        self.db.add(mem)
        self.db.commit()
        self.db.refresh(mem)
        
        # Also index into Chroma under 'memories' collection
        doc_id = f"mem_{mem.id}"
        self.rag.index_document(
            collection_name="memories",
            document_id=doc_id,
            content=content,
            metadata={
                "memory_type": memory_type,
                "importance": importance,
                "source": source or "unknown",
                "tags": tags or ""
            },
            owner_id=user_id
        )
        return mem

    def list_memories(self, user_id: str, memory_type: str = None):
        q = self.db.query(UserMemory).filter(UserMemory.user_id == user_id)
        if memory_type:
            q = q.filter(UserMemory.memory_type == memory_type)
        return q.order_by(UserMemory.created_at.desc()).all()
        
    def get_memory(self, id: int, user_id: str):
        mem = self.db.query(UserMemory).filter(UserMemory.id == id, UserMemory.user_id == user_id).first()
        if not mem:
            raise HTTPException(status_code=404, detail="Memory not found")
        mem.last_accessed = datetime.utcnow()
        mem.access_count += 1
        self.db.commit()
        return mem

    def delete_memory(self, id: int, user_id: str):
        mem = self.db.query(UserMemory).filter(UserMemory.id == id, UserMemory.user_id == user_id).first()
        if not mem:
            raise HTTPException(status_code=404, detail="Memory not found")
            
        # Optional: could also delete from ChromaDB if the RAGService supports it.
        self.db.delete(mem)
        self.db.commit()
        return {"message": "Memory deleted"}
