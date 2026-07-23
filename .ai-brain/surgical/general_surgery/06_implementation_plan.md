# 06_implementation_plan.md - General Surgery Implementation Roadmap
**Expert: DevOps Lead**

## 1. Phase 1: Database
- Migration: `e66_general_surgery_up.sql`.
- Tables: `surgery_sessions`, `surgical_checklists`, `surgical_outcomes`.

## 2. Phase 2: Backend
- Update `surgery_engine.js`.
- Implement `ai_surgery_orchestrator.js` (Post-op prediction).
- Add routes to `server.js` with `requireRole`.

## 3. Phase 3: Frontend
- Build `surgery-station.js` using Stitch components.
- Integrate into `app.js` `FACILITY_ALLOWED`.

## 4. Phase 4: QA
- Unit tests for surgical time calculations.
- Security audit for the Golden Access Rule.
