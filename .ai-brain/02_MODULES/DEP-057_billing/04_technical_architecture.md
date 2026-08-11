# Technical Architecture — Billing_Coding (DEP-057)

> **PSA:** Mr. David Kim · Generated 2026-08-08

## 1. API Surface
- `GET /api/billing/list` — list items
- `GET /api/billing/:id` — get item
- `POST /api/billing` — create
- `PUT /api/billing/:id` — update
- `DELETE /api/billing/:id` — soft delete
- `GET /api/billing/search?q=` — search
- `POST /api/billing/ai/diagnose` — AI diagnosis

## 2. Middleware Chain
```
requireAuth → requireTenantScope → requireRole(billing_*) →
validateBody(RS.billing_schema) → idempotencyGuard (if money) →
async (req, res) => { ... }
```

## 3. Database
- 8-15 entities (see `13_data_erd.sql`)
- All tables: FORCE_RLS enabled
- Audit columns: created_at, updated_at, deleted_at
- Indexes: tenant_id, patient_id, encounter_id, code

## 4. RBAC Roles
- **biller**: scoped to billing
- **medical_coder**: scoped to billing
- **denial_specialist**: scoped to billing
- **billing_manager**: scoped to billing
- **revenue_cycle_specialist**: scoped to billing


## 5. Cache
- Redis: 5min TTL on list/search
- Vector cache: pgvector with ivfflat

## 6. Performance Targets
- p50 latency: <50ms
- p95 latency: <200ms
- p99 latency: <500ms
- Throughput: 100 RPS per dept