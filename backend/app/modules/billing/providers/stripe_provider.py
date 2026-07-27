import os
import stripe

class StripeProvider:
    """
    Abstract wrapper around the official Stripe SDK.
    Never leak Stripe IDs or Stripe specific exceptions outside of this module.
    """
    def __init__(self):
        # Fallback to a mock key to prevent crashing during local development 
        # when the API key is not yet provided by the user.
        stripe.api_key = os.environ.get("STRIPE_SECRET_KEY", "sk_test_mock_key")

    async def create_checkout_session(self, user_id: str, plan_id: str) -> str:
        """
        Creates a checkout session for the user and returns the URL.
        """
        # In a real implementation, we would map our internal `plan_id` to a Stripe Price ID
        # and create a session. For this scaffold, we return a mock URL.
        if stripe.api_key == "sk_test_mock_key":
            return f"https://checkout.stripe.com/pay/mock_session_{user_id}_{plan_id}"
            
        # Example Stripe implementation:
        # session = stripe.checkout.Session.create(
        #     customer=user_id,
        #     payment_method_types=['card'],
        #     line_items=[{'price': 'price_123', 'quantity': 1}],
        #     mode='subscription',
        #     success_url='https://aijobfinder.com/billing/success',
        #     cancel_url='https://aijobfinder.com/billing/cancel',
        # )
        # return session.url
        return "https://checkout.stripe.com/pay/real_session"
