# AI Job Finder Workspace Engineering Rules

Welcome to the AI Job Finder repository (Crown Atlas). These workspace rules guide all AI agents interacting with this project.

## Architecture Overview

1. **Backend (`/backend`)**:
   - Built with **FastAPI**, **SQLAlchemy**, **Pydantic v2**, and **Alembic**.
   - Modular architecture separating database models (`app/models` & `src/models`), schemas, routers (`app/routes` & `src/api/routers`), and services.
   - Entry points: `backend/src/main_api.py` (FastAPI app) and `backend/src/main.py` (Daily Job Scraper CLI).

2. **Frontend (`/frontend`)**:
   - Built with **Next.js** (App Router), **React**, and **TypeScript**.
   - Uses Tailwind CSS and modern UI components under `frontend/src/app` and `frontend/src/components`.

3. **Automation & Workflows (`/.github/workflows`)**:
   - `daily_scraper.yml`: Runs the automated daily job scraper at 00:00 UTC.
   - `ci.yml`: Runs backend testing and Docker build checks.
   - `cd.yml`: Manages continuous deployment to container registries and Kubernetes.

## Code Standards & Conventions

- **Python**:
  - Follow PEP 8 guidelines.
  - Maintain typing annotations with `pydantic` schemas for API contracts.
  - Keep relative path resolutions consistent using `sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))` when executing standalone scripts inside `backend/src`.

- **TypeScript / React**:
  - Use strict TypeScript typing.
  - Keep components modular, accessible, and performant.

- **Deduplication & Data Integrity**:
  - Preserve job hash generation in scrapers (`generate_job_hash`) to avoid duplicate job postings in the database.
