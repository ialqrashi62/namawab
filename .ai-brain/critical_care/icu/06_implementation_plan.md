# 06_implementation_plan.md - ICU Implementation Roadmap
**Expert: DevOps Lead**

## 1. Phase 1: Database
- Migration: `e84_icu_up.sql`.
- Tables: `icu_admissions`, `icu_vitals`, `icu_ventilator_logs`, `sepsis_bundle_tracking`, `icu_daily_goals`.
- Reverse: `e84_icu_down.sql` (non-destructive, keeps historical data).

## 2. Phase 2: Backend
- Extend `icu_engine.js` and integrate with LIS, pharmacy, and ventilator interfaces.
- Implement `ai_icu_orchestrator.js` (sepsis early warning + weaning predictor).
- Add routes to `server.js` with `requireRole('intensivist')` / `requireRole('icu_nurse')` and `requireTenantScope`.

## 3. Phase 3: Frontend
- Build `icu-station.js` using Stitch components.
- Integrate into `app.js` `NAV_ITEMS` and `FACILITY_ALLOWED`.
- Add bedside monitor, ventilator panel, and sepsis bundle checklist.

## 4. Phase 4: QA
- Unit tests for sepsis bundle timing and RSBI calculation.
- Integration tests with LIS, pharmacy, and ventilator interfaces.
- Security audit for Golden Access Rule and PHI vault access.
