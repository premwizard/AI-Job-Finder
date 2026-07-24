import os
import json
import google.generativeai as genai
from typing import Dict, Any, List
from app.memory.context_builder import MemoryContextBuilder

class CognitivePlanner:
    def __init__(self):
        api_key = os.environ.get("GEMINI_API_KEY")
        if not api_key:
            raise ValueError("GEMINI_API_KEY not found in environment variables.")
        genai.configure(api_key=api_key)
        self.model = genai.GenerativeModel("gemini-1.5-pro")
        self.context_builder = MemoryContextBuilder()

    def generate_plan(self, user_id: str, goal_title: str, goal_description: str) -> Dict[str, Any]:
        memory_context = self.context_builder.build_context(user_id, goal_title, limit=10)
        
        prompt = f"""
        You are the Cognitive Planning Engine for an AI Career Agent.
        A user has submitted the following career goal:
        TITLE: {goal_title}
        DESCRIPTION: {goal_description or 'None provided.'}
        
        USER MEMORY CONTEXT:
        {memory_context}
        
        Generate a detailed execution plan. Decompose the goal into specific, actionable tasks.
        Map tasks to these capabilities:
        - ANALYZE_RESUME
        - FIND_MATCHING_JOBS
        - ANALYZE_COMPANY
        - ANALYZE_SKILL_GAP
        - GENERATE_LEARNING_PLAN
        - PREPARE_INTERVIEW
        - OPTIMIZE_RESUME
        - MANUAL_ACTION
        
        Return a JSON object:
        {{
            "goal": "{goal_title}",
            "risk_level": "LOW|MEDIUM|HIGH",
            "success_criteria": ["criteria 1", "criteria 2"],
            "tasks": [
                {{
                    "task_type": "ANALYZE_RESUME",
                    "description": "Task description",
                    "priority": 1,
                    "dependencies": [],
                    "required_agent": "ResumeAgent"
                }}
            ]
        }}
        """
        
        try:
            response = self.model.generate_content(prompt)
            text = response.text.strip()
            if text.startswith("```json"): text = text[7:]
            if text.endswith("```"): text = text[:-3]
            return json.loads(text.strip())
        except Exception as e:
            print(f"Planner Error: {e}")
            return {"tasks": []}
