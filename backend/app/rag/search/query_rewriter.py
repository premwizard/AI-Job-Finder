import json
import os
import google.generativeai as genai
from typing import Dict, Any

class QueryRewriter:
    def __init__(self):
        api_key = os.environ.get("GEMINI_API_KEY")
        if not api_key:
            raise ValueError("GEMINI_API_KEY not found in environment variables.")
        genai.configure(api_key=api_key)
        self.model = genai.GenerativeModel("gemini-1.5-pro")

    def rewrite(self, query: str) -> Dict[str, Any]:
        prompt = f"""
        You are a search query optimization engine.
        Analyze the following user query: "{query}"
        
        Expand the query to include synonyms, technology aliases, and relevant industry terminology to improve retrieval recall.
        Extract any implied metadata filters (e.g. remote, seniority, location, salary).
        
        Return ONLY a JSON object with exactly this structure:
        {{
            "original_query": "{query}",
            "expanded_query": "Expanded string containing original words and new synonyms",
            "extracted_filters": {{
                "remote": true/false/null,
                "seniority": "junior/mid/senior/null",
                "keywords": ["list", "of", "important", "keywords"]
            }},
            "target_collections": ["jobs", "users", "learning", "companies"] // Select all that apply
        }}
        """
        
        try:
            response = self.model.generate_content(prompt)
            text = response.text.strip()
            if text.startswith("```json"):
                text = text[7:]
            if text.endswith("```"):
                text = text[:-3]
                
            parsed = json.loads(text.strip())
            return parsed
        except Exception as e:
            print(f"Query Rewriter fallback: {e}")
            return {
                "original_query": query,
                "expanded_query": query,
                "extracted_filters": {},
                "target_collections": ["jobs", "users", "learning", "companies"]
            }
