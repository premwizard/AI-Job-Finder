---
name: frontend-development
description: Guidelines and patterns for developing Next.js frontend pages, components, API client integrations, and styling.
---

# Frontend Development Skill

Use this skill when developing or refactoring UI components and pages in `frontend/`.

## Key Architectural Guidelines

1. **Next.js App Router Structure**:
   - Routes and page views live inside `frontend/src/app/`.
   - Reusable UI elements live in `frontend/src/components/`.

2. **API Client Integration**:
   - Fetch backend resources from `http://localhost:8000/api` (or environment-configured API base URL).
   - Implement error handling and loading states cleanly.

3. **Styling & User Experience**:
   - Use Tailwind CSS utility classes.
   - Maintain dark/light mode responsiveness and crisp micro-interactions.
