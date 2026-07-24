import json
import os
from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
import google.generativeai as genai

# Setup Gemini API key
GEMINI_API_KEY = os.environ.get("GEMINI_API_KEY")
if GEMINI_API_KEY:
    genai.configure(api_key=GEMINI_API_KEY)

# Define Pydantic models for structured JSON output from Gemini
class KeywordAnalysis(BaseModel):
    found: List[str] = Field(description="Keywords found in the resume")
    missing: List[str] = Field(description="Important keywords missing for standard technical/professional roles")
    suggested: List[str] = Field(description="Suggested keywords to add to improve ATS match rate")

class CategoryScore(BaseModel):
    score: int = Field(description="Score from 0 to 100")
    feedback: str = Field(description="Specific feedback on this category")

class ATSAnalysisResult(BaseModel):
    overall_score: int = Field(description="Overall ATS compatibility score from 0 to 100")
    category_scores: Dict[str, CategoryScore] = Field(description="Scores for Structure, Keywords, Skills, Experience, Education, Projects, Formatting, Contact, Grammar")
    keyword_analysis: KeywordAnalysis
    strengths: List[str] = Field(description="3-5 key strengths of this resume for ATS systems")
    weaknesses: List[str] = Field(description="3-5 key weaknesses or ATS parsing risks")
    recommendations: List[str] = Field(description="General recommendations for improvement")
    priority_improvements: List[str] = Field(description="Top 3 priority actions to take immediately")

class ATSAnalysisService:
    @staticmethod
    def analyze_resume(resume_text: str) -> ATSAnalysisResult:
        """
        Calls Gemini to perform a deep ATS analysis of the resume.
        Returns a structured ATSAnalysisResult.
        """
        if not GEMINI_API_KEY:
            # Fallback mock response for testing if no API key is set
            return ATSAnalysisService._get_mock_response()

        prompt = f"""
You are an expert ATS (Applicant Tracking System) Analyzer. Analyze the following resume text and provide a detailed ATS compatibility report.
Do not simply count keywords. Evaluate the structure, readability, formatting, impact statements, action verbs, and grammar.

Resume Text:
\"\"\"
{resume_text}
\"\"\"

Analyze the following categories and provide a score (0-100) and feedback for each:
1. Structure: Section order, clear headings, readability, length.
2. Keywords: Presence of hard skills, soft skills, industry terms.
3. Skills: Hard vs soft skills, missing or outdated skills.
4. Experience: Use of action verbs, quantified achievements, impact statements, career progression.
5. Education: Completeness.
6. Projects: Description quality, tech stack, business impact.
7. Formatting: Bullet consistency, ATS-safe layout (avoiding tables/columns/graphics).
8. Contact: Presence of Email, Phone, LinkedIn/GitHub links.
9. Grammar: Typos, repeated words, passive voice.

Calculate an overall score (0-100) based on these categories.
Identify found, missing, and suggested keywords.
List strengths, weaknesses, recommendations, and priority improvements.

Return the response strictly matching the provided JSON schema.
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
                    response_schema=ATSAnalysisResult
                )
            )
            data = json.loads(response.text)
            return ATSAnalysisResult(**data)
        except Exception as e:
            print(f"Error calling Gemini for ATS Analysis: {e}")
            return ATSAnalysisService._get_mock_response()

    @staticmethod
    def _get_mock_response() -> ATSAnalysisResult:
        return ATSAnalysisResult(
            overall_score=65,
            category_scores={
                "Structure": CategoryScore(score=70, feedback="Good structure, but headings could be clearer."),
                "Keywords": CategoryScore(score=60, feedback="Missing some industry-standard keywords."),
                "Skills": CategoryScore(score=75, feedback="Good mix of hard skills, add more soft skills."),
                "Experience": CategoryScore(score=55, feedback="Lacks quantified achievements and strong action verbs."),
                "Education": CategoryScore(score=90, feedback="Education is clearly listed."),
                "Projects": CategoryScore(score=65, feedback="Project impacts are vague."),
                "Formatting": CategoryScore(score=80, feedback="Generally ATS safe, avoid complex columns."),
                "Contact": CategoryScore(score=100, feedback="All contact information is present."),
                "Grammar": CategoryScore(score=85, feedback="No major grammar issues detected.")
            },
            keyword_analysis=KeywordAnalysis(
                found=["Python", "React", "SQL"],
                missing=["Docker", "AWS", "Agile"],
                suggested=["CI/CD", "Microservices"]
            ),
            strengths=["Clear education section", "Contact info is complete", "Good basic formatting"],
            weaknesses=["Weak action verbs in experience", "Missing key cloud technologies", "No quantifiable metrics"],
            recommendations=["Add numbers to your experience bullets", "Include more relevant technical skills"],
            priority_improvements=["Rewrite experience bullets using XYZ format", "Add missing keywords"]
        )
