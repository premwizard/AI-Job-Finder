import os
import json
import google.generativeai as genai
from typing import Dict, Any

class ReflectionEngine:
    def __init__(self):
        api_key = os.environ.get("GEMINI_API_KEY")
        if not api_key:
            raise ValueError("GEMINI_API_KEY not found in environment variables.")
        genai.configure(api_key=api_key)
        self.model = genai.GenerativeModel("gemini-1.5-pro")

    def reflect_on_task(self, task_type: str, result_summary: str, failed: bool = False) -> Dict[str, Any]:
        status_text = "FAILED" if failed else "COMPLETED"
        
        prompt = f"""
        You are the Cognitive Reflection Engine for an AI Career Agent.
        A task has just finished executing.
        TASK TYPE: {task_type}
        STATUS: {status_text}
        RESULT/ERROR OUTPUT: {result_summary}
        
        Evaluate the execution. Return a JSON object exactly matching this schema:
        {{
            "success": true/false,
            "confidence": 0.0 - 1.0,
            "reasoning": "Why was it successful or why did it fail?",
            "mitigation": "If it failed, what should the agent do differently on retry? (Or null if success)",
            "requires_replanning": true/false
        }}
        """
        
        try:
            response = self.model.generate_content(prompt)
            text = response.text.strip()
            if text.startswith("```json"): text = text[7:]
            if text.endswith("```"): text = text[:-3]
            return json.loads(text.strip())
        except Exception as e:
            print(f"Reflection Error: {e}")
            return {
                "success": not failed,
                "confidence": 0.5,
                "reasoning": "Fallback reflection due to parsing error.",
                "mitigation": "Manual intervention may be required.",
                "requires_replanning": failed
            }
