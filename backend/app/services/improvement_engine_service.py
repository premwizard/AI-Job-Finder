import json
import os
from pydantic import BaseModel, Field
from typing import List
import google.generativeai as genai

# Setup Gemini API key
GEMINI_API_KEY = os.environ.get("GEMINI_API_KEY")
if GEMINI_API_KEY:
    genai.configure(api_key=GEMINI_API_KEY)

class ImprovementSuggestion(BaseModel):
    section: str = Field(description="The section this applies to, e.g., 'Summary', 'Experience', 'Projects', 'Skills'")
    original_text: str = Field(description="The exact original text snippet to be replaced")
    suggested_text: str = Field(description="The improved version of the text")
    improvement_type: str = Field(description="Type of improvement: 'Action Verb', 'Quantification', 'Professional Phrasing', 'ATS Keywords', 'Grammar'")
    reason: str = Field(description="A short explanation of why this suggestion improves the resume")

class ImprovementResult(BaseModel):
    suggestions: List[ImprovementSuggestion]

class ImprovementEngineService:
    @staticmethod
    def generate_improvements(parsed_data_json: str) -> List[ImprovementSuggestion]:
        """
        Calls Gemini to generate targeted improvements for the resume content.
        """
        if not GEMINI_API_KEY:
            # Fallback mock response for testing if no API key is set
            return ImprovementEngineService._get_mock_response()

        prompt = f"""
You are an expert Resume Editor and Career Coach. I will provide you with the parsed JSON data of a resume.
Your task is to analyze the content (Summary, Experience bullet points, Projects, Skills) and provide targeted, localized suggestions to improve the wording.

Rules:
1. Do not rewrite the entire resume. Provide specific, atomic suggestions for individual sentences or bullet points.
2. Focus on: Better wording, stronger action verbs, quantifying achievements, and adding relevant ATS keywords.
3. For `original_text`, provide the EXACT text from the JSON so we can match and replace it later.
4. For `suggested_text`, provide the improved version.
5. Provide 3 to 8 high-impact suggestions.

Resume Data:
\"\"\"
{parsed_data_json}
\"\"\"

Return a list of suggestions matching the JSON schema.
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
                    response_schema=ImprovementResult
                )
            )
            data = json.loads(response.text)
            result = ImprovementResult(**data)
            return result.suggestions
        except Exception as e:
            print(f"Error calling Gemini for Improvements: {e}")
            return ImprovementEngineService._get_mock_response()

    @staticmethod
    def _get_mock_response() -> List[ImprovementSuggestion]:
        return [
            ImprovementSuggestion(
                section="Experience",
                original_text="Worked on the backend API.",
                suggested_text="Engineered and optimized RESTful backend APIs, improving response times.",
                improvement_type="Action Verb",
                reason="Uses stronger action verbs and highlights impact rather than just stating responsibilities."
            ),
            ImprovementSuggestion(
                section="Experience",
                original_text="Helped increase sales.",
                suggested_text="Drove a 20% increase in quarterly sales by implementing a targeted email campaign.",
                improvement_type="Quantification",
                reason="Adding specific numbers provides concrete evidence of your success."
            ),
            ImprovementSuggestion(
                section="Summary",
                original_text="I am a software engineer looking for a job.",
                suggested_text="Results-driven Software Engineer with expertise in scalable architectures and a passion for building robust web applications.",
                improvement_type="Professional Phrasing",
                reason="Creates a stronger, more professional first impression."
            )
        ]
