# Technical Architecture — Obstetrics (DEP-034)

> **PSA:** Mr. David Kim · Generated 2026-08-08

## 1. API Surface
- `GET /api/obs/list` — list items
- `GET /api/obs/:id` — get item
- `POST /api/obs` — create
- `PUT /api/obs/:id` — update
- `DELETE /api/obs/:id` — soft delete
- `GET /api/obs/search?q=` — search
- `POST /api/obs/ai/diagnose` — AI diagnosis

## 2. Middleware Chain
```
requireAuth → requireTenantScope → requireRole(obs_*) →
validateBody(RS.obs_schema) → idempotencyGuard (if money) →
async (req, res) => { ... }
```

## 3. Database
- 8-15 entities (see `13_data_erd.sql`)
- All tables: FORCE_RLS enabled
- Audit columns: created_at, updated_at, deleted_at
- Indexes: tenant_id, patient_id, encounter_id, code

## 4. RBAC Roles
- **obstetrician**: scoped to obs
- **midwife**: scoped to obs
- **ob_nurse**: scoped to obs
- **neonatologist**: scoped to obs


## 5. Cache
- Redis: 5min TTL on list/search
- Vector cache: pgvector with ivfflat

## 6. Performance Targets
- p50 latency: <50ms
- p95 latency: <200ms
- p99 latency: <500ms
- Throughput: 100 RPS per dept