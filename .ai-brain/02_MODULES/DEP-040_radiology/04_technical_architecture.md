# Technical Architecture — Radiology (DEP-040)

> **PSA:** Mr. David Kim · Generated 2026-08-08

## 1. API Surface
- `GET /api/radiology/list` — list items
- `GET /api/radiology/:id` — get item
- `POST /api/radiology` — create
- `PUT /api/radiology/:id` — update
- `DELETE /api/radiology/:id` — soft delete
- `GET /api/radiology/search?q=` — search
- `POST /api/radiology/ai/diagnose` — AI diagnosis

## 2. Middleware Chain
```
requireAuth → requireTenantScope → requireRole(radiology_*) →
validateBody(RS.radiology_schema) → idempotencyGuard (if money) →
async (req, res) => { ... }
```

## 3. Database
- 8-15 entities (see `13_data_erd.sql`)
- All tables: FORCE_RLS enabled
- Audit columns: created_at, updated_at, deleted_at
- Indexes: tenant_id, patient_id, encounter_id, code

## 4. RBAC Roles
- **radiologist**: scoped to radiology
- **neuroradiologist**: scoped to radiology
- **msk_radiologist**: scoped to radiology
- **radiology_tech**: scoped to radiology
- **sonographer**: scoped to radiology


## 5. Cache
- Redis: 5min TTL on list/search
- Vector cache: pgvector with ivfflat

## 6. Performance Targets
- p50 latency: <50ms
- p95 latency: <200ms
- p99 latency: <500ms
- Throughput: 100 RPS per dept