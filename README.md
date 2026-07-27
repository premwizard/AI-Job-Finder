# AI Job Finder

An automated job finder and career management platform that searches for AI/ML/Software Engineering roles across various job boards (Wellfound, Greenhouse, Lever) and provides intelligent AI-powered resume and profile tools.

---

## 🏛️ Updated System Architecture

AI Career Copilot
↓
Planning Engine
↓
Reasoning Engine
↓
Memory Engine
↓
Multi-Agent System
↓
Multi-MCP Orchestrator
↓
Unified Tool Registry
↓
MCP Core Infrastructure
↓
GitHub | Gmail | Calendar | Drive | ATS
↓
Career Intelligence Services
↓
Personalized Recommendations

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

## 🚀 Phase 7 – MCP Integration & Autonomous Career Intelligence

### Overview
Phase 7 transforms AI Job Finder from an intelligent job search platform into a complete **AI Career Operating System**.

This phase introduces the **Model Context Protocol (MCP)** architecture, intelligent external integrations, autonomous workflow orchestration, career relationship management, salary intelligence, and the **Autonomous Career Copilot** capable of coordinating every AI subsystem across the platform.

### 🏗️ MCP Core Infrastructure
Implement a provider-agnostic MCP architecture that integrates seamlessly with the existing Unified Tool Registry.

* Official MCP SDK Integration
* MCP Client Infrastructure
* Connection Manager
* Session Management
* Transport Abstraction
* Capability Discovery
* Tool Registration
* Resource Registry
* Prompt Registry
* Health Monitoring
* Retry & Recovery
* Metrics & Logging
* Secure Authentication
* Dynamic Provider Discovery
* Pluggable Provider Architecture

### 🧠 GitHub Career Intelligence
Convert GitHub into a career intelligence platform.

* Repository Analysis
* Portfolio Scoring
* Engineering Quality Analysis
* Technology Extraction
* Resume Recommendations
* Project Ranking
* Career Relevance Analysis
* Open Source Activity Analysis
* Contribution Analytics
* GitHub Portfolio Dashboard

### 📧 Gmail Career Intelligence
Transform Gmail into an AI-powered recruiting communication hub.

* Smart Email Classification
* Recruiter Intelligence
* Interview Detection
* Offer Detection
* Follow-up Recommendations
* Smart Draft Generation
* Attachment Intelligence
* Career Timeline Synchronization
* Semantic Email Search
* AI Communication Assistant

### 📅 Google Calendar Career Scheduling
Intelligent scheduling and planning for career growth.

* Interview Scheduling
* Study Planner
* Career Timeline
* Smart Availability
* Deadline Tracking
* Reminder Intelligence
* Learning Schedule
* Weekly Planning
* Calendar Analytics
* AI Scheduling Recommendations

### 📁 Google Drive Career Knowledge Platform
A centralized document intelligence platform.

* Resume Version Management
* Cover Letter Management
* Certificate Repository
* Portfolio Storage
* AI Document Analysis
* Semantic Search
* Knowledge Graph Integration
* Document Metadata
* Incremental Indexing
* AI Document Recommendations

### 🔄 Multi-MCP Workflow Orchestrator
Coordinate multiple MCP providers in intelligent workflows.

* Dynamic Provider Selection
* Workflow Planning
* Parallel Execution
* Result Aggregation
* Intelligent Routing
* Context Sharing
* Failure Recovery
* Workflow Analytics
* Cross-Provider Collaboration
* Memory Synchronization

### 📋 Applicant Tracking System Integration
Unified application tracking across multiple recruiting platforms.

**Supported Providers:**
* Greenhouse
* Lever
* Ashby
* Workday
* SmartRecruiters
* Jobvite
* iCIMS
* Oracle Recruiting
* Future Custom Providers

**Features:**
* Unified Application Pipeline
* Status Synchronization
* Duplicate Detection
* AI Application Insights
* Pipeline Analytics
* Recruiter Tracking
* Interview Tracking
* Offer Tracking
* Background Synchronization
* Smart Notifications

### 🤝 Recruiter CRM & Networking Intelligence
Manage professional relationships intelligently.

* Recruiter CRM
* Relationship Graph
* Referral Tracking
* Communication Timeline
* Company Relationship View
* Networking Planner
* Follow-up Intelligence
* Relationship Analytics
* Recruiter Profiles
* AI Networking Recommendations

### 💰 Salary Intelligence & Offer Negotiation
AI-powered compensation analysis and career decision support.

* Salary Benchmarking
* Offer Comparison
* Compensation Calculator
* Career ROI Analysis
* Negotiation Strategy Generator
* Offer Risk Analysis
* Decision Simulator
* AI Recommendations
* Market Insights
* Negotiation Email Generator

### 🤖 Autonomous Career Copilot
The central intelligence layer of AI Job Finder.

* Long-Term Goal Management
* Autonomous Career Planning
* Continuous Monitoring
* Intelligent Task Generation
* Weekly Career Reviews
* Monthly Strategy Reports
* Career Health Score
* Opportunity Prediction
* AI Decision Support
* Reflection Engine
* Adaptive Learning
* Cross-Agent Coordination
* Workflow Automation
* Personalized Recommendations

### 🧩 MCP Ecosystem
The platform now supports a modular provider architecture where new integrations can be added without changing the AI agents.

**Current MCP Providers:**
* GitHub
* Gmail
* Google Calendar
* Google Drive
* ATS Provider Platform

**Future Ready:**
* Notion
* Slack
* Microsoft 365
* Jira
* Linear
* Confluence
* Salesforce
* Custom Enterprise Providers

### 🎯 Why Phase 7 Matters
Phase 7 transforms AI Job Finder from a traditional AI assistant into a proactive AI Career Operating System capable of planning, coordinating, reasoning, and continuously improving a user's career journey through autonomous intelligence and standardized MCP integrations.

---

## 🚀 Phase 8 — Module 1: Enterprise Architecture & Microservices

### Goal
Refactor AI Job Finder from a modular monolithic application into a scalable, enterprise-grade service-oriented architecture while preserving all existing functionality.

This is **not** a full microservices migration yet.

Instead, build a **Modular Monolith with Microservice Boundaries**, allowing each domain to become an independent service in the future without major code changes.

The platform should continue to run as a single deployment during development while maintaining clean separation of domains, contracts, and communication patterns.

### Architecture Vision

**Current**
Frontend
↓
Backend
↓
Database

**Target**
Frontend
↓
API Gateway Layer
↓
Domain Modules
↓
Shared Infrastructure
↓
Database

Each domain should be independently deployable in the future.

### Core Principles
Follow these architectural principles throughout the implementation.

