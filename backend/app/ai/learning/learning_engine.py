import json
import os
import google.generativeai as genai
from typing import Dict, Any, List
from app.models.models import Job, JobRecommendation, JobExplanation, JobMatchResult

class LearningEngine:
    def __init__(self):
        api_key = os.environ.get("GEMINI_API_KEY")
        if not api_key:
            raise ValueError("GEMINI_API_KEY not found in environment variables.")
        genai.configure(api_key=api_key)
        self.model = genai.GenerativeModel("gemini-1.5-pro")

    def generate_learning_roadmap(self, job: Job, match: JobMatchResult, rec: JobRecommendation, exp: JobExplanation) -> Dict[str, Any]:
        missing_skills = json.loads(match.missing_skills_json or "[]")
        
        prompt = f"""
        You are an expert AI Career Coach building a Personalized Learning Roadmap.
        
        Job Title: {job.job_title}
        Current Match Score: {rec.recommendation_score}/100
        Missing Skills: {', '.join(missing_skills)}
        
        Please provide a detailed JSON response with exactly the following structure:
        {{
            "roadmap": [
                {{
                    "phase": 1,
                    "skills": [
                        {{
                            "skill_name": "Docker",
                            "difficulty": "Intermediate",
                            "estimated_time": "2 weeks",
                            "category": "DevOps",
                            "importance": "Critical"
                        }}
                    ]
                }}
            ],
            "projected_improvements": [
                {{
                    "milestone": "After Phase 1",
                    "projected_score": 85
                }}
            ],
            "career_growth_insights": {{
                "readiness_level": "Intermediate",
                "summary": "You are 2-3 months of focused learning away from being highly competitive for this role."
            }}
        }}
        
        Rules:
        - Divide the missing skills into 1-3 logical learning phases.
        - The `projected_score` should simulate how learning those skills increases their current match score ({rec.recommendation_score}), up to a max of 95.
        - Use realistic time estimates (e.g. "1 week", "3 days", "2 months").
        - Return ONLY valid JSON.
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
            # Fallback
            return {
                "roadmap": [
                    {
                        "phase": 1,
                        "skills": [
                            {
                                "skill_name": s,
                                "difficulty": "Intermediate",
                                "estimated_time": "2 weeks",
                                "category": "General",
                                "importance": "High"
                            } for s in missing_skills
                        ]
                    }
                ],
                "projected_improvements": [
                    {
                        "milestone": "After Phase 1",
                        "projected_score": min(90, rec.recommendation_score + 10)
                    }
                ],
                "career_growth_insights": {
                    "readiness_level": "Good",
                    "summary": "Learning these skills will greatly improve your chances."
                }
            }
