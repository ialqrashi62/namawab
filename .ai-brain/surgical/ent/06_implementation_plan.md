# 06_implementation_plan.md - ENT Implementation Roadmap
**Expert: DevOps Lead**

## 1. Phase 1: Database
- Migration: `e73_ent_up.sql`.
- Tables: `ent_surgical_logs`, `audiometry_metrics`, `cochlear_implant_registry`.
- Reverse: `e73_ent_down.sql` (non-destructive).

## 2. Phase 2: Backend
- Extend `ent_surgery_engine.js`.
- Implement `ai_ent_orchestrator.js` (audiogram analysis + sinus pathology).
- Add routes to `server.js` with `requireRole('ent_surgeon')` and `requireTenantScope`.

## 3. Phase 3: Frontend
- Build `ent-station.js` using Stitch components.
- Integrate into `app.js` `NAV_ITEMS` and `FACILITY_ALLOWED`.
- Add interactive audiogram plot and sinus level picker.

## 4. Phase 4: QA
- Unit tests for SSNHL detection.
- Integration tests for cochlear implant registry link.
- Security audit for side-selection confirmation and PHI vault access.