* Domain-Driven Design (DDD)
* Clean Architecture
* SOLID Principles
* Feature-Based Organization
* Dependency Injection
* Interface-Based Programming
* Event-Driven Communication (internally)
* Shared Kernel only when necessary
* Explicit module boundaries
* No circular dependencies

### Domain Modules
Organize the backend into independent domains.

**Example:**
`server/`
`modules/`
`auth/`, `users/`, `profile/`, `resume/`, `resume-intelligence/`, `job-search/`, `job-tracker/`, `company-intelligence/`, `career-agent/`, `copilot/`, `memory/`, `rag/`, `interview/`, `salary/`, `crm/`, `notifications/`, `documents/`, `mcp/`, `workflow/`, `analytics/`, `admin/`, `billing/`, `settings/`, `shared/`

Each module should own its business logic, services, repositories, DTOs, validators, routes, and tests.

### Internal Module Structure
Each module should follow a consistent structure.

`modules/resume/`
* `controllers/`
* `services/`
* `repositories/`
* `entities/`
* `dto/`
* `validators/`
* `events/`
* `interfaces/`
* `routes/`
* `middlewares/`
* `utils/`
* `tests/`
* `README.md`

Avoid placing business logic in controllers.

### API Gateway Layer
Create an internal API Gateway layer.

**Responsibilities:**
* Route requests
* Authentication
* Authorization
* Request validation
* API versioning
* Logging
* Rate limiting hooks
* Metrics collection
* Error handling
* Response formatting

This gateway should prepare the project for future external API gateways.

### Shared Infrastructure
Create a shared infrastructure layer.

`shared/`
`database/`, `cache/`, `config/`, `events/`, `logger/`, `middleware/`, `errors/`, `exceptions/`, `validation/`, `utils/`, `security/`, `constants/`, `types/`, `contracts/`

Do not place business logic here.
Only reusable infrastructure.

### Configuration Management
Centralize configuration.

**Support:**
* Development, Testing, Staging, Production
* Environment validation
* Secret management abstraction
* Feature flags
* Typed configuration
* Fail fast if required configuration is missing.

### Dependency Injection
Implement dependency injection throughout the backend.

* Avoid directly instantiating services.
* Every service should depend on interfaces.
* Support future replacement of implementations.

### Repository Pattern
Separate database logic.

**Repositories should:**
* Own queries
* Hide ORM/database details
* Expose domain-friendly methods
* Support unit testing
* Avoid database calls inside controllers.

### Service Layer
Business logic belongs only in services.

**Controllers should:**
* Receive requests
* Validate input
* Call services
* Return responses
* Nothing more.

### DTO Validation
Introduce DTOs for every request and response.

**Support:**
* Validation
* Transformation
* Sanitization
* Type safety
* Consistent API contracts

### Event Bus
Introduce an internal event system.

**Examples:**
`UserRegistered`, `ResumeUploaded`, `ResumeAnalyzed`, `JobApplied`, `InterviewScheduled`, `OfferReceived`, `GoalCompleted`, `NotificationCreated`

* Events should decouple modules.
* Avoid direct module dependencies.

### API Versioning
Support `/api/v1/` and prepare for `/api/v2/` without breaking clients.

### Error Handling
Create a unified error framework.

**Support:**
Validation Errors, Authentication Errors, Authorization Errors, Business Errors, Not Found, Conflict, Rate Limit, External Service Failure, Unexpected Errors.

Return consistent API responses.

### Logging
Implement structured logging.

Every request should include: Request ID, User ID (if authenticated), Module, Execution Time, Status, Correlation ID.
Avoid `console.log` in production code.

### Health Checks
Create health endpoints.

`GET /api/v1/health`

**Return:** Application, Database, Cache, Queue (future), MCP, External Services, Version, Uptime.

### Module Communication
Modules should communicate using Interfaces, Events, Shared contracts.
Avoid direct imports whenever possible.
Never create circular dependencies.

### API Documentation
Automatically generate API documentation.

**Support:** OpenAPI, Swagger, Versioned documentation, Examples, Authentication documentation, Error documentation.

### Frontend Architecture
Organize frontend by domains.

`src/modules/`
`auth/`, `profile/`, `resume/`, `jobs/`, `career/`, `dashboard/`, `copilot/`, `crm/`, `salary/`, `interview/`, `notifications/`, `admin/`, `shared/`

Each module should contain:
Pages, Components, Hooks, Services, Types, Styles, Tests.

### Shared UI
Create reusable UI libraries.

`components/ui/`
`layout/`, `forms/`, `charts/`, `tables/`, `dialogs/`, `cards/`, `modals/`, `navigation/`, `notifications/`

Do not duplicate components.

### State Management
Separate Server State, UI State, Form State, Authentication State.
Avoid unnecessary global state.

### Testing
Every module should include:
Unit Tests, Integration Tests, API Tests, Service Tests, Repository Tests, Validation Tests.
Target high test coverage for business logic.

### Performance
Improve: Lazy loading, Dependency optimization, Database query organization, Module isolation, Cold start performance, Incremental loading.

### Security
Ensure: Input validation, Output sanitization, Secure defaults, Dependency isolation, Configuration protection, No secrets in source code.

### Documentation
Generate architecture documentation.

Include: Module responsibilities, Dependency graph, Folder structure, Event flow, Communication rules, Development guidelines, Contribution guidelines.

### Migration
Refactor incrementally.
Do not break existing features.

Preserve: Authentication, Resume Intelligence, Career Copilot, MCP, Workflow Engine, Memory Engine, RAG, CRM, ATS, Salary Intelligence, GitHub Intelligence, Gmail Intelligence, Calendar, Drive.

All existing APIs should continue functioning.

### Deliverables
At the end of this module the platform should have:
* ✓ Modular domain architecture
* ✓ Clean separation of concerns
* ✓ API Gateway layer
* ✓ Shared infrastructure
* ✓ Dependency injection
* ✓ Repository pattern
* ✓ DTO validation
* ✓ Internal event bus
* ✓ API versioning
* ✓ Structured logging
* ✓ Health monitoring
* ✓ Standardized error handling
* ✓ OpenAPI/Swagger documentation
* ✓ Feature-based frontend architecture
* ✓ Reusable UI library
* ✓ Production-ready code organization

### Important
This module is an architectural refactor, not a feature release.
Do not change user-facing functionality unless necessary.
Maintain backward compatibility.
Keep controllers thin.
Keep business logic inside services.
Design every module so it can become an independent microservice in the future with minimal effort.
The result should be a production-ready, enterprise-grade architecture that provides a solid foundation for Docker, Kubernetes, background workers, observability, scaling, and future cloud-native deployments.

---

## 🚀 Phase 8 — Module 2: Docker & Containerization

