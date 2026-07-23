# 06_implementation_plan.md - Pulmonology Implementation Roadmap
**Expert: DevOps Lead**

## 1. Phase 1: Database
- Migration: `e56_pulmonology_extensions_up.sql`.
- Tables: `pulmonary_function_tests`, `sleep_study_results`, `bronchoscopy_reports`.

## 2. Phase 2: Backend
- Update `pulmonology_engine.js`.
- Implement `ai_pulmonology_orchestrator.js` (RAG for PFTs).
- Add routes to `server.js` with `requireRole`.

## 3. Phase 3: Frontend
- Build `pulmonology-station.js` using Stitch components.
- Integrate into `app.js` `FACILITY_ALLOWED`.

## 4. Phase 4: QA
- Unit tests for PFT ratio calculations.
- Security audit for the Golden Access Rule.
