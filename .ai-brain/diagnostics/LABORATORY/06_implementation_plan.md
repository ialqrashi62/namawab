# 06_implementation_plan.md - Laboratory (LIS) Implementation Roadmap
**Expert: DevOps Lead**

## 1. Phase 1: Database
- Migration: `e80_lis_up.sql`.
- Tables: `lab_orders`, `lab_specimens`, `lab_results`, `lab_validation_logs`, `critical_value_alerts`, `lab_qc_logs`.
- Reverse: `e80_lis_down.sql` (non-destructive, keeps historical data).

## 2. Phase 2: Backend
- Extend `lis.js` (Laboratory Information System).
- Implement `ai_lab_orchestrator.js` (lab trend analysis + critical value summary).
- Add routes to `server.js` with `requireRole('lab_specialist')` / `requireRole('lab_pathologist')` and `requireTenantScope`.

## 3. Phase 3: Frontend
- Build `lab-station.js` using Stitch components.
- Integrate into `app.js` `NAV_ITEMS` and `FACILITY_ALLOWED`.
- Add RTL/LTR support, Arabic labels, and TAT badges.

## 4. Phase 4: QA
- Unit tests for critical value rules and delta check thresholds.
- Integration tests with CPOE and billing.
- Security audit for Golden Access Rule and PHI vault access.