### Goal
Containerize the entire AI Job Finder platform using Docker and Docker Compose, creating a reproducible development and production environment.

The objective is to ensure the application can be started with a single command while keeping services isolated, configurable, and production-ready.

Do not change existing application features.
Focus entirely on infrastructure, reproducibility, portability, and deployment readiness.

### Objectives
**Containerize:**
* Frontend
* Backend API
* PostgreSQL
* Redis
* Vector Database (if used)
* Nginx Reverse Proxy
* Background Worker (future-ready)
* Scheduler (future-ready)

Everything should run consistently across Windows, macOS, and Linux.

### Architecture
Browser
↓
Nginx
↓
Frontend Container
↓
Backend Container
↓
Redis
↓
PostgreSQL
↓
Vector Database
↓
Persistent Volumes

### Docker Structure
Create a clean structure.

`docker/`
`development/`, `production/`, `nginx/`, `scripts/`, `healthchecks/`, `volumes/`, `compose/`

**Root:**
`Dockerfile.frontend`, `Dockerfile.backend`, `docker-compose.yml`, `docker-compose.dev.yml`, `docker-compose.prod.yml`, `.dockerignore`, `.env.example`

### Backend Container
**Requirements:**
* Multi-stage build
* Production image optimization
* Non-root user
* Health checks
* Environment configuration
* Build caching
* Minimal image size

Expose only required ports.

### Frontend Container
**Requirements:**
* Multi-stage build
* Optimized production build
* Static asset serving
* Environment variables
* Health endpoint
* Minimal runtime image

Support development and production builds.

### PostgreSQL
**Configure:**
* Persistent volumes
* Automatic initialization
* Backup-ready structure
* Health checks
* Secure credentials
* Environment configuration

### Redis
**Configure:**
* Persistent storage (optional)
* Password protection
* Health checks
* Memory limits
* Future queue support

### Vector Database
If using a vector database (Qdrant, Weaviate, Milvus, etc.):

**Configure:**
* Persistent storage
* Health checks
* Automatic startup
* Environment variables

Skip gracefully if not currently implemented.

### Nginx Reverse Proxy
**Configure:**
Reverse Proxy, Compression, Caching Headers, Security Headers, HTTPS-ready configuration, Static Asset Delivery, API Proxy, Health Endpoints, WebSocket Support, Rate Limiting Hooks.

### Docker Compose
**Development Compose**
Include: Frontend, Backend, PostgreSQL, Redis, Vector Database, Volumes, Networks, Development mounts, Hot reload.

**Production Compose**
Include: Optimized images, No bind mounts, Restart policies, Health checks, Separate networks, Production environment variables.

### Networks
Create isolated networks.
Frontend Network, Backend Network, Database Network, Internal Services.
Containers should communicate only where necessary.

### Volumes
Persistent volumes for: Database, Redis, Uploads, Documents, Logs, Model Cache (future), Embeddings (future).

### Environment Variables
Separate Development, Testing, Production.
Validate required variables at startup.
Do not commit secrets.
Provide a complete `.env.example`.

### Health Checks
Implement health checks for: Frontend, Backend, Database, Redis, Vector Database, Nginx.
Docker should automatically identify unhealthy services.

### Logging
Configure: Structured logs, Container logs, Log rotation, Error logs, Access logs, Application logs.

### Startup Scripts
Create scripts for: Development startup, Production startup, Database initialization, Database migration, Container cleanup, Environment validation.

### Resource Limits
Configure: CPU limits, Memory limits, Restart policies, Graceful shutdown, Container dependencies.

### Development Experience
Support: Hot reload, Live code synchronization, Fast rebuilds, Automatic dependency installation, Simple startup.

**Example:**
`docker compose up`
The application should become fully operational.

### Security
Use: Non-root containers, Minimal base images, No embedded secrets, Read-only filesystems where possible, Secure networking, Image vulnerability awareness.

### Documentation
Document: Docker architecture, Folder structure, Environment setup, Container overview, Networking, Volumes, Common commands, Troubleshooting, Development workflow, Production deployment.

### Deliverables
At the end of this module, the platform should provide:
* ✓ Dockerized frontend
* ✓ Dockerized backend
* ✓ PostgreSQL container
* ✓ Redis container
* ✓ Vector database container (if applicable)
* ✓ Nginx reverse proxy
* ✓ Development Compose
* ✓ Production Compose
* ✓ Persistent volumes
* ✓ Health checks
* ✓ Secure networking
* ✓ Environment management
* ✓ Optimized images
* ✓ Startup scripts
* ✓ Comprehensive Docker documentation

### Testing
**Verify:**
* ✓ Containers build successfully
* ✓ Containers communicate correctly
* ✓ Database persistence
* ✓ Redis connectivity
* ✓ Frontend accessibility
* ✓ Backend API functionality
* ✓ Health endpoints
* ✓ Environment variable loading
* ✓ Restart behavior
* ✓ Volume persistence
* ✓ Production build
* ✓ Development hot reload
* ✓ Cross-platform compatibility

Resolve all issues before considering this module complete.

### Important
Do not introduce new application features.
Do not modify business logic.
Maintain full compatibility with existing APIs and frontend functionality.
Optimize for reproducibility, scalability, and future Kubernetes deployment.
The final result should allow any developer to clone the repository, configure the environment, run a single Docker Compose command, and have the complete AI Job Finder platform running consistently with minimal setup.

---

## 🚀 Phase 8 — Module 3: Kubernetes, Helm & Cloud-Native Deployment

### Goal
Prepare AI Job Finder for enterprise-grade cloud deployment using Kubernetes.

Build a complete Kubernetes deployment architecture that supports high availability, horizontal scaling, rolling updates, self-healing, and secure configuration management.

This module should build on the existing Docker infrastructure without modifying application business logic.
The platform must remain deployable locally with Docker Compose while gaining the ability to run on Kubernetes clusters in development, staging, and production.

### Objectives
**Deploy the following services on Kubernetes:**
* Frontend
* Backend API
* PostgreSQL
* Redis
* Vector Database (if applicable)
* Background Worker
* Scheduler
* Nginx / Ingress Controller

Support future AI services without major architectural changes.

### Architecture
Internet
↓
Ingress Controller
↓
Frontend Service
↓
Backend API Service
↓
Internal Services
↓
Redis
↓
PostgreSQL
↓
Vector Database
↓
Persistent Volumes

### Kubernetes Structure
Create a dedicated deployment structure.

`k8s/`
`base/`, `development/`, `staging/`, `production/`, `helm/`, `charts/`, `templates/`, `config/`, `scripts/`

**Root:**
`README.md`, `deploy.sh`, `destroy.sh`, `health-check.sh`

