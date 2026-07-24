# AI Job Finder

An automated job finder and career management platform that searches for AI/ML/Software Engineering roles across various job boards (Wellfound, Greenhouse, Lever) and provides intelligent AI-powered resume and profile tools.

---

## Architecture

Career Profile
↓
Resume Intelligence
↓
AI Job Intelligence
↓
RAG
↓
AI Career Agent
↓
MCP Integrations

---

## Features

* Career Profile
* AI Resume Intelligence
* ATS Analysis
* Resume Quality Analysis
* Skill Gap Analysis
* Resume Versioning
* Resume Analytics
* Embedding Generation
* Job Scraper (DuckDuckGo Search bypassing basic ATS blocking)
* Automated job matching & filtering
* Daily HTML email notifications via Gmail SMTP
* GitHub Actions automation

---

## 👤 Career Profile

The Career Profile acts as the central source of truth for the platform. Users can build a comprehensive professional profile, including:

### Profile Overview
* Professional profile dashboard
* Profile completion tracking
* Profile strength indicator
* Career readiness overview

### Personal Information
* Personal details
* Contact information
* Location
* Languages
* Profile photo
* Banner image

### Professional Information
* Current role
* Company
* Employment status
* Career level
* Salary expectations
* Notice period
* Preferred work mode

### Professional Summary
* Career summary
* Professional headline
* Career objectives

### Skills
* Categorized skills
* Skill proficiency
* Years of experience
* Skill management

### Work Experience
* Multiple experiences
* Timeline view
* Technologies used
* Achievements

### Education
* Multiple education entries
* Degrees
* Institutions
* Honors

### Certifications
* Certifications
* Credential verification links
* Issue/expiry dates

### Projects
* Portfolio projects
* GitHub links
* Live demos
* AI technologies used
* Images and descriptions

### Resume Center
* Resume upload
* Resume replacement
* Resume version history
* Resume management

### Career Preferences
* Preferred roles
* Preferred locations
* Salary expectations
* Work preferences

### Social Profiles
* GitHub
* LinkedIn
* Portfolio
* Kaggle
* LeetCode
* HackerRank
* Other professional links

### AI Preferences
* Dream companies
* Career goals
* Preferred technologies
* Learning goals

### Achievements
* Awards
* Hackathons
* Publications
* Open source contributions

### Profile Analytics
* Completion percentage
* Skills count
* Experience summary
* Resume status

### Privacy & Notification Settings
* Profile visibility
* Recruiter visibility
* Notification preferences

---

## 🤖 AI Resume Intelligence Engine

Uploaded resumes are transformed into structured, AI-understandable data rather than simply stored as files.

**Processing Pipeline:**
Resume Upload → Document Processing → OCR (for scanned resumes) → Resume Cleaning → AI Resume Parsing → Profile Merge → User Review & Approval → Career Profile Update → Embedding Generation

### Resume Upload Engine
* Drag-and-drop upload
* Multiple file formats
* Resume versioning
* File validation
* Secure storage

### Document Processing
* PDF extraction
* DOC/DOCX extraction
* Plain text processing
* Image detection

### OCR
* Automatic OCR for scanned resumes
* Confidence scoring
* Image preprocessing

### Resume Cleaning
* Text normalization
* Formatting cleanup
* Duplicate removal
* Content preparation

### AI Resume Parser
Automatically extracts:
* Personal information
* Skills
* Experience
* Education
* Certifications
* Projects
* Achievements
* Languages
* Professional summary
* Social links

### Profile Merge Engine
Compares extracted resume information with the existing Career Profile. Detects:
* New skills
* Updated experience
* Missing information
* Conflicts
* Duplicates

*(Note: The engine never overwrites data automatically.)*

### Resume Review
Users can:
* Accept changes
* Reject changes
* Edit extracted information
* Merge selected fields

### ATS Analysis
Evaluates resumes using an ATS analysis engine, providing:
* ATS score
* Keyword analysis
* Formatting evaluation
* Readability
* Grammar
* Missing skills
* Recommendations

### Resume Quality Analysis
Generates insights on:
* Resume quality score
* Professionalism
* Achievement quality
* Project quality
* Experience quality

### Resume Improvement Engine
AI-generated suggestions for:
* Better wording
* Stronger action verbs
* Quantified achievements
* ATS optimization
* Grammar improvements

### Skill Gap Analysis
Compares the user's skills with target career paths and identifies:
* Matching skills
* Missing skills
* Recommended skills
* Learning priorities

### Resume Versioning
Supports:
* Version history
* Resume comparison
* Rollback support
* Change tracking

### Embedding Generation
Structured profile and resume data are converted into vector embeddings to prepare for the upcoming RAG system. The platform is currently "RAG-ready."

### Resume Analytics
Tracks:
* ATS score history
* Resume quality trends
* Skills growth
* Resume improvements
* Version history

---

## Roadmap

### ✅ Completed
* Authentication System
* OAuth Login
* Career Profile
* Resume Intelligence
* ATS Analysis
* Resume Quality Analysis
* Resume Versioning
* Embedding Generation

### 🚧 Coming Next
* AI Job Intelligence
* Semantic Job Matching
* Personalized Recommendations
* RAG
* AI Career Agent
* MCP Integrations
* Auto Apply
* Interview Preparation

---

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

---

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
