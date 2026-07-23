# 06 Implementation Plan — Oncology Therapeutics & Infusion Services

## 1. Phase 1 — Core (Immediate)
- Chemotherapy order workflow with protocol verification.
- BSA-based dose calculator with hard stops.
- Infusion logging and reaction documentation.

## 2. Phase 2 — Advanced
- Toxicity grading and dose modification suggestions.
- Integration with LIS for organ function alerts.
- Patient education and consent workflow.

## 3. Phase 3 — Optimization
- AI-assisted nadir prediction.
- Outcome analytics and protocol effectiveness.
- Research registry integration.

## 4. Migration
- `eXX_oncology_therapeutics_up.sql` / `_down.sql`.

## 5. Acceptance Criteria
- Dose >10% over protocol max is blocked.
- Infusion reactions trigger emergency workflow.
- Toxicity grades match CTCAE v5.0.
