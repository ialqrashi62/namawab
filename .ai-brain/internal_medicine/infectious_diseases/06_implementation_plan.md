# 06_implementation_plan.md - Infectious Diseases Implementation Roadmap
**Expert: DevOps Lead**

## 1. Phase 1: Database
- Migration: `e68_infectious_extensions_up.sql`.
- Tables: `culture_results`, `asp_reviews`.

## 2. Phase 2: Backend
- Update `infectious_disease_engine.js`.
- Implement `ai_infectious_orchestrator.js`.
- Add routes to `server.js` with `requireRole`.

## 3. Phase 3: Frontend
- Build `infectious-station.js` using Stitch components.
- Integrate into `app.js` `FACILITY_ALLOWED`.
