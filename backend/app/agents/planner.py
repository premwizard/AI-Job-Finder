import json
import os
import google.generativeai as genai
from typing import Dict, Any, List

class Planner:
    def __init__(self):
        api_key = os.environ.get("GEMINI_API_KEY")
        if not api_key:
            raise ValueError("GEMINI_API_KEY not found in environment variables.")
        genai.configure(api_key=api_key)
        self.model = genai.GenerativeModel("gemini-1.5-pro")

    def create_plan(self, goal_title: str, goal_description: str) -> List[Dict[str, Any]]:
        prompt = f"""
        You are the Master AI Career Agent Planner.
        A user has submitted the following career goal:
        TITLE: {goal_title}
        DESCRIPTION: {goal_description or 'None provided.'}
        
        Break this goal down into a logical, sequential Execution Plan.
        You must map the required steps to the following internal System Task Types:
        - ANALYZE_RESUME (Extract and analyze user resume)
        - FIND_MATCHING_JOBS (Search for semantic job matches)
        - ANALYZE_SKILL_GAP (Compare user to a target job)
        - GENERATE_LEARNING_PLAN (Build a roadmap to close gaps)
        - OPTIMIZE_RESUME (Rewrite resume for a specific job)
        - MANUAL_ACTION (Anything that requires the user to do something outside the system, like apply)
        
        Return a JSON array of Task objects in the order they must be executed:
        [
            {{
                "task_type": "ANALYZE_RESUME",
                "description": "Ensure the user's resume is fully parsed and analyzed.",
                "priority": 1
            }},
            ...
        ]
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
            print(f"Planner Error: {e}")
            return [
                {
                    "task_type": "MANUAL_ACTION",
                    "description": f"Manually pursue goal: {goal_title}",
                    "priority": 1
                }
            ]
