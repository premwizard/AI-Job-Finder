from app.rag.providers.vector_store import ChromaMultiCollectionStore
from app.rag.retrievers.hybrid_retriever import HybridRetriever

class MemoryRetrievalService:
    def __init__(self):
        store = ChromaMultiCollectionStore()
        self.retriever = HybridRetriever(store)

    def search_memories(self, user_id: str, query: str, limit: int = 5):
        # We search specifically the "memories" collection
        results = self.retriever.retrieve(
            collection_name="memories",
            query=query,
            k=limit,
            metadata_filter={"owner_id": user_id}
        )
        return results
