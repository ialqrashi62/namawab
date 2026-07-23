# 06_implementation_plan.md - Urology Implementation Roadmap
**Expert: DevOps Lead**

## 1. Phase 1: Database
- Migration: `e75_urology_up.sql`.
- Tables: `urology_surgical_logs`, `urology_stone_registry`, `urology_oncology_metrics`, `urodynamic_logs`.
- Reverse: `e75_urology_down.sql` (non-destructive).

## 2. Phase 2: Backend
- Extend `urology_engine.js`.
- Implement `ai_urology_orchestrator.js` (stone analysis + prostate staging).
- Add routes to `server.js` with `requireRole('urology_surgeon')` and `requireTenantScope`.

## 3. Phase 3: Frontend
- Build `urology-station.js` using Stitch components.
- Integrate into `app.js` `NAV_ITEMS` and `FACILITY_ALLOWED`.
- Add stone location picker, PSA trend line, and urodynamic waveform.

## 4. Phase 4: QA
- Unit tests for urine output threshold alert.
- Integration tests for stone registry link.
- Security audit for stent tracking and PHI vault access.
