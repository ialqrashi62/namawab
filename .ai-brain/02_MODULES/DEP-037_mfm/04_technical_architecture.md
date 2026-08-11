# Technical Architecture — Maternal_Fetal_Medicine (DEP-037)

> **PSA:** Mr. David Kim · Generated 2026-08-08

## 1. API Surface
- `GET /api/mfm/list` — list items
- `GET /api/mfm/:id` — get item
- `POST /api/mfm` — create
- `PUT /api/mfm/:id` — update
- `DELETE /api/mfm/:id` — soft delete
- `GET /api/mfm/search?q=` — search
- `POST /api/mfm/ai/diagnose` — AI diagnosis

## 2. Middleware Chain
```
requireAuth → requireTenantScope → requireRole(mfm_*) →
validateBody(RS.mfm_schema) → idempotencyGuard (if money) →
async (req, res) => { ... }
```

## 3. Database
- 8-15 entities (see `13_data_erd.sql`)
- All tables: FORCE_RLS enabled
- Audit columns: created_at, updated_at, deleted_at
- Indexes: tenant_id, patient_id, encounter_id, code

## 4. RBAC Roles
- **mfm_specialist**: scoped to mfm
- **fetal_medicine_specialist**: scoped to mfm
- **perinatal_nurse**: scoped to mfm
- **sonographer_mfm**: scoped to mfm


## 5. Cache
- Redis: 5min TTL on list/search
- Vector cache: pgvector with ivfflat

## 6. Performance Targets
- p50 latency: <50ms
- p95 latency: <200ms
- p99 latency: <500ms
- Throughput: 100 RPS per dept