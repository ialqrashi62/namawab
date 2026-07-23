# 06_implementation_plan.md - Orthopedics Implementation Roadmap
**Expert: DevOps Lead**

## 1. Phase 1: Database
- Migration: `e70_orthopedics_up.sql`.
- Tables: `ortho_surgical_logs`, `joint_replacement_registry`, `fracture_management_logs`, `rom_score_logs`.
- Reverse: `e70_orthopedics_down.sql` (non-destructive, keeps historical data).

## 2. Phase 2: Backend
- Extend `orthopedic_engine.js`.
- Implement `ai_ortho_orchestrator.js` (implant sizing + ROM prediction).
- Add routes to `server.js` with `requireRole('orthopedic_surgeon')` and `requireTenantScope`.

## 3. Phase 3: Frontend
- Build `orthopedics-station.js` using Stitch components.
- Integrate into `app.js` `NAV_ITEMS` and `FACILITY_ALLOWED`.
- Add RTL/LTR support and Arabic labels.

## 4. Phase 4: QA
- Unit tests for AO/OTA classification parser.
- Integration tests for implant registry link.
- Security audit for Golden Access Rule and PHI vault access.