### Kubernetes Resources
**Create manifests for:**
Deployments, Services, Ingress, Namespaces, ConfigMaps, Secrets, PersistentVolumeClaims, Network Policies, HorizontalPodAutoscalers, PodDisruptionBudgets, ResourceQuotas, LimitRanges, ServiceAccounts, RoleBindings, ClusterRoles (only where required).

### Namespaces
Separate environments: Development, Staging, Production, Internal Services, Monitoring (future).

### Helm Charts
Create production-ready Helm charts.
Support: Reusable templates, Values files, Environment overrides, Versioning, Dependency management, Upgrade strategy, Rollback support.

### Configuration Management
Move configuration into Kubernetes.
Use: ConfigMaps, Secrets, Environment variables, Volume mounts.
Never store secrets inside manifests.

### Secrets
Prepare secure handling for: Database credentials, JWT secrets, OAuth credentials, API keys, Redis password, Encryption keys, External provider tokens.
Support future integration with external secret managers.

### Persistent Storage
Configure persistent storage for: PostgreSQL, Redis (if persistence enabled), Uploads, Career Documents, Vector Database, Logs (optional).
Ensure data survives pod restarts.

### Networking
Configure: ClusterIP Services, Ingress, Internal service communication, DNS resolution, Network policies, TLS-ready routing, WebSocket compatibility.

### Scaling
Support automatic scaling: Frontend, Backend, Workers, Future AI Agents.
Configure Horizontal Pod Autoscaler using CPU and memory metrics.

### High Availability
Implement: Multiple replicas, Rolling deployments, Rolling rollback, Readiness probes, Liveness probes, Startup probes, Graceful termination, Self-healing pods.

### Resource Management
Configure: CPU requests, CPU limits, Memory requests, Memory limits, Pod scheduling, Node affinity (future-ready), Taints and tolerations (future-ready).

### Deployment Strategy
Support: Rolling Update, Blue/Green readiness, Canary-ready architecture, Zero-downtime deployments, Fast rollback.

### Health Monitoring
Expose health endpoints for: Frontend, Backend, Database, Redis, Workers, Vector Database, Ingress.
Ensure Kubernetes automatically replaces unhealthy pods.

### Logging
Configure centralized logging compatibility.
Prepare for: ELK Stack, Grafana Loki, OpenSearch, Cloud-native logging providers.
Do not implement log aggregation yet.

### Metrics
Expose Prometheus-compatible metrics for: API, Workers, Queues, Redis, Database, AI Services, MCP Providers, System Health.
Prepare for future monitoring dashboards.

### Security
Implement: RBAC, Pod Security Context, Read-only root filesystem where possible, Non-root containers, Image pull policies, Network isolation, Secret mounting, Least privilege access.

### CI/CD Compatibility
Prepare Kubernetes deployment for: GitHub Actions, GitLab CI, Azure DevOps, Jenkins, ArgoCD, FluxCD.
Do not implement pipelines yet.

### Local Development
Support local Kubernetes development using: Minikube, Kind, Docker Desktop Kubernetes.
Developers should be able to deploy locally with minimal configuration.

### Documentation
Document: Cluster architecture, Folder structure, Deployment process, Helm usage, Scaling strategy, Ingress configuration, Secrets management, Troubleshooting, Upgrade process, Rollback process.

### Deliverables
At the end of this module, the platform should include:
* ✓ Kubernetes manifests
* ✓ Helm charts
* ✓ Multi-environment configuration
* ✓ Ingress configuration
* ✓ Persistent storage
* ✓ Horizontal Pod Autoscaling
* ✓ Rolling updates
* ✓ Readiness/Liveness probes
* ✓ Secure secret management
* ✓ Resource limits
* ✓ Namespace isolation
* ✓ Local Kubernetes support
* ✓ Production deployment documentation

### Testing
**Verify:**
* ✓ All manifests validate successfully
* ✓ Helm charts install correctly
* ✓ Pods become healthy
* ✓ Services communicate properly
* ✓ Ingress routes traffic correctly
* ✓ Persistent storage survives restarts
* ✓ Autoscaling triggers correctly
* ✓ Rolling updates complete without downtime
* ✓ Rollback works successfully
* ✓ Secrets load correctly
* ✓ Local cluster deployment succeeds
* ✓ Production configuration passes validation

Resolve all deployment issues before considering this module complete.

### Important
Do not modify application functionality.
Do not introduce business logic changes.
Maintain compatibility with Docker Compose development.
Focus entirely on cloud-native infrastructure and deployment readiness.
The final result should allow AI Job Finder to be deployed to any Kubernetes cluster using Helm with a repeatable, scalable, secure, and production-ready deployment process that forms the foundation for future observability, background processing, and enterprise operations.

---

## 🚀 Phase 8 — Module 4: Background Jobs, Task Queue & Workflow Processing

### Goal
Build a production-grade asynchronous processing platform for AI Job Finder.

Transform all long-running operations into distributed background jobs executed by scalable workers, ensuring fast API responses, high throughput, fault tolerance, and reliable workflow execution.

This module should establish the foundation for autonomous AI workflows, scheduled tasks, event-driven processing, and distributed job execution.
Do not modify existing business logic.
Instead, refactor long-running operations to execute through the background processing system.

### Objectives
Create a distributed task processing architecture supporting:
* AI Processing
* Resume Intelligence
* OCR
* RAG Indexing
* Embedding Generation
* GitHub Analysis
* Gmail Synchronization
* Calendar Synchronization
* Google Drive Analysis
* ATS Synchronization
* Notification Processing
* Career Copilot Planning
* Scheduled Maintenance
* Analytics Processing

### Architecture
Client
↓
API
↓
Job Dispatcher
↓
Queue
↓
Background Workers
↓
Business Services
↓
Database
↓
Memory Engine
↓
Notifications

### Queue Infrastructure
Use Redis as the queue backend.
Support: Job Queues, Priority Queues, Delayed Jobs, Scheduled Jobs, Retry Queues, Dead Letter Queue, Worker Pools, Job Timeouts, Job Cancellation, Job Chaining, Future compatibility with RabbitMQ or Kafka.

### Folder Structure
`server/`, `workers/`, `dispatcher/`, `queues/`, `processors/`, `jobs/`, `scheduler/`, `events/`, `retry/`, `dead-letter/`, `monitoring/`, `services/`

### Worker Types
Create dedicated workers: Resume Worker, OCR Worker, AI Analysis Worker, Embedding Worker, GitHub Worker, Gmail Worker, Calendar Worker, Drive Worker, ATS Worker, Notification Worker, Analytics Worker, Career Copilot Worker, Cleanup Worker.
Each worker should process only its assigned responsibility.

