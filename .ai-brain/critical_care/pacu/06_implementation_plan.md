# 06_implementation_plan.md - PACU Implementation Roadmap
**Expert: DevOps Lead**

## 1. Phase 1: Database
- Migration: `e86_pacu_up.sql`.
- Tables: `pacu_records`, `pacu_vitals`, `pacu_alerte_scores`.
- Reverse: `e86_pacu_down.sql` (non-destructive, keeps historical data).

## 2. Phase 2: Backend
- Extend `pacu_engine.js` and integrate with OR schedule and ward handoff.
- Implement `ai_pacu_orchestrator.js` (discharge readiness + PONV risk).
- Add routes to `server.js` with `requireRole('pacu_nurse')` / `requireRole('anesthesiologist')` and `requireTenantScope`.

## 3. Phase 3: Frontend
- Build `pacu-station.js` using Stitch components.
- Integrate into `app.js` `NAV_ITEMS` and `FACILITY_ALLOWED`.
- Add Aldrete panel, flowsheet, and discharge gate.

## 4. Phase 4: QA
- Unit tests for Aldrete calculation and discharge gate.
- Integration tests for OR → PACU → Ward flow.
- Security audit for Golden Access Rule and PHI vault access.
