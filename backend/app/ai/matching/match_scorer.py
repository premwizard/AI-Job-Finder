from typing import Dict

class MatchScorer:
    def __init__(self):
        # Default Weights
        self.weights = {
            "semantic_score": 0.40,
            "skills_score": 0.35,
            "experience_score": 0.15,
            "salary_score": 0.10
        }

    def calculate_overall_score(self, scores: Dict[str, float]) -> float:
        overall = 0.0
        total_weight = 0.0
        
        for key, weight in self.weights.items():
            if key in scores and scores[key] is not None:
                overall += scores[key] * weight
                total_weight += weight
                
        if total_weight == 0:
            return 0.0
            
        # Normalize in case some scores were missing
        final_score = overall / total_weight
        return round(final_score, 2)
