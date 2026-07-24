# AI Job Finder

An automated job finder and career management platform that searches for AI/ML/Software Engineering roles across various job boards (Wellfound, Greenhouse, Lever) and provides intelligent AI-powered resume and profile tools.

---

## 🏛️ Updated AI Architecture

User
↓
Authentication
↓
Career Profile
↓
Resume Intelligence
↓
Job Intelligence
↓
Embedding Engine
↓
Semantic Matching
↓
Recommendation Engine
↓
Explainable AI
↓
Learning Roadmap
↓
RAG Infrastructure
↓
Conversational RAG
↓
Hybrid Retrieval
↓
Company Intelligence
↓
Resume Optimization
↓
AI Career Agent
↓
Multi-Agent System
↓
Memory Engine
↓
Planning & Reasoning Engine
↓
Tool Registry
↓
Opportunity Monitoring Agent

---

## ✨ Features

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

## 🧠 Phase 4 — AI Intelligence Layer

### 1. Job Embedding Engine
The foundational vector intelligence layer of the platform.
* Automatic embedding generation for every parsed job
* Configurable embedding providers
* Metadata-aware storage
* Vector database integration
* Incremental embedding generation
* Re-embedding support
* Embedding versioning
* Enables Semantic Search, Recommendation Engine, Skill Gap Analysis, and RAG Retrieval.

### 2. Semantic Job Matching Engine
Intelligently matches users with jobs beyond simple keyword overlap.
* Resume vs Job semantic similarity
* Skills, Experience, Education, and Certification matching
* Salary and Location matching
* Career preference matching
* Configurable scoring weights
* Explainable score breakdown
* AI-powered recommendation scores

### 3. AI Recommendation Engine
Consumes semantic matching scores to rank and personalize job feeds.
* Personalized recommendations
* Recommendation ranking
* User preference learning
* Recommendation confidence
* Career growth scoring
* Recommendation explanations
* Dashboard widgets
* Recommendation analytics

### 4. Explainable AI (XAI)
Provides full transparency into AI-driven decisions.
* Human-readable explanations
* Recommendation reasoning
* Match breakdowns
* Confidence scores
* Missing skills
* Strength analysis
* Career growth explanations
* Actionable improvement suggestions

### 5. Skill Gap Analysis & Learning Roadmap
Generates actionable career paths to help users become job-ready.
* Skill classification
* Missing skill detection
* Priority ranking
* Learning roadmap generation
* Difficulty and Time estimation
* Match improvement simulation
* Multi-job comparison
* Career readiness analysis

---

## 🕸️ Phase 5 — RAG Intelligence Layer

The platform now natively supports Retrieval-Augmented Generation (RAG) over all structured career and company knowledge.

### 1. RAG Infrastructure
The foundational RAG environment for future AI integrations.
* Multi-collection knowledge base (Jobs, Users, Companies, Learning)
* Chunking strategy
* Metadata storage
* Hybrid retrieval
* Context building
* Embedding management
* Incremental indexing
* RAG administration

### 2. Conversational Career RAG
A robust AI Career Assistant allowing users to chat directly with platform data.
* AI Career Assistant
* Context-aware conversations
* Conversation memory
* Streaming responses
* Suggested prompts
* Citation support
* Grounded responses
* User-specific retrieval

### 3. Multi-Collection Hybrid Retrieval
An advanced search engine for cross-collection intelligence.
* Hybrid Search
* Semantic Search
* Keyword Search
* Metadata Search
* Query rewriting
* Reranking
* Context compression
* Collection-aware retrieval

### 4. Company Intelligence RAG
A module dedicated to reverse-engineering company insights and bringing them into RAG.
* Company profiles
* Engineering culture
* Technology stacks
* Benefits
* Career fit analysis
* Company comparisons
* Company embeddings
* AI-generated summaries

### 5. Resume Optimization RAG
Generates evidence-based, section-by-section resume rewrites.
* Evidence-based optimization
* ATS improvements
* Resume comparison
* Match score projections
* Section-by-section optimization
* Resume versioning
* Resume optimization history

---

## 🚀 Phase 6 — AI Career Agent Platform

Phase 6 transforms the platform from an AI-powered job finder into an autonomous, agent-based career platform. It introduces an AI Career Agent capable of planning, reasoning, orchestrating specialized agents, maintaining long-term memory, coordinating tools, and proactively monitoring career opportunities. This phase builds directly on the intelligence layers developed in Phases 1–5.

### 1. Module 1 — AI Career Agent Core
The AI Career Agent acts as the central orchestrator for the entire platform.
* Goal-based career planning
* Goal creation and management
* Execution plan generation
* Task decomposition & dependency management
* Goal progress tracking & execution monitoring
* Reflection logging & planning history
* Goal analytics
* Background execution support
* Manual and semi-autonomous execution modes

