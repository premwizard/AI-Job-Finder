---
name: job-scraper
description: Instructions for extending, testing, and maintaining automated scrapers, scoring logic, and notifications.
---

# Job Scraper Skill

Use this skill when adding job boards, updating scraper logic, or modifying scoring filters.

## Key Architectural Guidelines

1. **Scrapers**:
   - Scrapers are located in `backend/src/scrapers/` (e.g., RemoteOK, Remotive, Greenhouse, Lever, etc.).
   - Each scraper implements a standard interface returning raw job dictionaries with properties: `company`, `role`, `location`, `salary`, `apply_link`, and `description`.

2. **Job Scoring & Filtering**:
   - Filtering rules are evaluated in `backend/src/filters/job_filter.py`.
   - Rejection reasons are logged via `AnalyticsTracker` in `backend/src/main.py`.

3. **Deduplication**:
   - Job hashes are computed via `generate_job_hash(job)` using application links or company+role combinations before saving to PostgreSQL/SQLite.
