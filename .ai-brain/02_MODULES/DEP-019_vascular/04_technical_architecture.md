# Technical Architecture — Vascular_Surgery (DEP-019)

> **PSA:** Mr. David Kim · Generated 2026-08-08

## 1. API Surface
- `GET /api/vascular/list` — list items
- `GET /api/vascular/:id` — get item
- `POST /api/vascular` — create
- `PUT /api/vascular/:id` — update
- `DELETE /api/vascular/:id` — soft delete
- `GET /api/vascular/search?q=` — search
- `POST /api/vascular/ai/diagnose` — AI diagnosis

## 2. Middleware Chain
```
requireAuth → requireTenantScope → requireRole(vascular_*) →
validateBody(RS.vascular_schema) → idempotencyGuard (if money) →
async (req, res) => { ... }
```

## 3. Database
- 8-15 entities (see `13_data_erd.sql`)
- All tables: FORCE_RLS enabled
- Audit columns: created_at, updated_at, deleted_at
- Indexes: tenant_id, patient_id, encounter_id, code

## 4. RBAC Roles
- **vascular_surgeon**: scoped to vascular
- **endovascular_specialist**: scoped to vascular
- **vascular_nurse**: scoped to vascular


## 5. Cache
- Redis: 5min TTL on list/search
- Vector cache: pgvector with ivfflat

## 6. Performance Targets
- p50 latency: <50ms
- p95 latency: <200ms
- p99 latency: <500ms
- Throughput: 100 RPS per dept