from typing import List, Dict, Any
from app.rag.providers.vector_store import ChromaMultiCollectionStore
from app.rag.retrievers.hybrid_retriever import HybridRetriever

class MultiCollectionRetriever:
    def __init__(self, store: ChromaMultiCollectionStore):
        self.retriever = HybridRetriever(store)

    def retrieve_across_collections(self, query: str, collections: List[str], limit_per_collection: int = 5) -> List[Dict[str, Any]]:
        all_results = []
        for col in collections:
            try:
                # We do a basic hybrid retrieval per collection
                res = self.retriever.retrieve(col, query, limit=limit_per_collection)
                # Inject collection name into metadata for provenance
                for r in res:
                    r["collection_source"] = col
                all_results.extend(res)
            except Exception as e:
                print(f"Error retrieving from collection {col}: {e}")
        
        return all_results
