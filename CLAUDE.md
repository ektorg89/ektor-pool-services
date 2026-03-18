# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

# CLAUDE.md — Ektor Pool Services

## About this project

Full-stack management application for a pool maintenance business.
Built from scratch as a portfolio project for internship applications.

**Author:** Ektor M. González
**University:** Universidad Interamericana de Puerto Rico
**Degree:** Technology & Networks · Minor in Computer Science
**Professional goal:** Land my first **DevOps** internship

> Important: I am learning. Do not give me code directly — guide me with explanations,
> tell me what to research, and help me understand the "why" behind each decision.

---

## Tech stack

### Backend (`/backend-v2`)
- **Framework:** FastAPI 0.109 (Python 3.11)
- **ORM:** SQLAlchemy 2.0
- **Database:** MySQL 8.0
- **Auth:** JWT with OAuth2 Bearer tokens, RBAC (admin / staff)
- **Testing:** pytest + coverage (~85%)
- **Docs:** OpenAPI / Swagger at `/docs`

### Frontend (`/frontend`)
- **Framework:** React 18 + Vite 5
- **Styling:** Tailwind CSS 3
- **Routing:** React Router 6
- **HTTP:** Axios with JWT interceptor
- **State:** React Context API

### DevOps (current state)
- **Containerization:** Docker + Docker Compose
- **Cloud:** AWS EC2 t3.micro (Free Tier) — paused
- **CI/CD:** Implemented — GitHub Actions with 3 jobs: backend tests, frontend build, EC2 deploy

---

## Essential commands

### Start the backend
```bash
cd backend-v2
docker compose up -d          # Start API + MySQL
docker compose logs -f api    # Watch live logs
docker compose down           # Stop
docker compose down -v        # Stop + delete volumes (DB reset)
```

### Run tests
```bash
docker compose exec api pytest -v                          # All tests
docker compose exec api pytest --cov=app --cov-report=term # With coverage
docker compose exec api pytest app/tests/test_healthy.py   # Single test
```

### Start the frontend
```bash
cd frontend
npm install
npm run dev     # http://localhost:5173
npm run build   # Production build
```

### Access the API
- Swagger UI: http://localhost:8000/docs
- Health check: http://localhost:8000/health
- Default credentials: `admin` / `admin123`

---

## Project structure

```
ektor-pool-services/
├── backend-v1/          # Original version (reference only, do not use)
├── backend-v2/          # Active backend
│   ├── app/
│   │   ├── api/v1/routers/   # Endpoints: auth, customers, properties, invoices, payments, reports, insights
│   │   ├── core/             # Auth, security, exceptions, logging
│   │   ├── db/               # SQLAlchemy session
│   │   ├── models/           # User, Customer, Property, Invoice, Payment
│   │   ├── schemas/          # Pydantic schemas (validation)
│   │   └── tests/            # pytest — ~85% coverage
│   ├── sql/init/             # 01_schema.sql, 02_seeds.sql
│   ├── docker-compose.yml
│   ├── Dockerfile
│   └── .env                  # Never commit — environment variables
├── frontend/
│   └── src/
│       ├── pages/            # Dashboard, Customers, Properties, Invoices
│       ├── components/       # Layout, ProtectedRoute, DeleteModal
│       ├── services/         # api.js, authService, customerService...
│       └── context/          # AuthContext (global JWT)
├── deployment/aws-ec2/       # Manual EC2 deploy guide
└── database/                 # Original schema documentation
```

---

## Data model

```
users ──────────────────────────────────────────────
  user_id, username, email, hashed_password, role(admin|staff), is_active

customers ──────────────────────────────────────────
  customer_id, first_name, last_name, phone, email

properties ─────────────────────────────────────────
  property_id, customer_id (FK), label, address1, city, state, postal_code

invoices ───────────────────────────────────────────
  invoice_id, customer_id (FK), property_id (FK)
  period_start, period_end, issued_date, due_date
  status: draft → sent → paid → void
  subtotal, tax, total

payments ───────────────────────────────────────────
  payment_id, invoice_id (FK), amount, paid_date, method, reference
```

---

## DevOps learning roadmap

These are the areas I want to master using this project as the foundation.
Ask me where I am before assuming my level.

### Already implemented
- Docker and Docker Compose
- REST API with FastAPI
- Testing with pytest
- Manual deploy on AWS EC2
- Git version control
- GitHub Actions CI/CD (3 jobs: tests, build, deploy) — `.github/workflows/ci.yml`
- **AI layer** — `/api/v1/insights/dashboard` endpoint (Hybrid approach):
  - Python queries MySQL and computes `BusinessMetrics`
  - `_generate_narrative()` calls Claude API (`claude-opus-4-6`) for the narrative
  - Requires `ANTHROPIC_API_KEY` in `backend-v2/.env`; gracefully degrades if missing
- MLOps scheduled job — `.github/workflows/mlops.yml` (rule-based, no LLM)

### Current focus
- Wiring the `/insights/dashboard` response into the React Dashboard page

### Still to learn (in order)
1. **Secrets management** — proper handling of ANTHROPIC_API_KEY, AWS secrets
2. **Automatic deploy** — CD to EC2 or Railway
3. **Basic monitoring** — Prometheus + Grafana
4. **Infrastructure as Code** — Terraform or AWS CDK
5. **Kubernetes basics** — pods, deployments (later)

---

## Important context for Claude

- The `.env` file in `backend-v2/` has real credentials — never commit it
- `backend-v1/` is the previous version, kept as historical reference
- The frontend stores JWT in `localStorage` — known security trade-off
- SQLAlchemy models mix `Column()` (User model) and `Mapped[]` (all others) — known technical debt
- `relationship()` is not yet explicit in SQLAlchemy models
- The EC2 deploy is paused while working on the AI layer
- AI approach chosen: **Hybrid (Option C)** — rule-based queries + Claude API for narrative
- `insights.py` uses `claude-opus-4-6` but a comment notes `claude-haiku-4-5` would be cheaper for high-frequency calls
- CI pipeline requires no secrets for backend tests; EC2 deploy requires `EC2_HOST`, `EC2_USER`, `EC2_SSH_KEY` GitHub secrets
- The `Dashboard.jsx` currently shows basic stats (customers, properties, pending invoices) — insights panel not yet wired in

---

## How I want you to help me

1. **Explain the concept first** before showing me code
2. **Tell me what to look up** or what documentation to read when relevant
3. **Ask me questions** so I reason through the solution myself
4. If I need to see code, show me **small fragments** with line-by-line explanation
5. **Point out errors or bad practices** you see in existing code — I want to learn from them