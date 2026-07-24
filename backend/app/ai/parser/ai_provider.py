import os
from abc import ABC, abstractmethod
import google.generativeai as genai
from typing import Dict, Any

class BaseAIProvider(ABC):
    @abstractmethod
    def parse_text(self, prompt: str, text: str) -> str:
        """Parse text and return the AI response string, which should be JSON."""
        pass


class GeminiProvider(BaseAIProvider):
    def __init__(self):
        api_key = os.environ.get("GEMINI_API_KEY")
        if not api_key:
            raise ValueError("GEMINI_API_KEY not found in environment variables.")
        genai.configure(api_key=api_key)
        
        # We use a model suitable for complex instruction following and JSON generation
        self.model = genai.GenerativeModel('gemini-1.5-flash')

    def parse_text(self, prompt: str, text: str) -> str:
        full_prompt = f"{prompt}\n\nJob Description:\n{text}"
        response = self.model.generate_content(
            full_prompt,
            generation_config=genai.types.GenerationConfig(
                response_mime_type="application/json",
            ),
        )
        return response.text
