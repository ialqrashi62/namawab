# 06_implementation_plan.md - Plastic & Burns Surgery Implementation Roadmap
**Expert: DevOps Lead**

## 1. Phase 1: Database
- Migration: `e76_plastic_burns_up.sql`.
- Tables: `plastic_burns_surgical_logs`, `burn_resuscitation_logs`, `flap_monitoring_metrics`, `aesthetic_sessions`.
- Reverse: `e76_plastic_burns_down.sql` (non-destructive).

## 2. Phase 2: Backend
- Extend `plastic_surgery_engine.js`.
- Implement `ai_plastic_orchestrator.js` (flap viability + symmetry analysis).
- Add routes to `server.js` with `requireRole('plastic_surgeon')` and `requireTenantScope`.

## 3. Phase 3: Frontend
- Build `plastic-surgery-station.js` using Stitch components.
- Integrate into `app.js` `NAV_ITEMS` and `FACILITY_ALLOWED`.
- Add TBSA selector, flap perfusion chart, and symmetry mapper.

## 4. Phase 4: QA
- Unit tests for Parkland fluid calculation.
- Integration tests for flap monitoring link.
- Security audit for aesthetic image encryption and PHI vault access.
