from typing import List, Dict, Any

class ContextBuilder:
    def __init__(self, max_tokens: int = 4000):
        self.max_tokens = max_tokens

    def build_context(self, documents: List[Dict[str, Any]]) -> str:
        # Simplistic token estimation: ~4 chars per token
        current_tokens = 0
        context_parts = []
        
        for doc in documents:
            content = doc.get("content", "")
            tokens = len(content) // 4
            
            if current_tokens + tokens > self.max_tokens:
                break
                
            source_meta = doc.get("metadata", {}).get("chunk_type", "Document")
            context_parts.append(f"--- {source_meta} ---\n{content}\n")
            current_tokens += tokens
            
        return "\n".join(context_parts)
