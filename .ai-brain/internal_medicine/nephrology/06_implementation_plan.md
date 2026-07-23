# 06_implementation_plan.md - Nephrology Implementation Roadmap
**Expert: DevOps Lead**

## 1. Phase 1: Database
- Migration: `e60_nephrology_extensions_up.sql`.
- Tables: `dialysis_sessions`, `renal_transplant_records`, `nephrology_labs`.

## 2. Phase 2: Backend
- Update `nephrology_engine.js`.
- Implement `ai_nephrology_orchestrator.js` (RAG for Biopsies).
- Add routes to `server.js` with `requireRole`.

## 3. Phase 3: Frontend
- Build `nephrology-station.js` using Stitch components.
- Integrate into `app.js` `FACILITY_ALLOWED`.

## 4. Phase 4: QA
- Unit tests for GFR (CKD-EPI) calculations.
- Security audit for the Golden Access Rule.
