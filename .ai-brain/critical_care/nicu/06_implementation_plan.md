# 06_implementation_plan.md - NICU Implementation Roadmap
**Expert: DevOps Lead**

## 1. Phase 1: Database
- Migration: `e87_nicu_up.sql`.
- Tables: `nicu_admissions`, `nicu_vitals`, `nicu_tpn_logs`, `neonatal_growth_logs`.
- Reverse: `e87_nicu_down.sql` (non-destructive, keeps historical data).

## 2. Phase 2: Backend
- Extend `nicu_engine.js` and integrate with delivery room, APGAR, and TPN pharmacy.
- Implement `ai_nicu_orchestrator.js` (neonatal sepsis early warning + growth predictor).
- Add routes to `server.js` with `requireRole('neonatologist')` / `requireRole('nicu_nurse')` and `requireTenantScope`.

## 3. Phase 3: Frontend
- Build `nicu-station.js` using Stitch components.
- Integrate into `app.js` `NAV_ITEMS` and `FACILITY_ALLOWED`.
- Add bedside monitor, APGAR panel, growth chart, and mother-baby link.

## 4. Phase 4: QA
- Unit tests for APGAR calculation and alert thresholds.
- Integration tests for mother-baby link.
- Security audit for Golden Access Rule and PHI vault access.