### Job Categories
Support: Immediate Jobs, Delayed Jobs, Scheduled Jobs, Recurring Jobs, Batch Jobs, Workflow Jobs, Event Jobs, Maintenance Jobs, Priority Jobs.

### Workflow Engine
Support job orchestration.
Example:
Resume Uploaded -> OCR -> Resume Parsing -> AI Analysis -> Embedding Generation -> RAG Indexing -> Career Profile Update -> Recommendation Generation -> Notification
Each step should execute independently.

### Retry System
Support configurable retries.
Retry on: Temporary API failures, Rate limiting, Network failures, Timeouts, External service failures.
Use exponential backoff. Avoid infinite retries.

### Dead Letter Queue
Failed jobs should move automatically into a Dead Letter Queue after retry exhaustion.
Allow: Inspection, Manual retry, Permanent deletion, Failure analytics.

### Scheduler
Create a scheduler for recurring jobs.
Examples: Daily email synchronization, Calendar synchronization, ATS synchronization, Career Health recalculation, Resume freshness checks, Job market updates, Database cleanup, Analytics aggregation.
Configurable scheduling intervals.

### Priority Processing
Support priorities: Critical, High, Normal, Low, Background. Critical jobs should execute first.

### Job Monitoring
Track: Status, Progress, Execution time, Retries, Worker, Queue, Errors, Logs, Result, Start time, Completion time.

### Queue Dashboard
Create a Queue Management page.
Display: Running Jobs, Queued Jobs, Completed Jobs, Failed Jobs, Retry Queue, Dead Letter Queue, Worker Status, Queue Statistics, Job Timeline.
Dark mode. Responsive layout.

### APIs
* `GET /api/jobs`
* `GET /api/jobs/{id}`
* `POST /api/jobs/retry`
* `POST /api/jobs/cancel`
* `GET /api/jobs/statistics`
* `GET /api/workers`
* `GET /api/queues`

Return: Queue health, Worker health, Processing rate, Average execution time, Queue length, Failure rate, Retry rate.

### Event Integration
Every completed job should emit events.
Examples: ResumeAnalyzed, EmbeddingGenerated, EmailSynced, ATSUpdated, CareerHealthUpdated, RecommendationCreated.
Events should trigger downstream processing automatically.

### Logging
Every job should log: Job ID, Worker, Execution time, Input metadata, Output metadata, Retry count, Error details, Correlation ID, User ID.

### Notifications
Notify users only when meaningful.
Examples: Resume analysis completed, Interview preparation finished, ATS synchronized, GitHub portfolio updated, Career review generated.
Never notify for internal background maintenance.

### Performance
Support: Parallel workers, Queue partitioning, Worker scaling, Batch processing, Streaming progress updates, Worker concurrency configuration.

### Security
Ensure: Job authorization, User isolation, Secure payload serialization, Sensitive data masking, Audit logs, Safe retry behavior.

### Observability
Expose metrics for: Jobs processed, Jobs failed, Average duration, Queue latency, Worker utilization, Retries, Dead Letter Queue size, Queue throughput.
Prepare for Prometheus integration.

### Documentation
Document: Queue architecture, Worker lifecycle, Job lifecycle, Retry strategy, Scheduler, Failure handling, Development workflow, Deployment considerations.

### Deliverables
At the end of this module the platform should provide:
* ✓ Distributed background workers
* ✓ Queue infrastructure
* ✓ Job dispatcher
* ✓ Worker pools
* ✓ Retry system
* ✓ Dead Letter Queue
* ✓ Scheduler
* ✓ Workflow processing
* ✓ Queue dashboard
* ✓ Job APIs
* ✓ Worker monitoring
* ✓ Event-driven processing
* ✓ Production-ready queue architecture

### Testing
**Verify:**
* ✓ Job creation
* ✓ Queue processing
* ✓ Worker execution
* ✓ Retry logic
* ✓ Dead Letter Queue
* ✓ Scheduler
* ✓ Event triggering
* ✓ Parallel processing
* ✓ Job cancellation
* ✓ Queue dashboard
* ✓ Metrics collection
* ✓ High-concurrency scenarios
* ✓ Failure recovery

Resolve all issues before considering this module complete.

### Important
Do not introduce new user-facing features.
Preserve all existing AI capabilities.
Refactor long-running operations to execute asynchronously.
Ensure every background process is modular, observable, fault-tolerant, and independently scalable.
The final result should provide a robust asynchronous execution platform capable of supporting AI Job Finder's autonomous agents, MCP integrations, document intelligence, and future enterprise-scale workloads.

---

## 🚀 Phase 8 — Module 5: Enterprise Caching Layer & Performance Optimization

### Goal
Build a production-grade distributed caching platform for AI Job Finder that significantly improves response times, reduces database load, minimizes external API calls, lowers AI inference costs, and supports high-concurrency workloads.

The caching layer should be transparent to business logic and reusable across all modules.
Do not modify existing features.
Instead, introduce intelligent caching throughout the platform.

### Objectives
Implement a centralized caching platform supporting:
* API Responses
* Database Queries
* AI Responses
* Vector Search Results
* Embeddings
* Resume Intelligence
* Company Intelligence
* GitHub Intelligence
* Gmail Intelligence
* Calendar Intelligence
* ATS Synchronization
* Google Drive Metadata
* Career Copilot Planning
* User Sessions
* Feature Flags

### Architecture
Client
↓
API Gateway
↓
Cache Layer
↓
Business Services
↓
Database
↓
Redis
↓
Vector Database
↓
External APIs
↓
LLMs

### Folder Structure
`server/`, `cache/`, `providers/`, `strategies/`, `policies/`, `keys/`, `middleware/`, `metrics/`, `warmup/`, `invalidations/`, `decorators/`, `services/`

### Cache Provider
Use Redis as the primary cache.
Support future providers: Redis Cluster, Valkey, Memcached, Cloud-managed Redis.
Provider abstraction should allow future replacement without affecting business logic.

### Cache Categories
Implement dedicated cache regions: Authentication Cache, Session Cache, Profile Cache, Resume Cache, Job Cache, Company Cache, GitHub Cache, Email Cache, Calendar Cache, ATS Cache, Drive Cache, Vector Cache, Embedding Cache, Recommendation Cache, Analytics Cache, Configuration Cache, Feature Flag Cache.

### Cache Strategies
Support multiple strategies: Cache Aside, Read Through, Write Through, Write Behind, Refresh Ahead.
Choose the appropriate strategy for each module.

### Cache Keys
Adopt standardized naming.
Examples: `user:{id}`, `resume:{id}`, `company:{id}`, `job:{id}`, `application:{id}`, `embedding:{id}`, `github:{username}`, `email:{threadId}`, `calendar:{eventId}`, `recommendation:{userId}`.
Maintain a documented key convention.

