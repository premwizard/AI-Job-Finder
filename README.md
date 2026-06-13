# AI Job Finder

An automated job finder that searches for AI/ML/Software Engineering roles across various job boards (Wellfound, Greenhouse, Lever) and sends a daily HTML email summary.

## Features (V1)
- Scrapes job postings using DuckDuckGo Search (bypassing basic ATS blocking for Greenhouse, Lever, and Wellfound).
- Filters jobs based on Roles, Locations, and Experience levels.
- Remembers previously seen jobs using a `seen_jobs.json` database.
- Automatically commits state back to the repository via GitHub Actions.
- Sends a cleanly formatted HTML email with daily matches via Gmail SMTP.

## Setup Instructions

1. **Clone this repository** to your local machine.
2. **Install Dependencies**:
   ```bash
   pip install -r requirements.txt
   ```
3. **Configure Settings**: Edit `src/config.py` to customize the roles, locations, and experience levels you want to search.
4. **Setup Email**:
   - Generate an **App Password** for your Gmail account.
   - For local testing, create a `.env` file or export the following variables:
     - `SMTP_EMAIL`: Your Gmail address.
     - `SMTP_PASSWORD`: Your Gmail App Password.
     - `RECEIVER_EMAIL`: The email address to send jobs to.

## GitHub Actions Deployment

This project includes a GitHub Actions workflow (`.github/workflows/daily_scraper.yml`) that runs daily.

1. Go to your repository settings on GitHub.
2. Navigate to **Secrets and variables > Actions**.
3. Add the following **Repository Secrets**:
   - `SMTP_EMAIL`
   - `SMTP_PASSWORD`
   - `RECEIVER_EMAIL`
4. The GitHub Action requires write permissions to commit `seen_jobs.json`. Go to **Settings > Actions > General > Workflow permissions** and ensure "Read and write permissions" is selected.
5. You can trigger the workflow manually from the "Actions" tab by selecting "Daily Job Scraper" and clicking "Run workflow".

## Future Features (Planned)
- Resume matching & AI ranking
- Auto apply functionality
- Telegram notifications
- AI cover letter generation
- LinkedIn support
