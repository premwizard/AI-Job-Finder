from typing import List, Dict, Any

class SemanticReranker:
    def __init__(self):
        pass

    def rerank(self, documents: List[Dict[str, Any]], query: str) -> List[Dict[str, Any]]:
        # For MVP, we will sort based on Chroma's L2 distance (lower is closer/better).
        # We can also add boosting if metadata matches specific keywords.
        
        # Sort primarily by vector distance
        sorted_docs = sorted(documents, key=lambda x: x.get("distance", 999.0))
        
        # Assign a rerank score (mocked as an inverse of distance)
        for i, doc in enumerate(sorted_docs):
            doc["rerank_score"] = 1.0 / (1.0 + doc.get("distance", 1.0))
            
        return sorted_docs
