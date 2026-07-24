from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database.database import get_db
from app.routes.auth_routes import get_current_user
from app.models.models import User
from pydantic import BaseModel
from typing import Optional, List
from app.rag.search.query_rewriter import QueryRewriter
from app.rag.search.multi_retriever import MultiCollectionRetriever
from app.rag.providers.vector_store import ChromaMultiCollectionStore
from app.rag.rerankers.semantic_reranker import SemanticReranker

router = APIRouter(prefix="/api/search", tags=["search"])

class AdvancedSearchRequest(BaseModel):
    query: str
    mode: str = "hybrid" # "hybrid", "vector", "keyword"
    collections: Optional[List[str]] = None

@router.post("")
def perform_advanced_search(req: AdvancedSearchRequest, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    rewriter = QueryRewriter()
    store = ChromaMultiCollectionStore()
    retriever = MultiCollectionRetriever(store)
    reranker = SemanticReranker()
    
    # 1. Query Rewriting
    rewritten = rewriter.rewrite(req.query)
    expanded_query = rewritten.get("expanded_query", req.query)
    target_collections = req.collections if req.collections else rewritten.get("target_collections", ["jobs"])
    
    # We ensure we only query valid collections
    valid_collections = [c for c in target_collections if c in ["jobs", "users", "learning", "companies"]]
    if not valid_collections:
        valid_collections = ["jobs"]
        
    # 2. Multi-Collection Retrieval
    raw_results = retriever.retrieve_across_collections(expanded_query, valid_collections, limit_per_collection=5)
    
    # 3. Rerank
    reranked = reranker.rerank(raw_results, expanded_query)
    
    # Format for UI
    grouped_results = {}
    for r in reranked:
        col = r.get("collection_source", "unknown")
        if col not in grouped_results:
            grouped_results[col] = []
        grouped_results[col].append(r)
        
    return {
        "original_query": req.query,
        "expanded_query": expanded_query,
        "extracted_filters": rewritten.get("extracted_filters", {}),
        "target_collections": valid_collections,
        "results": grouped_results,
        "total_hits": len(reranked)
    }
