import json
import os
import google.generativeai as genai
from typing import Dict, List

class MatchExplainer:
    def __init__(self):
        api_key = os.environ.get("GEMINI_API_KEY")
        if not api_key:
            raise ValueError("GEMINI_API_KEY not found in environment variables.")
        genai.configure(api_key=api_key)
        self.model = genai.GenerativeModel("gemini-1.5-pro")

    def generate_explanation(self, job_title: str, overall_score: float, matched_skills: List[str], missing_skills: List[str]) -> Dict[str, str]:
        prompt = f"""
        You are an expert AI Career Coach evaluating a candidate's fit for a "{job_title}" role.
        
        Candidate's Match Score: {overall_score}/100
        Matched Skills: {', '.join(matched_skills) if matched_skills else 'None'}
        Missing Skills: {', '.join(missing_skills) if missing_skills else 'None'}
        
        Provide a concise, human-readable summary of the match in JSON format with exactly two keys:
        "explanation_summary": A brief explanation of why this job matches the candidate (e.g. "✓ Strong experience with X and Y"). Use bullet points.
        "explanation_missing": A brief explanation of missing skills and estimated effort to become an excellent match (e.g. "Missing X. Estimated effort: 2-4 weeks"). Use bullet points.
        
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
                "explanation_summary": parsed.get("explanation_summary", "Strong match based on your core skills."),
                "explanation_missing": parsed.get("explanation_missing", "Consider reviewing the job description for specific requirements.")
            }
        except Exception:
            return {
                "explanation_summary": "✓ Good alignment with your professional background.",
                "explanation_missing": "Review the job description to identify specific missing skills."
            }
