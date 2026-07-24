import os
import google.generativeai as genai
from typing import List

class ConsolidationService:
    def __init__(self):
        api_key = os.environ.get("GEMINI_API_KEY")
        if not api_key:
            raise ValueError("GEMINI_API_KEY not found in environment variables.")
        genai.configure(api_key=api_key)
        self.model = genai.GenerativeModel("gemini-1.5-pro")

    def consolidate(self, memories: List[str]) -> str:
        if len(memories) <= 1:
            return memories[0] if memories else ""
            
        context = "\n---\n".join(memories)
        
        prompt = f"""
        You are the Master Memory Consolidation Engine.
        Below are multiple distinct memory fragments relating to a single user.
        Your task is to merge, compress, and consolidate these fragments into a single, cohesive, highly-dense knowledge snippet without losing any factual information.
        Remove redundancies and conversational filler. Output ONLY the consolidated memory string.
        
        MEMORIES:
        {context}
        """
        
        try:
            response = self.model.generate_content(prompt)
            return response.text.strip()
        except Exception as e:
            print(f"Consolidation Error: {e}")
            return context
