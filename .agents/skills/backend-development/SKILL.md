---
name: backend-development
description: Guidelines and patterns for developing FastAPI endpoints, database models, schemas, and services in the backend module.
---

# Backend Development Skill

Use this skill when implementing or modifying backend features in `backend/`.

## Key Architectural Guidelines

1. **FastAPI Routers**:
   - Register new routers in `backend/src/main_api.py`.
   - Place REST endpoints in `backend/src/api/routers/` or `backend/app/routes/`.
   - Ensure CORS origins allow frontend requests.

2. **Database Models & Alembic**:
   - SQLAlchemy models are defined in `backend/src/models/` and `backend/app/models/`.
   - When adding or altering database fields, create Alembic migration scripts.

3. **Pydantic Schemas**:
   - Define request/response payload validation models in `backend/src/schemas/`.
   - Use response models explicitly in FastAPI endpoint definitions to ensure safe serialization.
