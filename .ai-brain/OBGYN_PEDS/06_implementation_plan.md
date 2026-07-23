# 06_implementation_plan.md - OBGYN & Pediatrics Implementation Roadmap
**Expert: DevOps Lead**

## 1. Phase 1: Database
- Migration: `e77_obgyn_peds_extensions_up.sql`.
- Tables: `mfm_scans`, `ivf_cycles`, `nicu_monitoring`.

## 2. Phase 2: Backend
- Update `ob_engine.js` and `obgyn_peds_wave3_engine.js`.
- Implement `ai_obgyn_peds_orchestrator.js` (RAG for Fetal/Neonatal).
- Add routes to `server.js` with `requireRole`.

## 3. Phase 3: Frontend
- Build `obgyn-peds-station.js` using Stitch components.
- Integrate into `app.js` `FACILITY_ALLOWED`.

## 4. Phase 4: QA
- Unit tests for fetal age and weight calculations.
- Security audit for the Golden Access Rule.
