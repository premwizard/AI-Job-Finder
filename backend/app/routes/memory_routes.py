from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database.database import get_db
from app.memory.memory_service import MemoryService
from app.memory.retrieval_service import MemoryRetrievalService
from app.memory.consolidation_service import ConsolidationService
from app.routes.auth_routes import get_current_user
from app.models.models import User
from pydantic import BaseModel
from typing import List, Optional

router = APIRouter(prefix="/api/memory", tags=["memory"])

class CreateMemoryRequest(BaseModel):
    memory_type: str
    title: Optional[str] = None
    content: str
    importance: Optional[int] = 3
    source: Optional[str] = None
    tags: Optional[str] = None

class SearchMemoryRequest(BaseModel):
    query: str
    limit: Optional[int] = 5

class ConsolidateRequest(BaseModel):
    memory_ids: List[int]

@router.post("")
def create_memory(req: CreateMemoryRequest, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    service = MemoryService(db)
    mem = service.create_memory(
        user_id=current_user.id,
        memory_type=req.memory_type,
        title=req.title,
        content=req.content,
        importance=req.importance,
        source=req.source,
        tags=req.tags
    )
    return {"id": mem.id, "message": "Memory created and embedded."}

@router.get("")
def list_memories(memory_type: Optional[str] = None, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    service = MemoryService(db)
    mems = service.list_memories(current_user.id, memory_type)
    return [{
        "id": m.id,
        "memory_type": m.memory_type,
        "title": m.title,
        "content": m.content,
        "importance_score": m.importance_score,
        "source": m.source,
        "tags": m.tags,
        "created_at": m.created_at
    } for m in mems]

@router.delete("/{id}")
def delete_memory(id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    service = MemoryService(db)
    return service.delete_memory(id, current_user.id)

@router.post("/search")
def search_memories(req: SearchMemoryRequest, current_user: User = Depends(get_current_user)):
    service = MemoryRetrievalService()
    results = service.search_memories(current_user.id, req.query, req.limit)
    return results

@router.post("/consolidate")
def consolidate_memories(req: ConsolidateRequest, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    service = MemoryService(db)
    c_service = ConsolidationService()
    
    # Fetch content
    contents = []
    for mid in req.memory_ids:
        try:
            m = service.get_memory(mid, current_user.id)
            contents.append(m.content)
        except Exception:
            pass
            
    if not contents:
        raise HTTPException(status_code=400, detail="No valid memories to consolidate")
        
    consolidated_content = c_service.consolidate(contents)
    
    # Create new memory
    new_mem = service.create_memory(
        user_id=current_user.id,
        memory_type="semantic",
        title="Consolidated Memory",
        content=consolidated_content,
        importance=4,
        source="system_consolidation"
    )
    
    # Delete old ones
    for mid in req.memory_ids:
        try:
            service.delete_memory(mid, current_user.id)
        except Exception:
            pass
            
    return {"message": "Consolidation complete", "new_memory_id": new_mem.id}
