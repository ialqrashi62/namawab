# 03 Technical Architecture — Administrative Operations

## 1. API Endpoints
- `GET /api/admin/dashboard`
- `GET /api/admin/reports`
- `POST /api/admin/tenant-config`
- `POST /api/admin/role`
- `GET /api/admin/audit-summary`

## 2. Data Model
- `tenant_configs` (id, tenant_id, key, value, updated_by).
- `dashboard_widgets` (id, tenant_id, widget_type, config, position).
- `scheduled_reports` (id, tenant_id, report_type, frequency, recipients).
- `system_settings` (id, key, value, category).

## 3. Integration
- All modules via read-only APIs/aggregates.
- BI/data warehouse.
- Audit log.

## 4. Security
- `requireRole('super_admin')` / `requireRole('admin_officer')`, `requireTenantScope`.
- Configuration changes logged and versioned.

## 5. Migration
- `eXX_admin_ops_up.sql` / `_down.sql`.
