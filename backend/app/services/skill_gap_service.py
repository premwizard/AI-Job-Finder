import json
import os
from pydantic import BaseModel, Field
from typing import List, Dict, Optional
import google.generativeai as genai

GEMINI_API_KEY = os.environ.get("GEMINI_API_KEY")
if GEMINI_API_KEY:
    genai.configure(api_key=GEMINI_API_KEY)

class RoadmapItem(BaseModel):
    skill: str
    priority: str = Field(description="High, Medium, or Low")
    difficulty: str = Field(description="Beginner, Intermediate, Advanced")
    estimated_time: str = Field(description="e.g., '2 weeks', '1 month'")
    career_impact: str = Field(description="Why this matters for the role")

class RadarDataPoint(BaseModel):
    category: str = Field(description="e.g., Programming, Cloud, MLOps, Soft Skills")
    current_level: int = Field(description="0-100 score of current mastery based on resume")
    required_level: int = Field(description="0-100 score of required mastery for target role")

class SkillGapResult(BaseModel):
    gap_percentage: int = Field(description="Overall gap percentage (0 = perfectly matched, 100 = completely unmatched)")
    matching_skills: List[str]
    missing_skills: List[str]
    recommended_skills: List[str]
    learning_roadmap: List[RoadmapItem]
    radar_data: List[RadarDataPoint]

class SkillGapService:
    @staticmethod
    def analyze_skill_gap(resume_text: str, target_role: str, target_industry: str) -> SkillGapResult:
        if not GEMINI_API_KEY:
            return SkillGapService._get_mock_response()

        prompt = f"""
You are an expert AI Career Coach and Tech Recruiter.
Analyze the user's resume against the requirements for a {target_role} in the {target_industry} industry.

Resume Text:
\"\"\"
{resume_text}
\"\"\"

Tasks:
1. Identify Matching Skills (skills in resume that fit the role).
2. Identify Missing Skills (critical skills for {target_role} not found in resume).
3. Identify Recommended Skills (nice-to-have or future-proof skills).
4. Calculate a Gap Percentage (0-100, where 0 is perfect match).
5. Generate a prioritized Learning Roadmap for the missing skills.
6. Generate Radar Chart Data across 5-6 core categories relevant to {target_role} (e.g., Programming, System Design, Data, Cloud). Score current level based on resume evidence, and required level based on industry standards.

Return response matching the JSON schema exactly.
"""
        model = genai.GenerativeModel(
            model_name="gemini-1.5-flash",
            generation_config={"response_mime_type": "application/json"}
        )
        
        try:
            response = model.generate_content(
                prompt,
                generation_config=genai.GenerationConfig(
                    response_mime_type="application/json",
                    response_schema=SkillGapResult
                )
            )
            data = json.loads(response.text)
            return SkillGapResult(**data)
        except Exception as e:
            print(f"Error calling Gemini for Skill Gap Analysis: {e}")
            return SkillGapService._get_mock_response()

    @staticmethod
    def _get_mock_response() -> SkillGapResult:
        return SkillGapResult(
            gap_percentage=45,
            matching_skills=["Python", "SQL", "Git", "REST APIs"],
            missing_skills=["Docker", "Kubernetes", "AWS", "CI/CD"],
            recommended_skills=["Terraform", "GraphQL", "NoSQL"],
            learning_roadmap=[
                RoadmapItem(skill="Docker", priority="High", difficulty="Intermediate", estimated_time="2 weeks", career_impact="Essential for containerized deployments."),
                RoadmapItem(skill="AWS (EC2, S3)", priority="High", difficulty="Advanced", estimated_time="1 month", career_impact="Core cloud provider for modern infrastructure."),
                RoadmapItem(skill="CI/CD Pipelines", priority="Medium", difficulty="Intermediate", estimated_time="3 weeks", career_impact="Enables automated testing and deployment.")
            ],
            radar_data=[
                RadarDataPoint(category="Programming", current_level=80, required_level=85),
                RadarDataPoint(category="Cloud/DevOps", current_level=30, required_level=75),
                RadarDataPoint(category="System Design", current_level=50, required_level=70),
                RadarDataPoint(category="Databases", current_level=75, required_level=80),
                RadarDataPoint(category="Soft Skills", current_level=85, required_level=80)
            ]
        )
