# 06_implementation_plan.md - Ophthalmology Implementation Roadmap
**Expert: DevOps Lead**

## 1. Phase 1: Database
- Migration: `e74_ophthalmology_up.sql`.
- Tables: `ophthalmic_surgical_logs`, `iol_registry`, `glaucoma_metrics`, `visual_acuity_logs`.
- Reverse: `e74_ophthalmology_down.sql` (non-destructive).

## 2. Phase 2: Backend
- Extend `ophthalmology_engine.js`.
- Implement `ai_eye_orchestrator.js` (IOL power + retinal pathology).
- Add routes to `server.js` with `requireRole('eye_surgeon')` and `requireTenantScope`.

## 3. Phase 3: Frontend
- Build `ophthalmology-station.js` using Stitch components.
- Integrate into `app.js` `NAV_ITEMS` and `FACILITY_ALLOWED`.
- Add eye model, IOP heatmap, and visual acuity trend chart.

## 4. Phase 4: QA
- Unit tests for IOP crisis alert.
- Integration tests for IOL registry link.
- Security audit for correct-eye verification and PHI vault access.
