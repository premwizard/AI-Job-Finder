from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database.database import get_db
from app.services.company_service import CompanyService
from pydantic import BaseModel
import json

router = APIRouter(prefix="/api/company", tags=["company"])

class EnrichRequest(BaseModel):
    company_name: str

@router.post("/enrich")
def enrich_company(req: EnrichRequest, db: Session = Depends(get_db)):
    service = CompanyService(db)
    profile = service.enrich_company(req.company_name)
    return {"message": "Company enriched and indexed", "company_id": profile.id}

@router.get("")
def list_companies(db: Session = Depends(get_db)):
    service = CompanyService(db)
    comps = service.list_companies()
    return [{
        "id": c.id,
        "company_name": c.company_name,
        "industry": c.industry,
        "logo_url": c.logo_url
    } for c in comps]

@router.get("/{id}")
def get_company(id: int, db: Session = Depends(get_db)):
    service = CompanyService(db)
    c = service.get_company(id)
    return {
        "id": c.id,
        "company_name": c.company_name,
        "industry": c.industry,
        "logo_url": c.logo_url,
        "ai_summary": c.ai_summary,
        "tech_stack": json.loads(c.tech_stack_json or "[]"),
        "benefits": json.loads(c.benefits_json or "[]"),
        "culture": json.loads(c.culture_json or "{}")
    }
