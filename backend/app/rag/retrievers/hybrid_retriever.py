from typing import List, Dict, Any, Optional
from app.rag.providers.vector_store import ChromaMultiCollectionStore

class HybridRetriever:
    def __init__(self, store: ChromaMultiCollectionStore):
        self.store = store

    def retrieve(self, collection_name: str, query: str, filters: Optional[Dict[str, Any]] = None, limit: int = 10) -> List[Dict[str, Any]]:
        # In a true hybrid search, this would combine dense vector search with sparse keyword search (e.g. BM25).
        # Since Chroma natively supports metadata filtering along with vector search, we'll use that as our baseline.
        
        results = self.store.search(
            collection_name=collection_name, 
            query_text=query, 
            n_results=limit, 
            where=filters
        )
        
        # Format the output consistently
        docs = []
        if results and results['documents'] and len(results['documents']) > 0:
            for i, doc in enumerate(results['documents'][0]):
                meta = results['metadatas'][0][i] if results['metadatas'] else {}
                dist = results['distances'][0][i] if results['distances'] else 0.0
                docs.append({
                    "id": results['ids'][0][i],
                    "content": doc,
                    "metadata": meta,
                    "distance": dist
                })
                
        return docs
