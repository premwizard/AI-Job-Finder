import json
import os
import google.generativeai as genai
from typing import Dict, Any, List

class RecommendationExplainer:
    def __init__(self):
        api_key = os.environ.get("GEMINI_API_KEY")
        if not api_key:
            raise ValueError("GEMINI_API_KEY not found in environment variables.")
        genai.configure(api_key=api_key)
        self.model = genai.GenerativeModel("gemini-1.5-pro")

    def generate_explanation(self, job_title: str, recommendation_score: float, matched_skills: List[str], missing_skills: List[str], growth_score: float) -> Dict[str, Any]:
        prompt = f"""
        You are an expert AI Career Agent. You are recommending a "{job_title}" role to a candidate.
        
        Recommendation Score: {recommendation_score}/100
        Matched Skills: {', '.join(matched_skills) if matched_skills else 'None'}
        Missing Skills: {', '.join(missing_skills) if missing_skills else 'None'}
        Career Growth Potential Score: {growth_score}/100
        
        Provide a concise, human-readable summary of this recommendation in JSON format with exactly three keys:
        "strengths": A short array of bullet points (strings) explaining why this job is recommended (e.g. "Excellent semantic match", "Matches remote preference").
        "weaknesses": A short array of bullet points (strings) explaining potential drawbacks or missing skills.
        "summary": A 1-2 sentence overarching summary.
        
        Keep it professional, encouraging, and structured. Return ONLY valid JSON, no markdown blocks.
        """
        
        try:
            response = self.model.generate_content(prompt)
            text = response.text.strip()
            if text.startswith("```json"):
                text = text[7:]
            if text.endswith("```"):
                text = text[:-3]
                
            parsed = json.loads(text.strip())
            return {
                "strengths": parsed.get("strengths", ["Strong semantic match"]),
                "weaknesses": parsed.get("weaknesses", ["Review specific job requirements"]),
                "summary": parsed.get("summary", "This job is highly recommended based on your profile.")
            }
        except Exception:
            return {
                "strengths": ["✓ Good alignment with your professional background."],
                "weaknesses": ["Review the job description to identify specific missing skills."],
                "summary": "We recommend exploring this opportunity."
            }
