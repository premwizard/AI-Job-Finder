import json
import os
import google.generativeai as genai
from typing import Dict, Any
from app.models.models import Job, UserProfile, JobRecommendation, JobMatchResult

class ExplanationEngine:
    def __init__(self):
        api_key = os.environ.get("GEMINI_API_KEY")
        if not api_key:
            raise ValueError("GEMINI_API_KEY not found in environment variables.")
        genai.configure(api_key=api_key)
        self.model = genai.GenerativeModel("gemini-1.5-pro")

    def generate_xai_insights(self, job: Job, match: JobMatchResult, recommendation: JobRecommendation, profile: UserProfile) -> Dict[str, Any]:
        matched_skills = json.loads(match.matched_skills_json or "[]")
        missing_skills = json.loads(match.missing_skills_json or "[]")
        
        prompt = f"""
        You are an expert Explainable AI (XAI) Career Agent.
        Your task is to provide deep, transparent insights into why a job was recommended to a candidate.
        
        Job Title: {job.job_title}
        Company: {job.company_name}
        Recommendation Score: {recommendation.recommendation_score}/100
        Semantic Match Score: {match.semantic_score}/100
        Confidence: {recommendation.confidence_score}%
        Career Growth Potential: {recommendation.career_growth_score}/100
        
        Matched Skills: {', '.join(matched_skills)}
        Missing Skills: {', '.join(missing_skills)}
        
        Please provide a detailed JSON response with exactly the following keys:
        "overall_summary": A concise paragraph summarizing the recommendation.
        "strengths": Array of strings detailing exact matching strengths (skills, semantic match, experience).
        "missing_skills_analysis": Array of objects {{"skill": "string", "importance": "High/Medium/Low", "impact": "string"}}
        "risk_factors": Array of strings explaining potential concerns or mismatches.
        "improvement_suggestions": Array of strings providing actionable advice (e.g. "Learn X", "Gain experience in Y").
        "career_growth_analysis": A short paragraph explaining what the user will learn and future opportunities.
        "confidence_explanation": A short sentence explaining the {recommendation.confidence_score}% confidence score.
        
        Return ONLY valid JSON. No markdown blocks.
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
        except Exception:
            # Fallback
            return {
                "overall_summary": "A good opportunity based on your profile.",
                "strengths": ["Matched core skills."],
                "missing_skills_analysis": [{"skill": s, "importance": "Medium", "impact": "Needed for role"} for s in missing_skills],
                "risk_factors": ["Review job description for details."],
                "improvement_suggestions": ["Review missing skills."],
                "career_growth_analysis": "Offers standard career growth.",
                "confidence_explanation": "Based on standard matching algorithms."
            }
