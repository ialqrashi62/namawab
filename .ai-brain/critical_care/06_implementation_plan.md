# 06_implementation_plan.md - Critical Care Implementation Roadmap
**Expert: DevOps Lead**

## 1. Phase 1: Database
- Migration: `e80_critical_care_up.sql`.
- Tables: `er_triage_logs`, `icu_vital_streams`, `anesthesia_records`.

## 2. Phase 2: Backend
- Update `icu_scoring.js` and `ews_engine.js`.
- Implement `ai_critical_orchestrator.js` (Real-time Deterioration RAG).
- Add routes to `server.js` with `requireRole`.

## 3. Phase 3: Frontend
- Build `critical-station.js` using Stitch components.
- Integrate into `app.js` `FACILITY_ALLOWED`.

## 4. Phase 4: QA
- Unit tests for ESI triage logic.
- Security audit for the Golden Access Rule.
