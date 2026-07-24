import os
from abc import ABC, abstractmethod
from typing import List
import google.generativeai as genai

class EmbeddingProvider(ABC):
    @abstractmethod
    def generate_embedding(self, text: str) -> List[float]:
        pass
        
    @abstractmethod
    def generate_embeddings(self, texts: List[str]) -> List[List[float]]:
        pass


class GeminiEmbeddingProvider(EmbeddingProvider):
    def __init__(self):
        api_key = os.environ.get("GEMINI_API_KEY")
        if not api_key:
            raise ValueError("GEMINI_API_KEY not found in environment variables.")
        genai.configure(api_key=api_key)
        self.model_name = "models/text-embedding-004"

    def generate_embedding(self, text: str) -> List[float]:
        result = genai.embed_content(
            model=self.model_name,
            content=text,
            task_type="retrieval_document"
        )
        return result['embedding']
        
    def generate_embeddings(self, texts: List[str]) -> List[List[float]]:
        # In a real app we might batch this better depending on the provider API limits.
        # GenAI allows sending a list of strings directly:
        result = genai.embed_content(
            model=self.model_name,
            content=texts,
            task_type="retrieval_document"
        )
        return result['embedding']