### 2. Module 2 — Multi-Agent Architecture
A Supervisor-Worker architecture where specialized agents reuse existing business services without duplicating logic.
**Specialized Agents:**
* **Resume Agent:** Optimizes and analyzes resumes.
* **Job Search Agent:** Discovers and filters relevant jobs.
* **Company Intelligence Agent:** Evaluates company culture and tech stacks.
* **Learning Agent:** Generates skill-gap roadmaps.
* **Interview Agent:** Prepares the user for interviews.
* **Recommendation Agent:** Generates personalized opportunity feeds.
* **Career Strategy Agent:** Advises on long-term career moves.

**Features:**
* Shared context & agent communication
* Agent registry & health monitoring
* Parallel execution & orchestration
* Structured messaging & execution timelines

### 3. Module 3 — Persistent Memory & Context Engine
Provides personalized continuity across sessions. All agents retrieve user context from this centralized Memory Engine.
**Memory Types:**
* **Working Memory:** Immediate task context.
* **Short-Term Memory:** Recent conversation history.
* **Long-Term Memory:** Persistent user facts.
* **Episodic Memory:** Past career events and milestones.
* **Semantic Memory:** Concept relationships (e.g., skill affinities).

**Features:**
* Personalized AI & career timeline
* Preference learning & resume/application/interview/learning history
* Memory consolidation & semantic search
* Context building & importance scoring

### 4. Module 4 — Planning, Reasoning & Reflection Engine
The cognitive core of the AI Career Agent. Model-agnostic and supports interchangeable LLM providers.
**Planning:** Dynamic execution planning, goal decomposition, task prioritization, dependency management, milestone generation.
**Reasoning:** Multi-step reasoning, structured decision making, evidence-based reasoning, confidence scoring, alternative strategies.
**Reflection:** Self-evaluation, execution feedback, replanning, risk analysis, reflection history.

### 5. Module 5 — Unified Tool Registry & Tool Calling Framework
AI agents never call services directly; they execute all capabilities through this unified interface.
* Centralized Tool Registry
* Internal Tool Support & External Tool Support
* Future MCP compatibility
* Tool discovery, registration, validation, and execution
* Permission management & health monitoring
* Retry handling & execution logging
* Tool analytics & versioned tools

### 6. Module 6 — Autonomous Job Search & Opportunity Monitoring Agent
Transforms the platform from a scheduled scraper into an intelligent career opportunity monitor.
* Intelligent job discovery & continuous opportunity monitoring
* Multi-provider job search & duplicate detection
* Semantic job evaluation
* Company intelligence & skill-gap analysis integration
* Opportunity ranking & career impact analysis
* Personalized recommendations & intelligent notifications
* Opportunity timeline & market trend monitoring
* Adaptive search strategies

---

## 🔌 API Documentation

### Job Embeddings
* `GET /api/embeddings/status`
* `POST /api/embeddings/generate`

### Semantic Matching & Recommendations
* `POST /api/recommendations/match`
* `GET /api/recommendations/user`

### Explainable AI
* `GET /api/explanations/job/{id}`
* `POST /api/explanations/generate`

### Learning Roadmaps
* `GET /api/learning/roadmap/{job_id}`
* `POST /api/learning/generate`

### RAG & Search
* `GET /api/rag/statistics`
* `POST /api/rag/reindex`
* `POST /api/rag/search`
* `POST /api/search`
* `POST /api/search/vector`
* `POST /api/search/keyword`
* `POST /api/search/structured`
* `GET /api/search/statistics`

### Chat
* `POST /api/chat`
* `GET /api/chat/history`
* `DELETE /api/chat/history`
* `GET /api/chat/statistics`

### Company Intelligence
* `GET /api/company`
* `GET /api/company/{id}`
* `GET /api/company/{id}/summary`
* `GET /api/company/{id}/culture`
* `GET /api/company/{id}/technology`
* `GET /api/company/{id}/benefits`
* `POST /api/company/enrich`
* `GET /api/company/statistics`

### Resume Optimization
* `POST /api/resume/optimize`
* `POST /api/resume/optimize/preview`
* `POST /api/resume/optimize/apply`
* `GET /api/resume/optimization/history`
* `GET /api/resume/optimization/statistics`

### Career Agent & Multi-Agent (Phase 6)
* `POST /api/agents/goals`
* `GET /api/agents/goals`
* `POST /api/agents/execute`
* `GET /api/agents/dashboard`

### Persistent Memory (Phase 6)
* `GET /api/memory`
* `POST /api/memory`
* `POST /api/memory/search`
* `POST /api/memory/consolidate`

### Planning & Reasoning (Phase 6)
* `POST /api/planner/create`
* `POST /api/planner/decision`
* `GET /api/planner/evaluate/{goal_id}`
* `GET /api/planner/history/{goal_id}`

