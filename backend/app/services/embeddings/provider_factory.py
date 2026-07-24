import os
from app.services.embeddings.base_provider import BaseEmbeddingProvider
from app.services.embeddings.gemini_provider import GeminiEmbeddingProvider

class EmbeddingProviderFactory:
    @staticmethod
    def get_provider() -> BaseEmbeddingProvider:
        """
        Returns the configured embedding provider.
        Currently defaults to Gemini, but can be expanded based on env vars.
        """
        provider = os.environ.get("EMBEDDING_PROVIDER", "gemini").lower()
        
        if provider == "gemini":
            return GeminiEmbeddingProvider()
        else:
            # Fallback to Gemini
            return GeminiEmbeddingProvider()
