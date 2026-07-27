# Billing Module

This directory manages all commercial SaaS aspects of AI Job Finder.

## Golden Rules
1. **Provider Abstraction**: NEVER import `stripe` anywhere outside of this module. The rest of the application should only know about "Plans", "Credits", and "Subscriptions".
2. **Metering Requirement**: Any module that costs money (AI Inference, OCR, external API calls) must report to `metering/usage_meter.py` to deduct credits BEFORE executing.
3. **No Payment Data**: We NEVER store raw Credit Card numbers. We only store Customer IDs provided by the payment provider.
