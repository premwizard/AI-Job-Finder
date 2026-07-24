from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database.database import get_db
from app.services.chat_service import ChatService
from app.routes.auth_routes import get_current_user
from app.models.models import User
from pydantic import BaseModel

router = APIRouter(prefix="/api/chat", tags=["chat"])

class ChatRequest(BaseModel):
    message: str

@router.post("")
def send_chat_message(req: ChatRequest, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    service = ChatService(db)
    return service.process_message(current_user.id, req.message)

@router.get("/history")
def get_chat_history(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    service = ChatService(db)
    return service.get_history(current_user.id)

@router.delete("/history")
def clear_chat_history(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    service = ChatService(db)
    return service.clear_history(current_user.id)
