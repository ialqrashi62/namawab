# Technical Architecture — Transplant_Surgery (DEP-020)

> **PSA:** Mr. David Kim · Generated 2026-08-08

## 1. API Surface
- `GET /api/transplant/list` — list items
- `GET /api/transplant/:id` — get item
- `POST /api/transplant` — create
- `PUT /api/transplant/:id` — update
- `DELETE /api/transplant/:id` — soft delete
- `GET /api/transplant/search?q=` — search
- `POST /api/transplant/ai/diagnose` — AI diagnosis

## 2. Middleware Chain
```
requireAuth → requireTenantScope → requireRole(transplant_*) →
validateBody(RS.transplant_schema) → idempotencyGuard (if money) →
async (req, res) => { ... }
```

## 3. Database
- 8-15 entities (see `13_data_erd.sql`)
- All tables: FORCE_RLS enabled
- Audit columns: created_at, updated_at, deleted_at
- Indexes: tenant_id, patient_id, encounter_id, code

## 4. RBAC Roles
- **transplant_surgeon**: scoped to transplant
- **transplant_coordinator**: scoped to transplant
- **immunosuppression_specialist**: scoped to transplant
- **transplant_nurse**: scoped to transplant


## 5. Cache
- Redis: 5min TTL on list/search
- Vector cache: pgvector with ivfflat

## 6. Performance Targets
- p50 latency: <50ms
- p95 latency: <200ms
- p99 latency: <500ms
- Throughput: 100 RPS per dept