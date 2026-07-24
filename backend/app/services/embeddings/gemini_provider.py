import os
from typing import List
import google.generativeai as genai
from app.services.embeddings.base_provider import BaseEmbeddingProvider

class GeminiEmbeddingProvider(BaseEmbeddingProvider):
    def __init__(self, model_name: str = "models/text-embedding-004"):
        self.model_name = model_name
        self.api_key = os.environ.get("GEMINI_API_KEY")
        if self.api_key:
            genai.configure(api_key=self.api_key)

    def embed_text(self, text: str) -> List[float]:
        if not self.api_key:
            # Fallback for local testing without API key
            return [0.0] * 768
            
        try:
            result = genai.embed_content(
                model=self.model_name,
                content=text,
                task_type="retrieval_document"
            )
            return result['embedding']
        except Exception as e:
            print(f"Error generating Gemini embedding: {e}")
            return [0.0] * 768

    def embed_batch(self, texts: List[str]) -> List[List[float]]:
        if not self.api_key:
            return [[0.0] * 768 for _ in texts]
            
        try:
            # Gemini supports batch embeddings by passing a list of strings
            result = genai.embed_content(
                model=self.model_name,
                content=texts,
                task_type="retrieval_document"
            )
            return result['embedding']
        except Exception as e:
            print(f"Error generating Gemini batch embeddings: {e}")
            return [[0.0] * 768 for _ in texts]
