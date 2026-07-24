from typing import Dict, Any

class RankingEngine:
    def __init__(self):
        # Semantic Match — 40%
        # Career Preferences — 20%
        # User Behavior — 15%
        # Career Growth — 10%
        # Job Freshness — 5%
        # Compensation — 5%
        # Company Quality — 5%
        self.weights = {
            "semantic_score": 0.40,
            "preferences_score": 0.20,
            "behavior_score": 0.15,
            "career_growth_score": 0.10,
            "freshness_score": 0.05,
            "compensation_score": 0.05,
            "company_score": 0.05
        }

    def calculate_recommendation(self, factors: Dict[str, float]) -> float:
        overall = 0.0
        total_weight = 0.0
        
        for key, weight in self.weights.items():
            if key in factors and factors[key] is not None:
                overall += factors[key] * weight
                total_weight += weight
                
        if total_weight == 0:
            return 0.0
            
        final_score = overall / total_weight
        return round(final_score, 2)

    def categorize_score(self, score: float) -> str:
        if score >= 90:
            return "Top Pick"
        elif score >= 80:
            return "Highly Recommended"
        elif score >= 70:
            return "Recommended"
        elif score >= 50:
            return "Worth Exploring"
        return "Low Priority"
