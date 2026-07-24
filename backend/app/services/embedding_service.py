import json
from typing import List, Dict, Any, Optional
from sqlalchemy.orm import Session
from app.models.models import ProfileEmbedding
from app.services.embeddings.provider_factory import EmbeddingProviderFactory

class EmbeddingService:
    def __init__(self, db: Session):
        self.db = db
        self.provider = EmbeddingProviderFactory.get_provider()

    def _chunk_text(self, text: str, chunk_size: int = 1000, overlap: int = 100) -> List[str]:
        """
        Intelligently chunk text. 
        For Phase 3, we use a simple character-based sliding window.
        In Phase 4, we may upgrade to token-based or semantic chunking.
        """
        if not text:
            return []
            
        chunks = []
        start = 0
        text_length = len(text)
        
        while start < text_length:
            end = start + chunk_size
            chunk = text[start:end]
            chunks.append(chunk)
            start += (chunk_size - overlap)
            
        return chunks

    def embed_item(
        self, 
        user_id: str, 
        item_type: str, 
        item_id: str, 
        text: str, 
        metadata: Optional[Dict[str, Any]] = None,
        chunk_large_text: bool = False
    ) -> None:
        """
        Generate and store embeddings for a specific profile item.
        If chunk_large_text is True (e.g. for Resume), it splits the text into smaller chunks.
        """
        if not text.strip():
            return

        # 1. Delete existing embeddings for this item
        self.delete_item_embeddings(user_id, item_type, item_id)

        # 2. Chunk text
        if chunk_large_text:
            chunks = self._chunk_text(text)
        else:
            chunks = [text]

        # 3. Get Embeddings
        # We can use embed_batch for efficiency if there are multiple chunks
        vectors = self.provider.embed_batch(chunks)

        # 4. Store in SQLite as JSON arrays
        for i, (chunk, vector) in enumerate(zip(chunks, vectors)):
            record = ProfileEmbedding(
                user_id=user_id,
                item_type=item_type,
                item_id=str(item_id),
                chunk_index=i,
                text_chunk=chunk,
                embedding_vector=json.dumps(vector),
                metadata_json=json.dumps(metadata) if metadata else None
            )
            self.db.add(record)
            
        self.db.commit()

    def delete_item_embeddings(self, user_id: str, item_type: str, item_id: str) -> None:
        """Remove all embedding chunks for a specific item."""
        self.db.query(ProfileEmbedding).filter(
            ProfileEmbedding.user_id == user_id,
            ProfileEmbedding.item_type == item_type,
            ProfileEmbedding.item_id == str(item_id)
        ).delete()
        self.db.commit()
