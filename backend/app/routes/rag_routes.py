from fastapi import APIRouter, Depends, BackgroundTasks
from sqlalchemy.orm import Session
from app.database.database import get_db
from app.services.rag_service import RAGService
from app.routes.auth_routes import get_current_user
from app.models.models import User
from pydantic import BaseModel

router = APIRouter(prefix="/api/rag", tags=["rag"])

class SearchRequest(BaseModel):
    query: str

@router.get("/statistics")
def get_rag_statistics(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    service = RAGService(db)
    return service.get_statistics()

@router.post("/reindex")
def reindex_knowledge(background_tasks: BackgroundTasks, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    def process_queue():
        from app.database.database import SessionLocal
        bg_db = SessionLocal()
        try:
            bg_service = RAGService(bg_db)
            bg_service.reindex_jobs()
        finally:
            bg_db.close()
            
    background_tasks.add_task(process_queue)
    return {"message": "Reindexing started in the background"}

@router.post("/search")
def test_rag_search(req: SearchRequest, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    service = RAGService(db)
    return service.search(req.query, current_user.id)
