import json
import os
from pydantic import BaseModel, Field
from typing import List, Dict
import google.generativeai as genai

# Setup Gemini API key
GEMINI_API_KEY = os.environ.get("GEMINI_API_KEY")
if GEMINI_API_KEY:
    genai.configure(api_key=GEMINI_API_KEY)

class CategoryScore(BaseModel):
    score: int = Field(description="Score from 0 to 100")
    feedback: str = Field(description="Specific, constructive feedback on this category")

class QualityAnalysisResult(BaseModel):
    overall_score: int = Field(description="Overall resume quality score from 0 to 100")
    category_scores: Dict[str, CategoryScore] = Field(description="Scores for Professionalism, Readability, Grammar, Formatting, Achievements, Projects, Skills, Experience, Education")
    strengths: List[str] = Field(description="3-5 key strengths of this resume")
    weaknesses: List[str] = Field(description="3-5 key weaknesses")
    critical_issues: List[str] = Field(description="Major issues that significantly hurt the resume's quality")
    minor_issues: List[str] = Field(description="Minor issues or nitpicks")
    excellent_sections: List[str] = Field(description="Sections that are exceptionally well-written")
    general_feedback: str = Field(description="A constructive summary paragraph")

class QualityAnalysisService:
    @staticmethod
    def analyze_resume_quality(resume_text: str) -> QualityAnalysisResult:
        """
        Calls Gemini to perform a deep quality analysis of the resume.
        Returns a structured QualityAnalysisResult.
        """
        if not GEMINI_API_KEY:
            # Fallback mock response for testing if no API key is set
            return QualityAnalysisService._get_mock_response()

        prompt = f"""
You are an elite Executive Recruiter and Resume Writer. Analyze the following resume text and provide a detailed quality evaluation.
Focus on impact, professionalism, readability, and content depth. Provide highly constructive and professional feedback.

Resume Text:
\"\"\"
{resume_text}
\"\"\"

Analyze the following categories and provide a score (0-100) and feedback for each:
1. Professionalism: Tone, appropriate language.
2. Readability: Clarity, conciseness.
3. Grammar: Sentence structure, active voice.
4. Formatting: Logical flow (as interpreted from text).
5. Achievements: Impact-driven, quantified results.
6. Projects: Detail, technical depth.
7. Skills: Relevance, categorization.
8. Experience: Career progression, role clarity.
9. Education: Completeness.

Provide an overall score, strengths, weaknesses, critical issues (if any), minor issues, and excellent sections.
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
                    response_schema=QualityAnalysisResult
                )
            )
            data = json.loads(response.text)
            return QualityAnalysisResult(**data)
        except Exception as e:
            print(f"Error calling Gemini for Quality Analysis: {e}")
            return QualityAnalysisService._get_mock_response()

    @staticmethod
    def _get_mock_response() -> QualityAnalysisResult:
        return QualityAnalysisResult(
            overall_score=75,
            category_scores={
                "Professionalism": CategoryScore(score=85, feedback="Very professional tone."),
                "Readability": CategoryScore(score=70, feedback="A bit dense in some areas."),
                "Grammar": CategoryScore(score=90, feedback="No obvious grammatical errors."),
                "Formatting": CategoryScore(score=80, feedback="Logical text flow."),
                "Achievements": CategoryScore(score=60, feedback="Needs more quantifiable metrics."),
                "Projects": CategoryScore(score=75, feedback="Good detail, could explain business value."),
                "Skills": CategoryScore(score=85, feedback="Well categorized."),
                "Experience": CategoryScore(score=70, feedback="Good progression, but bullets lack impact."),
                "Education": CategoryScore(score=90, feedback="Clear and concise.")
            },
            strengths=["Strong technical skills", "No grammar errors", "Professional tone"],
            weaknesses=["Lack of quantified metrics", "Dense paragraphs in experience"],
            critical_issues=["Experience section reads like a job description rather than accomplishments"],
            minor_issues=["Some repetitive action verbs"],
            excellent_sections=["Education", "Skills"],
            general_feedback="This is a solid resume that covers all the basics well, but it needs to pivot from showing responsibilities to showing accomplishments. Adding numbers to your impact statements will elevate this to the next level."
        )