### Time-To-Live (TTL)
Configure TTL policies.
Examples: Authentication: Short, Profile: Medium, Company Data: Long, Embeddings: Long, GitHub Analysis: Medium, AI Responses: Configurable, Calendar Events: Medium, Job Listings: Short.
Support configurable TTL values.

### Intelligent Cache Invalidation
Automatically invalidate when: Resume changes, Profile updates, Application status changes, Company data refreshes, GitHub sync completes, Email synchronization finishes, Calendar updates, AI recommendations regenerate.
Never rely solely on expiration.

### Cache Warming
Implement proactive cache warming.
Examples: User dashboard, Career Health Score, Top recommendations, Resume metadata, Frequently accessed companies, Recent applications, Upcoming interviews, Recently viewed jobs.
Run during startup and scheduled intervals.

### Distributed Session Cache
Store: Authentication sessions, OAuth state, Refresh tokens (where appropriate), User preferences, Temporary workflow state.
Support multi-instance deployments.

### AI Response Cache
Cache: LLM responses, Prompt templates, Prompt embeddings, Model metadata, Reasoning outputs (where deterministic).
Prevent repeated AI calls for identical requests when appropriate.

### Vector Cache
Cache: Embedding lookups, Semantic search results, Similarity calculations, Nearest-neighbor queries, Knowledge retrieval metadata.
Reduce vector database load.

### API Response Cache
Support: GET response caching, Conditional requests, ETag support, Cache-Control headers, Compression compatibility, Selective endpoint caching.

### Performance Middleware
Implement middleware for: Cache lookup, Cache population, Timing metrics, Hit/miss tracking, Compression, Request optimization, Graceful fallback.

### Metrics
Track: Cache hits, Cache misses, Hit ratio, Memory usage, Evictions, Latency reduction, Saved database queries, Saved API requests, Saved AI requests, Cache warm-up success.
Expose Prometheus-compatible metrics.

### Dashboard
Create a Cache Monitoring page.
Include: Hit Ratio, Miss Ratio, Redis Health, Memory Usage, Hot Keys, Evictions, Cache Regions, TTL Distribution, Performance Gains.
Dark mode. Responsive design.

### APIs
* `GET /api/cache/statistics`
* `GET /api/cache/health`
* `POST /api/cache/invalidate`
* `POST /api/cache/warmup`
* `GET /api/cache/keys`
* `DELETE /api/cache/flush`

Restrict administrative operations to authorized users.

### Performance Targets
Aim for: 90%+ cache hit rate on frequently accessed resources, Sub-100 ms cached API responses, Significant reduction in external API usage, Reduced LLM inference requests, Lower database query volume.
Support high-concurrency workloads without degradation.

### Security
Ensure: Encrypted Redis connections (where applicable), Role-based cache administration, Sensitive data exclusion, Secure serialization, Audit cache operations, Safe key naming.
Never cache secrets or confidential credentials.

### Documentation
Document: Caching architecture, Key naming conventions, TTL policies, Invalidation rules, Warm-up process, Performance metrics, Administration, Troubleshooting, Developer guidelines.

### Deliverables
At the end of this module the platform should provide:
* ✓ Centralized cache service
* ✓ Redis integration
* ✓ Multiple caching strategies
* ✓ Intelligent cache invalidation
* ✓ Cache warming
* ✓ Session caching
* ✓ AI response caching
* ✓ Vector search caching
* ✓ API response caching
* ✓ Monitoring dashboard
* ✓ Performance metrics
* ✓ Comprehensive documentation

### Testing
**Verify:**
* ✓ Cache hits and misses
* ✓ TTL expiration
* ✓ Invalidation rules
* ✓ Cache warming
* ✓ Redis failover behavior
* ✓ Session persistence
* ✓ API response caching
* ✓ AI response reuse
* ✓ Vector cache accuracy
* ✓ Dashboard metrics
* ✓ Concurrent access
* ✓ High-load performance
* ✓ Graceful degradation when Redis is unavailable

Resolve all issues before considering this module complete.

### Important
Do not introduce new user-facing functionality.
Maintain complete backward compatibility.
Ensure the caching layer remains transparent to existing services.
Optimize for scalability, low latency, and reduced infrastructure costs.
The final result should provide a high-performance distributed caching platform that enables AI Job Finder to deliver fast, reliable, and cost-efficient AI-powered experiences while supporting future enterprise-scale deployments.

---

## 🚀 Phase 8 — Module 6: Enterprise Observability, Monitoring & Diagnostics Platform

### Goal
Build a production-grade observability platform that provides complete visibility into AI Job Finder's infrastructure, services, AI agents, MCP providers, workflows, queues, APIs, databases, and user interactions.

The observability platform should enable developers and administrators to detect, diagnose, troubleshoot, and optimize the system in real time.
This module focuses on visibility and diagnostics only.
Do not modify existing business logic.

### Objectives
Implement a unified observability platform covering:
* Application Monitoring
* Infrastructure Monitoring
* AI Agent Monitoring
* MCP Provider Monitoring
* API Monitoring
* Queue Monitoring
* Database Monitoring
* Cache Monitoring
* Authentication Monitoring
* User Activity Monitoring
* Workflow Monitoring
* Security Monitoring

### Architecture
Application
↓
OpenTelemetry
↓
Metrics, Logs, Traces
↓
Observability Layer
↓
Grafana, Prometheus, Loki, Jaeger
↓
Admin Dashboard

### Folder Structure
`server/`, `observability/`, `metrics/`, `logging/`, `tracing/`, `alerts/`, `health/`, `diagnostics/`, `dashboards/`, `middleware/`, `collectors/`, `services/`, `exporters/`, `config/`

### Structured Logging
Replace all unstructured logging.
Every log should include: Timestamp, Request ID, Correlation ID, Trace ID, User ID (if authenticated), Module, Service, Worker, Agent, Provider, Execution Time, Log Level, Message, Metadata, Error Stack (when applicable).
Use structured JSON logs.

### Distributed Tracing
Implement end-to-end tracing.
Trace: Frontend Request -> API Gateway -> Backend Service -> Database -> Redis -> Background Worker -> LLM -> MCP Provider -> Response
Every request should have a unique trace.

### Metrics Collection
Collect metrics for: HTTP Requests, API Latency, Error Rate, Database Queries, Cache Hits, Cache Misses, Worker Throughput, Queue Size, AI Requests, Token Usage, LLM Latency, MCP Calls, Authentication Events, CPU, Memory, Disk, Network.

### AI Monitoring
Track: Agent execution time, Planning duration, Reasoning duration, Memory retrieval, RAG latency, Embedding generation, Resume analysis, Interview generation, Recommendation generation, Career Copilot execution, Success rate, Failure rate.

