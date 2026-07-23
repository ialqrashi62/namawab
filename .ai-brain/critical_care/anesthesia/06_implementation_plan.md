# 06_implementation_plan.md - Anesthesia Implementation Roadmap
**Expert: DevOps Lead**

## 1. Phase 1: Database
- Migration: `e85_anesthesia_up.sql`.
- Tables: `anesthesia_records`, `anesthesia_drug_logs`, `airway_assessments`, `asa_assessments`.
- Reverse: `e85_anesthesia_down.sql` (non-destructive, keeps historical data).

## 2. Phase 2: Backend
- Extend `anesthesia_engine.js` and integrate with OR schedule and PACU handoff.
- Implement `ai_anesthesia_orchestrator.js` (airway risk + drug interaction).
- Add routes to `server.js` with `requireRole('anesthesiologist')` and `requireTenantScope`.

## 3. Phase 3: Frontend
- Build `anesthesia-station.js` using Stitch components.
- Integrate into `app.js` `NAV_ITEMS` and `FACILITY_ALLOWED`.
- Add timeline, ASA picker, Mallampati selector, and PACU handoff card.

## 4. Phase 4: QA
- Unit tests for ASA validation and drug dose alerts.
- Integration tests for OR → PACU handoff.
- Security audit for Golden Access Rule and PHI vault access.
