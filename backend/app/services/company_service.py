import json
from sqlalchemy.orm import Session
from app.models.models import CompanyProfile, Job
from app.company.company_engine import CompanyEngine
from app.services.rag_service import RAGService
from fastapi import HTTPException

class CompanyService:
    def __init__(self, db: Session):
        self.db = db
        self.engine = CompanyEngine()
        self.rag_service = RAGService(db)

    def enrich_company(self, company_name: str) -> CompanyProfile:
        # 1. Fetch all jobs for this company
        jobs = self.db.query(Job).filter(Job.company == company_name).all()
        if not jobs:
            raise HTTPException(status_code=404, detail=f"No jobs found for company: {company_name}")
            
        descriptions = [j.description for j in jobs if j.description]
        industry = jobs[0].industry if jobs[0].industry else "Technology"
        logo_url = jobs[0].logo_url
        
        # 2. Extract Intelligence via Gemini
        intel = self.engine.aggregate_company_intelligence(company_name, descriptions)
        
        # 3. Save to DB
        profile = self.db.query(CompanyProfile).filter(CompanyProfile.company_name == company_name).first()
        if not profile:
            profile = CompanyProfile(company_name=company_name)
            self.db.add(profile)
            
        profile.industry = industry
        profile.logo_url = logo_url
        profile.tech_stack_json = json.dumps(intel.get("tech_stack", []))
        profile.benefits_json = json.dumps(intel.get("benefits", []))
        profile.culture_json = json.dumps(intel.get("culture", {}))
        profile.ai_summary = intel.get("ai_summary", "")
        
        self.db.commit()
        self.db.refresh(profile)
        
        # 4. Push to RAG Collection
        self._index_company_in_rag(profile)
        
        return profile
        
    def _index_company_in_rag(self, profile: CompanyProfile):
        chunks = []
        chunks.append({
            "content": f"Company Overview for {profile.company_name}:\n{profile.ai_summary}",
            "metadata": {"chunk_type": "company_overview", "company_name": profile.company_name}
        })
        
        culture = json.loads(profile.culture_json or "{}")
        if culture.get("mission"):
             chunks.append({
                "content": f"{profile.company_name} Mission & Culture:\n{culture['mission']}\n{culture.get('engineering_culture', '')}",
                "metadata": {"chunk_type": "company_culture", "company_name": profile.company_name}
             })
             
        tech = json.loads(profile.tech_stack_json or "[]")
        if tech:
            chunks.append({
                "content": f"Technology Stack for {profile.company_name}:\n" + ", ".join(tech),
                "metadata": {"chunk_type": "company_tech", "company_name": profile.company_name}
            })
            
        benefits = json.loads(profile.benefits_json or "[]")
        if benefits:
            chunks.append({
                "content": f"Employee Benefits at {profile.company_name}:\n" + ", ".join(benefits),
                "metadata": {"chunk_type": "company_benefits", "company_name": profile.company_name}
            })
            
        for i, chunk in enumerate(chunks):
            doc_id = f"comp_{profile.id}_{i}"
            self.rag_service.index_document(
                collection_name="companies",
                document_id=doc_id,
                content=chunk["content"],
                metadata=chunk["metadata"],
                owner_id="system"
            )

    def get_company(self, id: int) -> CompanyProfile:
        comp = self.db.query(CompanyProfile).filter(CompanyProfile.id == id).first()
        if not comp:
            raise HTTPException(status_code=404, detail="Company not found")
        return comp

    def list_companies(self):
        comps = self.db.query(CompanyProfile).all()
        return comps
