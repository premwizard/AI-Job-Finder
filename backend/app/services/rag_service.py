import json
from sqlalchemy.orm import Session
from typing import List, Dict, Any
from app.models.models import Job, UserProfile, RAGDocumentMetadata
from app.rag.providers.vector_store import ChromaMultiCollectionStore
from app.rag.retrievers.hybrid_retriever import HybridRetriever
from app.rag.rerankers.semantic_reranker import SemanticReranker
from app.rag.prompts.context_builder import ContextBuilder
from app.rag.intent.intent_detector import IntentDetector

class RAGService:
    def __init__(self, db: Session):
        self.db = db
        self.store = ChromaMultiCollectionStore()
        self.retriever = HybridRetriever(self.store)
        self.reranker = SemanticReranker()
        self.builder = ContextBuilder()
        self.intent_detector = IntentDetector()

    def get_statistics(self) -> Dict[str, Any]:
        collections = ["jobs", "users", "learning", "companies"]
        stats = []
        for c in collections:
            try:
                c_stats = self.store.get_collection_stats(c)
                stats.append(c_stats)
            except Exception:
                stats.append({"name": c, "count": 0})
                
        total_chunks = sum(s["count"] for s in stats)
        
        return {
            "collections": stats,
            "total_chunks": total_chunks,
            "latency_ms": 45, # Mock latency for UI
            "provider": "ChromaDB",
            "storage_gb": 0.12 # Mock storage
        }

    def reindex_jobs(self):
        jobs = self.db.query(Job).filter(Job.ai_processed == True).all()
        docs = []
        metas = []
        ids = []
        
        for job in jobs:
            chunk = f"Job Title: {job.job_title}\nCompany: {job.company_name}\nDescription: {job.description_clean}"
            docs.append(chunk)
            metas.append({"chunk_type": "job_overview", "entity_id": str(job.id)})
            ids.append(f"job_{job.id}_overview")
            
        if docs:
            self.store.add_documents("jobs", docs, metas, ids)

    def search(self, query: str, user_id: str) -> Dict[str, Any]:
        intent = self.intent_detector.detect_intent(query)
        collection = intent if intent in ["jobs", "users", "learning", "companies"] else "jobs"
        
        raw_results = self.retriever.retrieve(collection, query)
        reranked = self.reranker.rerank(raw_results, query)
        context = self.builder.build_context(reranked)
        
        return {
            "query": query,
            "detected_intent": intent,
            "targeted_collection": collection,
            "results_count": len(reranked),
            "top_results": reranked[:3],
            "compressed_context": context
        }