### Unified Tool Registry (Phase 6)
* `GET /api/tools`
* `POST /api/tools/execute`
* `GET /api/tools/statistics`

### Opportunity Monitoring (Phase 6)
* `POST /api/job-monitor/monitor`
* `GET /api/job-monitor/opportunities`
* `PATCH /api/job-monitor/opportunities/{id}`
* `GET /api/job-monitor/statistics`

---

## 🌟 Core AI Features

* Resume Intelligence & ATS Analysis
* Career Profile Intelligence & Job Intelligence
* Job Embeddings & Semantic Matching
* Recommendation Engine & Explainable AI
* Skill Gap Analysis & Learning Roadmaps
* Conversational Career RAG & Hybrid Retrieval
* Company Intelligence & Resume Optimization
* **[NEW] AI Career Agent (Autonomous Planning & Execution)**
* **[NEW] Multi-Agent System (Supervisor-Worker Architecture)**
* **[NEW] Persistent Memory Engine (Semantic & Episodic)**
* **[NEW] Cognitive Reasoning & Decision Engine**
* **[NEW] Unified Tool Registry**
* **[NEW] Autonomous Opportunity Monitoring (Intelligent Recruiter)**

---

## 🚀 Roadmap

### ✅ Completed
* Phase 1 — Authentication & User Management
* Phase 2 — Career Profile & Resume Intelligence
* Phase 3 — Job Intelligence
* Phase 4 — AI Intelligence Layer
* Phase 5 — RAG Intelligence Layer
* Phase 6 — AI Career Agent Platform

### 🚧 Coming Next
* Phase 7 — MCP Integration Layer
* Phase 8 — Enterprise SaaS & Production Platform

---

## 📸 Screenshots

| Dashboard | Career Profile |
| :---: | :---: |
| *(Screenshot coming soon)* | *(Screenshot coming soon)* |

| Resume Intelligence | Job Recommendations |
| :---: | :---: |
| *(Screenshot coming soon)* | *(Screenshot coming soon)* |

| Learning Roadmap | AI Chat |
| :---: | :---: |
| *(Screenshot coming soon)* | *(Screenshot coming soon)* |

| Company Intelligence | Resume Optimization |
| :---: | :---: |
| *(Screenshot coming soon)* | *(Screenshot coming soon)* |

| AI Career Agent Dashboard | Goal Planner |
| :---: | :---: |
| *(Screenshot coming soon)* | *(Screenshot coming soon)* |

| Memory Center | Planning Center |
| :---: | :---: |
| *(Screenshot coming soon)* | *(Screenshot coming soon)* |

| Tool Center | Opportunity Monitoring |
| :---: | :---: |
| *(Screenshot coming soon)* | *(Screenshot coming soon)* |

---

## ⚡ Performance

* **Caching:** Heavy computations (like API queries) are cached to reduce latency.
* **Incremental Indexing:** Vector databases update sequentially rather than bulk rebuilding on every change.
* **Streaming:** Chat routes and AI generation support streaming outputs for near-instant UX.
* **Background Workers & Parallel Execution:** Heavy RAG indexing tasks and multi-agent coordination operate asynchronously in parallel.
* **Embedding Optimization:** Dynamic batch sizing avoids rate limits while keeping latency low.
* **Retrieval Optimization:** Hybrid keyword-vector search guarantees sub-second fetch speeds.
* **Context Caching & Memory Consolidation:** AI reasoning efficiency is improved via token compression and long-term memory retrieval.
* **Tool Execution Optimization:** Intelligent retries and fast failure via strict Pydantic validation boundaries.

---

## 🔒 Security

* **JWT Authentication & OAuth**
* **Email Verification & Password Reset**
* **Role-based Authorization & Agent Authorization:** Ensures both users and internal agents have correct execution permissions.
* **Tool Authorization:** Hardened boundaries preventing agents from executing arbitrary tools.
* **Retrieval Authorization:** Ensures users can only query their own specific chunks within the multitenant RAG collections.
* **Memory Isolation:** Secure isolation of short-term and episodic memory per user.
* **Protected AI Endpoints:** Rate-limited and scoped to prevent abuse.
* **Audit Logging:** Every autonomous agent decision, tool execution, and reflection is strictly audited and viewable in the UI.

---

## 📊 Analytics

* **Profile & Resume Analytics:** ATS scores, quality trends, and skills growth.
* **Goal & Task Analytics:** AI execution tracking, task completion rates, and planning efficiency.
* **Agent Analytics:** Workload distribution, reasoning confidence, and multi-agent network health.
* **Memory Analytics:** Knowledge graph density and consolidation metrics.
* **Tool Analytics:** Usage frequency, failure rates, and execution latency across all registered tools.
* **Opportunity Analytics:** AI match scores, recruiter funnel metrics, and autonomous discovery tracking.

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