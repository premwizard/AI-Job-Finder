from typing import Dict, Any

class IntentDetector:
    def __init__(self):
        pass

    def detect_intent(self, query: str) -> str:
        # A lightweight keyword-based intent detection for the RAG router
        q_lower = query.lower()
        
        if any(word in q_lower for word in ["job", "role", "position", "hire", "salary"]):
            return "jobs"
        elif any(word in q_lower for word in ["profile", "resume", "experience", "skill"]):
            return "users"
        elif any(word in q_lower for word in ["learn", "course", "roadmap", "improve"]):
            return "learning"
        elif any(word in q_lower for word in ["company", "culture", "benefits"]):
            return "companies"
            
        return "general"
