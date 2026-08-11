# Technical Architecture — Reproductive_Medicine_IVF (DEP-036)

> **PSA:** Mr. David Kim · Generated 2026-08-08

## 1. API Surface
- `GET /api/fertility/list` — list items
- `GET /api/fertility/:id` — get item
- `POST /api/fertility` — create
- `PUT /api/fertility/:id` — update
- `DELETE /api/fertility/:id` — soft delete
- `GET /api/fertility/search?q=` — search
- `POST /api/fertility/ai/diagnose` — AI diagnosis

## 2. Middleware Chain
```
requireAuth → requireTenantScope → requireRole(fertility_*) →
validateBody(RS.fertility_schema) → idempotencyGuard (if money) →
async (req, res) => { ... }
```

## 3. Database
- 8-15 entities (see `13_data_erd.sql`)
- All tables: FORCE_RLS enabled
- Audit columns: created_at, updated_at, deleted_at
- Indexes: tenant_id, patient_id, encounter_id, code

## 4. RBAC Roles
- **reproductive_endocrinologist**: scoped to fertility
- **ivf_specialist**: scoped to fertility
- **embryologist**: scoped to fertility
- **fertility_nurse**: scoped to fertility


## 5. Cache
- Redis: 5min TTL on list/search
- Vector cache: pgvector with ivfflat

## 6. Performance Targets
- p50 latency: <50ms
- p95 latency: <200ms
- p99 latency: <500ms
- Throughput: 100 RPS per dept