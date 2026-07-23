# 06_implementation_plan.md - Cardiothoracic Implementation Roadmap
**Expert: DevOps Lead**

## 1. Phase 1: Database
- Migration: `e72_cardiothoracic_up.sql`.
- Tables: `cardio_surgery_sessions`, `cardio_thoracic_metrics`, `vascular_graft_registry`.
- Reverse: `e72_cardiothoracic_down.sql` (non-destructive).

## 2. Phase 2: Backend
- Extend `cardio_thoracic_engine.js`.
- Implement `ai_cardio_orchestrator.js` (ischemia-reperfusion risk).
- Add routes to `server.js` with `requireRole('cardio_thoracic_surgeon')` and `requireTenantScope`.

## 3. Phase 3: Frontend
- Build `cardiothoracic-station.js` using Stitch components.
- Integrate into `app.js` `NAV_ITEMS` and `FACILITY_ALLOWED`.
- Add bypass timer and hemodynamic waveform widgets.

## 4. Phase 4: QA
- Unit tests for cross-clamp alert at 60 minutes.
- Integration tests for graft registry link.
- Security audit for Golden Access Rule and PHI vault access.
