import json
import os
import google.generativeai as genai
from typing import Dict, Any

class OptimizerEngine:
    def __init__(self):
        api_key = os.environ.get("GEMINI_API_KEY")
        if not api_key:
            raise ValueError("GEMINI_API_KEY not found in environment variables.")
        genai.configure(api_key=api_key)
        self.model = genai.GenerativeModel("gemini-1.5-pro")

    def generate_suggestions(self, job_context: str, resume_context: str) -> Dict[str, Any]:
        prompt = f"""
        You are a highly skilled Resume Optimizer. Your task is to analyze the user's current resume against the requirements of a specific target job, and generate actionable, evidence-based suggestions to improve their ATS and semantic match score.
        
        --- TARGET JOB CONTEXT ---
        {job_context}
        
        --- USER RESUME CONTEXT ---
        {resume_context}
        
        Generate a list of granular improvements. Return ONLY a JSON object with this exact structure:
        {{
            "projected_ats_score": 85,
            "projected_match_score": 90,
            "suggestions": [
                {{
                    "section": "Experience" | "Skills" | "Summary" | "Projects",
                    "suggestion": "The specific instruction on what to change.",
                    "reason": "Why this improves the resume.",
                    "evidence": "Citation from the target job context.",
                    "expected_impact": "e.g., '+5% Match Score'",
                    "diff": {{
                        "removed": "Old text to replace, or null if adding new",
                        "added": "New text to insert"
                    }}
                }}
            ]
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
            print(f"Optimizer Engine Error: {e}")
            return {
                "projected_ats_score": 0,
                "projected_match_score": 0,
                "suggestions": []
            }