### MCP Monitoring
Track every provider: GitHub, Gmail, Google Calendar, Google Drive, ATS, Future providers.
Metrics: Availability, Latency, Rate limits, Authentication, Failures, Retries, Request volume, Health.

### Queue Monitoring
Display: Pending jobs, Running jobs, Failed jobs, Retry queue, Dead letter queue, Worker utilization, Queue throughput, Processing latency.

### Database Monitoring
Monitor: Connection pool, Slow queries, Query duration, Deadlocks, Locks, Index usage, Storage, Transactions, Replication readiness.

### Cache Monitoring
Track: Hit ratio, Miss ratio, Memory usage, Evictions, TTL expiration, Redis latency, Key distribution, Connection health.

### Health Center
Create a centralized system health page.
Display: Application, Database, Redis, Workers, MCP Providers, AI Services, Storage, API Gateway, Queues, Overall Platform Health Score.

### Alert System
Support configurable alerts.
Examples: High CPU, High Memory, Queue backlog, Worker failure, Database unavailable, Redis unavailable, MCP outage, Authentication failures, LLM timeout, High API latency, Excessive error rate.
Allow multiple severity levels.

### Diagnostics Center
Create a diagnostics dashboard.
Include: Live Logs, Live Metrics, Live Traces, Service Status, Dependency Graph, Incident Timeline, Worker Health, Provider Health, Recent Failures, System Events.
Dark mode. Responsive layout.

### OpenTelemetry
Instrument: API, Workers, Redis, Database, External APIs, MCP, AI Services, Background Jobs.
Expose standard OTLP endpoints.

### Prometheus Metrics
Expose: `/metrics`
Include: Application metrics, Business metrics, AI metrics, Infrastructure metrics, Queue metrics, Worker metrics, MCP metrics.

### Grafana Dashboards
Prepare dashboards for: System Overview, API Performance, AI Performance, Queue Health, MCP Health, Database, Redis, Authentication, User Activity, Career Copilot.

### Incident Tracking
Automatically record: Critical failures, Service outages, Provider failures, Queue failures, Worker crashes, Authentication incidents, Major API failures.
Generate incident reports.

### APIs
* `GET /api/observability/health`
* `GET /api/observability/metrics`
* `GET /api/observability/logs`
* `GET /api/observability/traces`
* `GET /api/observability/incidents`
* `GET /api/observability/dashboard`

Restrict access to administrators.

### Performance Goals
Target: Real-time metrics, Sub-second dashboard refresh, Low-overhead instrumentation, Minimal logging overhead, Efficient trace sampling, Scalable metric collection.

### Security
Restrict observability endpoints.
Mask sensitive data.
Never log: Passwords, Tokens, OAuth secrets, Private documents, Personally identifiable sensitive information.
Support audit logging for administrator access.

### Documentation
Document: Observability architecture, Logging standards, Trace propagation, Metrics, Alert configuration, Grafana dashboards, Prometheus integration, OpenTelemetry setup, Troubleshooting guide, Incident response workflow.

### Deliverables
At the end of this module the platform should provide:
* ✓ Structured logging
* ✓ Distributed tracing
* ✓ OpenTelemetry instrumentation
* ✓ Prometheus metrics
* ✓ Grafana-ready dashboards
* ✓ Centralized diagnostics
* ✓ AI monitoring
* ✓ MCP monitoring
* ✓ Queue monitoring
* ✓ Database monitoring
* ✓ Cache monitoring
* ✓ Alert framework
* ✓ Incident tracking
* ✓ Health center
* ✓ Comprehensive documentation

### Testing
**Verify:**
* ✓ Trace propagation
* ✓ Structured log generation
* ✓ Metrics collection
* ✓ Prometheus scraping
* ✓ Queue monitoring
* ✓ AI monitoring
* ✓ MCP monitoring
* ✓ Alert triggering
* ✓ Dashboard rendering
* ✓ Incident recording
* ✓ Performance overhead
* ✓ High-load monitoring
* ✓ Failure visibility

Resolve all observability issues before considering this module complete.

### Important
Do not introduce new end-user features.
Do not modify business logic.
Instrumentation should remain transparent to application functionality.
Ensure observability components are modular, extensible, and production-ready.
The final result should provide complete operational visibility into AI Job Finder, enabling rapid debugging, proactive monitoring, performance optimization, and enterprise-grade incident management while preparing the platform for large-scale cloud deployments.

---

## 🚀 Phase 8 — Module 7: Enterprise Security, Compliance & Governance

### Goal
Build a comprehensive enterprise-grade security and compliance framework for AI Job Finder.

Harden every layer of the platform including authentication, authorization, APIs, AI services, MCP providers, infrastructure, storage, and background workers.
This module focuses on security, governance, auditing, and compliance.
Do not introduce new business features.
The implementation should preserve backward compatibility while significantly improving platform security.

### Objectives
Secure: Frontend, Backend, APIs, Authentication, Authorization, AI Agents, MCP Providers, Databases, Redis, Background Workers, Docker, Kubernetes, External Integrations.

### Architecture
User -> Authentication -> Authorization -> API Gateway -> Business Services -> Security Layer -> Database -> Infrastructure -> Audit Logs -> Monitoring

### Folder Structure
`server/`, `security/`, `authentication/`, `authorization/`, `permissions/`, `audit/`, `encryption/`, `headers/`, `policies/`, `middleware/`, `secrets/`, `rate-limit/`, `validation/`, `compliance/`, `incident/`, `services/`

### Authentication Hardening
Enhance authentication with: JWT validation, Refresh token rotation, Session revocation, Device tracking, Session timeout, Login history, Brute-force protection, Password policy enforcement, Email verification validation, OAuth account validation, Account lockout after repeated failures.

### Authorization
Implement Role-Based Access Control (RBAC).
Support roles such as: Guest, User, Premium User, Moderator, Administrator, Super Administrator.
Support custom roles in the future.

### Fine-Grained Permissions
Support permissions such as: View Profile, Edit Profile, Delete Account, Manage Users, Manage Jobs, Manage AI Agents, Manage MCP Providers, View Analytics, Manage Billing, Manage System Settings, View Audit Logs.
Permission checks should occur at the API and service layers.

### API Security
Secure every endpoint.
Implement: Input validation, Output sanitization, Request size limits, Request timeout, Payload validation, API version validation, Content-Type validation, Secure error responses, Rate limiting hooks, Replay protection (where applicable).

### Security Headers
Configure: Content Security Policy (CSP), Strict-Transport-Security (HSTS), X-Frame-Options, X-Content-Type-Options, Referrer-Policy, Permissions-Policy, Cross-Origin policies.
Configure secure defaults.

