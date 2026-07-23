# 06_implementation_plan.md - Emergency Department Implementation Roadmap
**Expert: DevOps Lead**

## 1. Phase 1: Database
- Migration: `e83_emergency_up.sql`.
- Tables: `er_visits`, `er_triage_logs`, `er_bed_assignments`, `er_treatments`, `er_dispositions`.
- Reverse: `e83_emergency_down.sql` (non-destructive, keeps historical data).

## 2. Phase 2: Backend
- Extend `er_engine.js` and integrate with ESI scoring + NEWS2.
- Implement `ai_er_orchestrator.js` (ESI adjuster + disposition predictor).
- Add routes to `server.js` with `requireRole('emergency_physician')` / `requireRole('er_nurse')` and `requireTenantScope`.

## 3. Phase 3: Frontend
- Build `er-station.js` using Stitch components.
- Integrate into `app.js` `NAV_ITEMS` and `FACILITY_ALLOWED`.
- Add triage queue, bed board, and disposition form.

## 4. Phase 4: QA
- Unit tests for ESI calculation and waiting-time alerts.
- Integration tests with ADT, OR, ICU, and billing.
- Security audit for Golden Access Rule and PHI vault access.
