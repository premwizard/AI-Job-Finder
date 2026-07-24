from typing import Dict, Any
import random

class OpportunityEvaluator:
    def __init__(self):
        pass

    def evaluate(self, job_title: str, user_profile: Dict[str, Any]) -> Dict[str, Any]:
        # In a real system, this invokes the Semantic Matching tool & Skill Gap tools.
        # For prototype, we generate mock scores based on simulated matching.
        score = random.uniform(50, 100)
        
        category = "Good Match"
        if score > 90:
            category = "Perfect Match"
        elif score > 75:
            category = "Strong Match"
        elif score < 60:
            category = "Stretch Opportunity"

        reasoning = f"Based on semantic matching, this role has an estimated ATS compatibility of {score:.1f}%. It strongly aligns with your stated career goals."
        
        return {
            "match_score": round(score, 2),
            "category": category,
            "reasoning": reasoning
        }
