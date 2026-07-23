# 06_implementation_plan.md - Neurosurgery Implementation Roadmap
**Expert: DevOps Lead**

## 1. Phase 1: Database
- Migration: `e71_neurosurgery_up.sql`.
- Tables: `neuro_surgical_logs`, `intracranial_pressure_logs`, `spine_stability_metrics`, `gcs_trend_logs`.
- Reverse: `e71_neurosurgery_down.sql` (non-destructive).

## 2. Phase 2: Backend
- Extend `neuro_surgery_engine.js`.
- Implement `ai_neuro_orchestrator.js` (neurological deficit prediction).
- Add routes to `server.js` with `requireRole('neuro_surgeon')` and `requireTenantScope`.

## 3. Phase 3: Frontend
- Build `neurosurgery-station.js` using Stitch components.
- Integrate into `app.js` `NAV_ITEMS` and `FACILITY_ALLOWED`.
- Add real-time ICP waveform and GCS trend charts.

## 4. Phase 4: QA
- Unit tests for ICP alert thresholds.
- Integration tests for spine stability link.
- Security audit for wrong-site prevention and PHI vault access.
