import os
import json
import google.generativeai as genai
from typing import Dict, Any
from app.memory.context_builder import MemoryContextBuilder

class DecisionEngine:
    def __init__(self):
        api_key = os.environ.get("GEMINI_API_KEY")
        if not api_key:
            raise ValueError("GEMINI_API_KEY not found in environment variables.")
        genai.configure(api_key=api_key)
        self.model = genai.GenerativeModel("gemini-1.5-pro")
        self.context_builder = MemoryContextBuilder()

    def make_decision(self, user_id: str, question: str) -> Dict[str, Any]:
        memory_context = self.context_builder.build_context(user_id, question, limit=5)
        
        prompt = f"""
        You are the Cognitive Decision Engine.
        Question: {question}
        
        USER MEMORY CONTEXT:
        {memory_context}
        
        Make a reasoned decision based on the user's memory and the question.
        Return a JSON object exactly matching this schema:
        {{
            "decision": "Your explicit decision/answer",
            "reasoning": "Step-by-step logic explaining the decision",
            "confidence": 0.95,
            "evidence": "Citations from the memory context",
            "alternatives_considered": "What other options were rejected and why"
        }}
        """
        
        try:
            response = self.model.generate_content(prompt)
            text = response.text.strip()
            if text.startswith("```json"): text = text[7:]
            if text.endswith("```"): text = text[:-3]
            return json.loads(text.strip())
        except Exception as e:
            print(f"Decision Error: {e}")
            return {
                "decision": "Unable to compute decision.",
                "reasoning": str(e),
                "confidence": 0.0
            }
