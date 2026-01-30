# Architecture Decisions

## Technology Choices

### Why FastAPI?
- Modern Python web framework
- Automatic API documentation
- Type hints support
- Async capabilities

### Why MySQL?
- ACID compliance for financial data
- Strong relational model support
- Wide industry adoption

### Why Docker?
- Consistent dev/prod environments
- Easy deployment
- Isolated dependencies

## Design Patterns

### Repository Pattern
SQLAlchemy ORM provides abstraction over database operations.

### Dependency Injection
FastAPI's dependency system for auth, DB sessions.

### Error Handling
Standardized error responses with request IDs for tracing.
