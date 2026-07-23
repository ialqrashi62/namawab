# 06_implementation_plan.md - Dermatology Implementation Roadmap
**Expert: DevOps Lead**

## 1. Phase 1: Database
- Migration: `e69_derm_extensions_up.sql`.
- Tables: `derm_lesion_records`, `derm_cosmetic_logs`.

## 2. Phase 2: Backend
- Update `dermatology_engine.js`.
- Implement `ai_derm_orchestrator.js` (Image RAG).
- Add routes to `server.js` with `requireRole`.

## 3. Phase 3: Frontend
- Build `derm-station.js` using Stitch components.
- Integrate into `app.js` `FACILITY_ALLOWED`.
