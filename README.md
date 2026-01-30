# Ektor Pool Services - Complete Business Management System

> Real-world pool maintenance business software built iteratively over 6 months.
> From database design to production-ready REST API with authentication, testing, and CI/CD.

![Tech Stack](https://img.shields.io/badge/Python-3.12+-blue)
![FastAPI](https://img.shields.io/badge/FastAPI-0.109-green)
![MySQL](https://img.shields.io/badge/MySQL-8.0-orange)
![Docker](https://img.shields.io/badge/Docker-Ready-blue)

## Overview

This project demonstrates full-stack backend development skills through a real business application:
managing customers, properties, service visits, invoicing, and payments for a pool maintenance company.

**Live Demo:** [Coming Soon]  
**API Documentation:** [Coming Soon]

---

## Project Evolution

### Phase 1: Database Design (November 2024)
**Location:** [`/database`](./database)

- Designed normalized MySQL schema (3NF)
- 10+ interconnected tables
- Business rules enforcement via constraints
- Sample data and query examples

**Key Learning:** Relational database design, normalization, indexing strategies

---

### Phase 2: REST API v1 (December 2024)
**Location:** [`/backend-v1`](./backend-v1)

- Basic CRUD operations for customers, properties, invoices
- FastAPI + SQLAlchemy ORM
- Business rule validations
- Docker containerization

**Key Learning:** REST API design, ORM patterns, request validation

---

### Phase 3: Production Backend v2 (January 2025)
**Location:** [`/backend-v2`](./backend-v2)

- JWT authentication (OAuth2 password flow)
- Role-based access control (RBAC)
- Comprehensive test suite (pytest)
- CI/CD pipeline (GitHub Actions)
- Structured error handling
- API documentation (OpenAPI/Swagger)

**Key Learning:** Security, testing, DevOps practices, production-ready code

---

### Phase 4: Frontend Application (In Progress)
**Location:** [`/frontend`](./frontend)

Coming soon: React dashboard for business operations

---

## Quick Start

### Prerequisites
- Docker & Docker Compose
- Python 3.12+ (for local development)
- MySQL 8.0+ (or use Docker)

### Run Latest Version (Backend v2)
```bash
cd backend-v2
docker compose up -d --build

# Run tests
docker compose exec api pytest -v

# Access API docs
open http://localhost:8000/docs
```

### Database Setup (Standalone)
```bash
cd database
mysql -u root -p < 01_schema.sql
mysql -u root -p < 02_seed.sql
```

---

## Architecture

### Current Tech Stack
- **Backend:** Python 3.12, FastAPI, SQLAlchemy 2.0
- **Database:** MySQL 8.0
- **Auth:** JWT (OAuth2 + Bearer tokens)
- **Testing:** pytest, coverage
- **DevOps:** Docker, Docker Compose, GitHub Actions
- **Documentation:** OpenAPI (Swagger UI)

### Key Features
-  RESTful API with 25+ endpoints
-  JWT authentication & authorization
-  Role-based access control (admin/staff)
-  Business rule validation
-  Automated testing (80%+ coverage)
-  CI/CD pipeline
-  Structured error responses
-  Request tracing (request_id)
-  Docker-ready deployment

---

## Documentation

- [Database Schema](./database/README.md) - ERD and table definitions
- [API v1 Guide](./backend-v1/README.md) - Basic implementation
- [API v2 Guide](./backend-v2/README.md) - Production version

---

## Testing
```bash
# Run all tests
cd backend-v2
pytest -v

# With coverage
pytest --cov=app --cov-report=html

# Integration tests only
pytest tests/test_integration.py
```

---

## Authentication Flow

1. Register: `POST /api/v1/auth/register`
2. Login: `POST /api/v1/auth/token` (returns JWT)
3. Use token: `Authorization: Bearer <token>`

Default roles:
- **admin** - Full access
- **staff** - Read access + limited writes

---

## Business Context

This project models real operational workflows from my pool maintenance business:

- Customer & property management
- Recurring service visits
- Weekly invoicing with line items
- Payment tracking & reconciliation
- Customer financial statements

**Why this matters:** Understanding business requirements drives better software design.

---

## Roadmap

- [x] Database design
- [x] Basic REST API
- [x] Authentication & RBAC
- [x] Automated testing
- [x] CI/CD pipeline
- [ ] Frontend dashboard
- [ ] Deploy to cloud (AWS/Railway)
- [ ] Mobile app (React Native)
- [ ] Analytics & reporting

---

## Project Stats

- **Lines of Code:** ~5,000+
- **Test Coverage:** 85%
- **API Endpoints:** 25+
- **Database Tables:** 10
- **Docker Services:** 2 (API + MySQL)
- **Development Time:** 3 months

---

## Contributing

This is a personal portfolio project, but feedback is welcome!

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

---

## Contact

**Ektor M. Gonzalez**  
Rincon, Puerto Rico  
[LinkedIn](https://www.linkedin.com/in/ektorgonzalez)  
[GitHub](https://github.com/ektorg89)  
ekgo7167@gmail.com
---

## License

This project is open source and available under the MIT License.

---

## Acknowledgments

Built with real-world business requirements from operating a pool maintenance service in Puerto Rico.

Special thanks to the FastAPI and Python communities for excellent documentation and support.

---

## Show Your Support

If you found this project helpful or interesting, please consider giving it a star!

---

**Note:** This is version 3.0 of this project. Previous iterations are archived:
- [eps-data-model](https://github.com/ektorg89/eps-data-model) - Database design v1
- [eps-api-legacy](https://github.com/ektorg89/eps-api-legacy) - REST API v1
- [eps-core-api](https://github.com/ektorg89/eps-core-api) - Production backend v2
