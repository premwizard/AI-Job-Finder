from fastapi import APIRouter, Depends, Request, status
from pydantic import BaseModel

from app.modules.billing.plans.plan_registry import PlanRegistry
from app.modules.billing.providers.stripe_provider import StripeProvider
from app.modules.billing.webhooks.webhook_handler import WebhookHandler
from app.modules.billing.metering.usage_meter import UsageMeter

router = APIRouter(prefix="/api/v1/billing", tags=["Billing & Monetization"])

@router.get("/plans", status_code=status.HTTP_200_OK)
async def get_subscription_plans():
    """
    Returns the list of available SaaS Subscription tiers.
    """
    return PlanRegistry.get_all_plans()

class CheckoutRequest(BaseModel):
    plan_id: str

@router.post("/checkout", status_code=status.HTTP_200_OK)
async def create_checkout_session(data: CheckoutRequest):
    """
    Generates a secure Stripe Checkout URL for the requested plan.
    Requires authentication in production.
    """
    provider = StripeProvider()
    # Hardcoded user_id for scaffolding. In production, use Depends(get_current_user)
    checkout_url = await provider.create_checkout_session("user_12345", data.plan_id)
    
    return {"checkout_url": checkout_url}

@router.post("/webhooks/stripe", status_code=status.HTTP_200_OK)
async def stripe_webhook(request: Request):
    """
    Endpoint for Stripe to asynchronously notify us of successful payments.
    """
    return await WebhookHandler.process_stripe_webhook(request)

@router.post("/test-meter", status_code=status.HTTP_200_OK)
async def test_usage_meter():
    """
    Diagnostic endpoint to demonstrate credit deduction.
    """
    success = await UsageMeter.deduct_credits("user_12345", 5, "Resume ATS Scan")
    return {"deducted": success, "credits_charged": 5}
