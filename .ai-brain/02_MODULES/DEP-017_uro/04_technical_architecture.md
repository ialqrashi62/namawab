# Technical Architecture — Urology (DEP-017)

> **PSA:** Mr. David Kim · Generated 2026-08-08

## 1. API Surface
- `GET /api/uro/list` — list items
- `GET /api/uro/:id` — get item
- `POST /api/uro` — create
- `PUT /api/uro/:id` — update
- `DELETE /api/uro/:id` — soft delete
- `GET /api/uro/search?q=` — search
- `POST /api/uro/ai/diagnose` — AI diagnosis

## 2. Middleware Chain
```
requireAuth → requireTenantScope → requireRole(uro_*) →
validateBody(RS.uro_schema) → idempotencyGuard (if money) →
async (req, res) => { ... }
```

## 3. Database
- 8-15 entities (see `13_data_erd.sql`)
- All tables: FORCE_RLS enabled
- Audit columns: created_at, updated_at, deleted_at
- Indexes: tenant_id, patient_id, encounter_id, code

## 4. RBAC Roles
- **urologist**: scoped to uro
- **uro_oncologist**: scoped to uro
- **endourology_specialist**: scoped to uro
- **urology_nurse**: scoped to uro


## 5. Cache
- Redis: 5min TTL on list/search
- Vector cache: pgvector with ivfflat

## 6. Performance Targets
- p50 latency: <50ms
- p95 latency: <200ms
- p99 latency: <500ms
- Throughput: 100 RPS per dept