### CSRF Protection
Protect all state-changing requests.
Support: CSRF tokens, SameSite cookies, Origin validation, Secure cookie attributes.

### CORS
Create environment-aware CORS configuration.
Support: Development, Staging, Production.
Allow only trusted origins.

### Secrets Management
Centralize management of: JWT secrets, OAuth credentials, Database credentials, Redis credentials, API keys, Encryption keys, MCP credentials.
Never expose secrets in source code or logs.
Prepare for integration with cloud secret managers.

### Encryption
Encrypt sensitive information.
**At Rest:** Sensitive database fields, Tokens, Stored credentials, OAuth refresh tokens.
**In Transit:** HTTPS-ready configuration, TLS support, Secure internal communication.

### Audit Logging
Record security events.
Examples: Login, Logout, Password Change, Email Change, Role Change, Permission Change, OAuth Connection, Account Deletion, MCP Connection, Failed Login, Unauthorized Access, Administrator Actions.
Audit logs must be immutable.

### Rate Limiting
Implement configurable limits.
Examples: Authentication, Password Reset, Email Verification, Resume Upload, AI Requests, MCP Requests, Public APIs.
Support per-user and per-IP policies.

### AI Security
Protect AI services.
Implement: Prompt validation, Prompt size limits, Output filtering hooks, Safe request handling, Agent authorization, Workflow authorization, Tool execution authorization.
Prevent unauthorized agent actions.

### MCP Security
Secure every provider.
Validate: OAuth tokens, Provider permissions, Scopes, Session expiration, Provider ownership, Connection health.
Support secure disconnect and credential revocation.

### File Security
Validate: File type, File size, Content type, Malware scan integration hooks, Secure storage paths, Randomized filenames, Access authorization.
Prepare for future antivirus integration.

### Compliance
Prepare architecture for: GDPR, CCPA, SOC 2, ISO 27001, Data retention policies, Consent management, Right to delete, Data export, Privacy controls.
Do not implement legal workflows beyond architectural readiness.

### Incident Response
Create a security incident framework.
Track: Unauthorized access, Privilege escalation, Repeated failures, Suspicious API usage, Compromised tokens, Credential abuse.
Generate incident records for administrators.

### Security Dashboard
Create an Admin Security Center.
Display: Login Activity, Active Sessions, Recent Incidents, Failed Logins, OAuth Connections, Connected Devices, Audit Logs, Permission Changes, Security Health Score.
Dark mode. Responsive layout.

### APIs
* `GET /api/security/health`
* `GET /api/security/sessions`
* `GET /api/security/audit`
* `GET /api/security/incidents`
* `POST /api/security/revoke-session`
* `POST /api/security/revoke-all`
* `POST /api/security/rotate-keys`

Restrict administrative endpoints appropriately.

### Performance
Security measures should: Minimize latency, Avoid unnecessary encryption overhead, Support horizontal scaling, Remain compatible with caching and background workers.

### Documentation
Document: Security architecture, Authentication flow, Authorization model, Permission system, Encryption strategy, Secrets management, Audit logging, Incident handling, Compliance readiness, Developer security guidelines.

### Deliverables
At the end of this module the platform should provide:
* ✓ Enterprise RBAC
* ✓ Fine-grained permissions
* ✓ Hardened authentication
* ✓ Secure API layer
* ✓ Security headers
* ✓ CSRF protection
* ✓ Environment-aware CORS
* ✓ Centralized secrets management
* ✓ Encryption at rest and in transit
* ✓ Immutable audit logs
* ✓ Rate limiting
* ✓ AI security controls
* ✓ MCP security
* ✓ Security dashboard
* ✓ Compliance-ready architecture
* ✓ Comprehensive documentation

### Testing
**Verify:**
* ✓ Authentication security
* ✓ Authorization rules
* ✓ Permission enforcement
* ✓ CSRF protection
* ✓ Security headers
* ✓ Rate limiting
* ✓ Audit logging
* ✓ Encryption
* ✓ OAuth security
* ✓ MCP authorization
* ✓ Session revocation
* ✓ Incident recording
* ✓ Security dashboard
* ✓ Penetration-style testing for common vulnerabilities

Resolve all identified security issues before considering this module complete.

### Important
Do not change application behavior for legitimate users.
Maintain backward compatibility wherever possible.
Apply the principle of least privilege throughout the platform.
Keep security concerns isolated within dedicated modules and middleware.
The final result should provide an enterprise-grade security foundation that protects AI Job Finder, its users, and its AI infrastructure while preparing the platform for production deployments, enterprise customers, and future compliance certifications.

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

## 🌟 Platform Highlights & Core AI Features

* Resume Intelligence & ATS Analysis
* Career Profile Intelligence & Job Intelligence
* Job Embeddings & Semantic Matching
* Recommendation Engine & Explainable AI
* Skill Gap Analysis & Learning Roadmaps
* Conversational Career RAG & Hybrid Retrieval
* Company Intelligence & Resume Optimization
* Multi-Agent System (Supervisor-Worker Architecture)
* Persistent Memory Engine (Semantic & Episodic)
* Cognitive Reasoning & Decision Engine
* Unified Tool Registry
* Autonomous Opportunity Monitoring (Intelligent Recruiter)
* **[NEW] Autonomous Career Copilot**
* **[NEW] MCP Integration Platform**
* **[NEW] Recruiter CRM & Networking Intelligence**
* **[NEW] Salary & Offer Intelligence**
* **[NEW] GitHub, Gmail, Google Calendar & Google Drive Intelligence**
* **[NEW] ATS Integration Pipeline**
* **[NEW] Cross-Provider Orchestration & Workflow Automation**
* **[NEW] Career Health Score & AI Decision Engine**

---

## 🚀 Roadmap

### ✅ Completed
* Phase 1 — Authentication & User Management
* Phase 2 — Career Profile & Resume Intelligence
* Phase 3 — Job Intelligence
* Phase 4 — AI Intelligence Layer
* Phase 5 — RAG Intelligence Layer
* Phase 6 — AI Career Agent Platform
* Phase 7 — MCP Integration & Autonomous Career Intelligence

### 🚧 Coming Next
* Phase 8 — Module 1: Enterprise Architecture & Microservices
* Phase 8 — Module 2: Docker & Containerization
* Phase 8 — Module 3: Kubernetes, Helm & Cloud-Native Deployment
* Phase 8 — Module 4: Background Jobs, Task Queue & Workflow Processing
* Phase 8 — Module 5: Enterprise Caching Layer & Performance Optimization
* Phase 8 — Module 6: Enterprise Observability, Monitoring & Diagnostics Platform
* Phase 8 — Module 7: Enterprise Security, Compliance & Governance
* Phase 9 — Advanced Agentic Integrations

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