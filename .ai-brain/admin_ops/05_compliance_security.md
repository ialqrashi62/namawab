# 05 Compliance & Security — Administrative Operations

## 1. Compliance
- Saudi PDPL for tenant and user data.
- CBAHI governance and quality reporting.
- JCI leadership and management standards.

## 2. Security
- `requireRole('super_admin')` / `requireRole('admin_officer')`, `requireTenantScope`.
- MFA for Super Admin.
- All configuration changes logged.

## 3. Audit
- Hash-chained audit for tenant config, role changes, settings, and report exports.

## 4. Safety Gates
- Super Admin approval for tenant-level changes.
- Read-only reports for non-admin users.
- Anomaly alerts for unusual access patterns.

## 5. Data Retention
- Config history retained per policy; audit logs 7+ years.
