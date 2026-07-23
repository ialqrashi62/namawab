# 01 Clinical Spec — Administrative Operations

## 1. Clinical Domain & Scope
- **Focus**: Executive dashboards, reports, BI, settings, SaaS tenant control, and system administration.
- **Key Workflows**:
  - Executive KPI dashboards.
  - Operational and clinical reports.
  - Tenant configuration and feature flags.
  - User and role management.
  - System settings and integrations.

## 2. Patient Journey
- Not patient-facing; supports all clinical and operational workflows through configuration, reporting, and governance.

## 3. Clinical Decision Support
- KPI thresholds and alerts.
- Report scheduling and distribution.
- Tenant-level feature gating.

## 4. Integration Points
- All clinical and operational modules for data aggregation.
- BI/data warehouse.
- Authentication and RBAC.

## 5. Safety Gates
- Super Admin role for tenant-level changes.
- Audit logging for all configuration changes.
- Read-only reports for non-admin users.
