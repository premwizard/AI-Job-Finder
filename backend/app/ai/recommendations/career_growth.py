from typing import List

class CareerGrowthCalculator:
    def __init__(self):
        # We will assume a simple rule-based approach for career growth for the MVP.
        # If the job offers skills the user doesn't have, it's a growth opportunity.
        # If the user has everything, they might stagnate.
        # Too many missing skills = unrealistic.
        pass

    def calculate_growth_score(self, missing_skills: List[str], matched_skills: List[str]) -> float:
        total_skills = len(missing_skills) + len(matched_skills)
        if total_skills == 0:
            return 50.0 # Neutral growth
            
        missing_ratio = len(missing_skills) / total_skills
        
        # Ideal growth is having 70-80% of skills, and 20-30% to learn.
        # If missing is ~0.25 -> 100 score.
        # If missing is 0 -> 40 score (low growth).
        # If missing is > 0.5 -> 20 score (too hard).
        
        if missing_ratio == 0:
            return 40.0
        elif 0.1 <= missing_ratio <= 0.3:
            return 100.0
        elif 0.3 < missing_ratio <= 0.5:
            return 80.0
        else:
            return 30.0
