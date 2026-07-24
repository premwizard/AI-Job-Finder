import numpy as np
import json
from typing import List, Dict, Any
from sqlalchemy.orm import Session
from app.models.models import JobChunkMetadata, UserProfile, Skill
from app.ai.embeddings.providers import GeminiEmbeddingProvider

def cosine_similarity(v1: List[float], v2: List[float]) -> float:
    a = np.array(v1)
    b = np.array(v2)
    norm_a = np.linalg.norm(a)
    norm_b = np.linalg.norm(b)
    if norm_a == 0 or norm_b == 0:
        return 0.0
    return float(np.dot(a, b) / (norm_a * norm_b))

class SemanticMatcher:
    def __init__(self, db: Session):
        self.db = db
        self.provider = GeminiEmbeddingProvider()
        
    def generate_profile_text(self, profile: UserProfile, skills: List[Skill]) -> str:
        """Combine user profile info into a text block for semantic comparison."""
        parts = []
        if profile.current_job_title:
            parts.append(f"Title: {profile.current_job_title}")
        if profile.professional_summary:
            parts.append(f"Summary: {profile.professional_summary}")
        if profile.years_of_experience:
            parts.append(f"Experience: {profile.years_of_experience}")
            
        skill_names = [s.skill_name for s in skills]
        if skill_names:
            parts.append(f"Skills: {', '.join(skill_names)}")
            
        return "\n".join(parts)
        
    def get_semantic_score(self, user_id: str, job_id: int) -> float:
        """
        Calculate semantic match between user profile and job overview.
        Returns a score from 0 to 100.
        """
        profile = self.db.query(UserProfile).filter(UserProfile.user_id == user_id).first()
        skills = self.db.query(Skill).filter(Skill.user_id == user_id).all()
        
        if not profile:
            return 0.0
            
        profile_text = self.generate_profile_text(profile, skills)
        if not profile_text.strip():
            return 0.0
            
        try:
            profile_embedding = self.provider.generate_embedding(profile_text)
        except Exception:
            return 0.0
            
        # Get Job embedding from Chroma?
        # Actually, since we only need to compare, we can query Chroma vector store directly
        from app.ai.embeddings.vector_store import ChromaVectorStore
        store = ChromaVectorStore()
        
        # We query the vector store to see how well the profile embedding matches the chunks of this job
        results = store.search(
            query_embedding=profile_embedding,
            n_results=1,
            where={"job_id": job_id}
        )
        
        if results and results['distances'] and results['distances'][0]:
            # Chroma returns distance. If using cosine space, distance is 1 - cosine_similarity.
            # So similarity = 1 - distance
            distance = results['distances'][0][0]
            similarity = max(0.0, 1.0 - distance)
            return round(similarity * 100, 2)
            
        return 0.0
