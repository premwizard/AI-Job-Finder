import json
from sqlalchemy.orm import Session
from app.models.models import ResumeOptimization, Job
from app.resume.optimizer_engine import OptimizerEngine
from app.rag.providers.vector_store import ChromaMultiCollectionStore
from app.rag.retrievers.hybrid_retriever import HybridRetriever
from fastapi import HTTPException

class OptimizationService:
    def __init__(self, db: Session):
        self.db = db
        self.engine = OptimizerEngine()
        
        store = ChromaMultiCollectionStore()
        self.retriever = HybridRetriever(store)

    def optimize_resume(self, user_id: str, job_id: int) -> ResumeOptimization:
        # 1. Fetch Job
        job = self.db.query(Job).filter(Job.id == job_id).first()
        if not job:
            raise HTTPException(status_code=404, detail="Job not found")
            
        # 2. Retrieve Job Context from RAG
        # We query the jobs collection for this specific job's chunks (simulated by querying its title/description)
        job_results = self.retriever.retrieve("jobs", job.title)
        job_context = "\n".join([r.get("content", "") for r in job_results[:3]])
        # Fallback to direct description if RAG misses
        if not job_context.strip():
            job_context = job.description or job.title
            
        # 3. Retrieve User Context from RAG (their resume)
        # We query the users collection
        user_results = self.retriever.retrieve("users", "resume experience skills", metadata_filter={"owner_id": user_id})
        user_context = "\n".join([r.get("content", "") for r in user_results[:5]])
        if not user_context.strip():
            user_context = "User resume not fully indexed yet. Assume basic software engineering skills."

        # 4. Generate Suggestions via LLM
        output = self.engine.generate_suggestions(job_context, user_context)
        
        # 5. Save to DB
        opt = ResumeOptimization(
            user_id=user_id,
            job_id=job_id,
            suggestions_json=json.dumps(output.get("suggestions", [])),
            projected_ats_score=output.get("projected_ats_score", 0),
            projected_match_score=output.get("projected_match_score", 0),
            status="pending"
        )
        self.db.add(opt)
        self.db.commit()
        self.db.refresh(opt)
        
        return opt

    def get_optimizations(self, user_id: str):
        opts = self.db.query(ResumeOptimization).filter(ResumeOptimization.user_id == user_id).order_by(ResumeOptimization.created_at.desc()).all()
        return opts
        
    def apply_optimization(self, id: int, user_id: str):
        opt = self.db.query(ResumeOptimization).filter(ResumeOptimization.id == id, ResumeOptimization.user_id == user_id).first()
        if not opt:
            raise HTTPException(status_code=404, detail="Optimization not found")
            
        opt.status = "applied"
        self.db.commit()
        return {"message": "Optimization applied successfully"}
