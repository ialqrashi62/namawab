# 06 Implementation Plan — Support Services & Operations

## 1. Phase 1 — Core (Immediate)
- CSSD cycle tracking and OR linkage.
- Dietary order workflow with allergy flags.
- Transport request board with SLA.

## 2. Phase 2 — Advanced
- Biomedical maintenance and calibration calendar.
- Medical waste tracking with manifest matching.
- Mortuary and social service workflows.

## 3. Phase 3 — Optimization
- Operations analytics dashboard.
- Predictive maintenance alerts.
- Patient experience feedback integration.

## 4. Migration
- `eXX_support_services_hub_up.sql` / `_down.sql`.

## 5. Acceptance Criteria
- Sterile set availability blocks OR booking if unavailable.
- Overdue maintenance alerts fire for life-support devices.
- Waste manifest and certificate matching enforced.
