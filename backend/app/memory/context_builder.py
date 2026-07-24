from app.memory.retrieval_service import MemoryRetrievalService

class MemoryContextBuilder:
    def __init__(self):
        self.retrieval_service = MemoryRetrievalService()

    def build_context(self, user_id: str, query: str, limit: int = 5) -> str:
        """
        Retrieves the top N memories for a user based on the query and 
        compresses them into a dense string to inject into an LLM prompt.
        """
        results = self.retrieval_service.search_memories(user_id, query, limit)
        
        if not results:
            return ""
            
        context_blocks = []
        for res in results:
            content = res.get("content", "")
            meta = res.get("metadata", {})
            mtype = meta.get("memory_type", "memory")
            context_blocks.append(f"[{mtype.upper()}]: {content}")
            
        return "\n".join(context_blocks)
