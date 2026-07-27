# Admin Module

This directory contains the backend services dedicated exclusively to platform administrators. 

## Security Warning
**ALL** routes exposed in this module MUST be protected by `require_role(Role.ADMIN)` or higher.
Never expose these endpoints to standard users.

## Structure
- `feature_flags/`: Registry for turning application features on/off at runtime.
- `analytics/`: Aggregation services for pulling system-wide metrics.
- `system/`: Safe extraction of environment variables and configuration.
- `controllers/`: The FastAPI router grouping all administrative REST APIs.
