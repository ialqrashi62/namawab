# 06 Implementation Plan — Administration, HR & Academic Affairs

## 1. Phase 1 — Core (Immediate)
- Staff directory and credential tracking.
- Scheduling and leave workflow.
- Audit viewer read-only query.

## 2. Phase 2 — Advanced
- Payroll integration.
- CME activity and credit tracking.
- Committees management.

## 3. Phase 3 — Optimization
- Executive dashboards and analytics.
- Predictive staffing models.
- Automated SCFHS reporting.

## 4. Migration
- `eXX_admin_academic_hub_up.sql` / `_down.sql`.

## 5. Acceptance Criteria
- Credential expiry alerts fire at 90/60/30 days.
- Scheduling blocked for expired credentials.
- Audit viewer is read-only and exports are logged.
