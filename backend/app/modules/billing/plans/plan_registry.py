class PlanRegistry:
    """
    Static configuration of SaaS Subscription tiers.
    In the future, this can be moved to a database table for zero-code dynamic pricing.
    """
    PLANS = {
        "free": {
            "name": "Free Tier",
            "monthly_price_usd": 0,
            "monthly_credits": 100,
            "features": ["Basic AI Chat", "1 Resume Upload"]
        },
        "starter": {
            "name": "Starter",
            "monthly_price_usd": 15,
            "monthly_credits": 1000,
            "features": ["Advanced AI Tools", "5 Resume Uploads", "Priority Queue"]
        },
        "pro": {
            "name": "Professional",
            "monthly_price_usd": 49,
            "monthly_credits": 5000,
            "features": ["Unlimited Resumes", "MCP Integrations", "Custom AI Models"]
        }
    }

    @classmethod
    def get_all_plans(cls) -> dict:
        return cls.PLANS

    @classmethod
    def get_plan(cls, plan_id: str) -> dict:
        return cls.PLANS.get(plan_id, cls.PLANS["free"])
