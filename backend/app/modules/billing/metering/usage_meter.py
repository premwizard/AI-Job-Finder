import logging

logger = logging.getLogger("billing_meter")

class UsageMeter:
    """
    Centralized metering service. All billable modules (AI, OCR, MCP) MUST call this
    service to deduct credits before performing operations.
    """
    
    @staticmethod
    async def deduct_credits(user_id: str, amount: int, reason: str) -> bool:
        """
        Deducts credits from a user's organizational or personal account.
        Returns False if the user has insufficient credits.
        """
        # In a real database, this would execute an atomic UPDATE query on the user's credit balance.
        logger.info(f"METER: Deducting {amount} credits from User {user_id} for '{reason}'")
        
        # Mocking a successful deduction
        return True
        
    @staticmethod
    async def record_ai_request(user_id: str, tokens_used: int):
        """
        Helper method specifically for tracking AI usage.
        We charge 1 credit per 1000 tokens as an example.
        """
        cost = max(1, tokens_used // 1000)
        await UsageMeter.deduct_credits(user_id, cost, "AI Inference")
