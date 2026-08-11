# Technical Architecture — Pathology (DEP-043)

> **PSA:** Mr. David Kim · Generated 2026-08-08

## 1. API Surface
- `GET /api/path/list` — list items
- `GET /api/path/:id` — get item
- `POST /api/path` — create
- `PUT /api/path/:id` — update
- `DELETE /api/path/:id` — soft delete
- `GET /api/path/search?q=` — search
- `POST /api/path/ai/diagnose` — AI diagnosis

## 2. Middleware Chain
```
requireAuth → requireTenantScope → requireRole(path_*) →
validateBody(RS.path_schema) → idempotencyGuard (if money) →
async (req, res) => { ... }
```

## 3. Database
- 8-15 entities (see `13_data_erd.sql`)
- All tables: FORCE_RLS enabled
- Audit columns: created_at, updated_at, deleted_at
- Indexes: tenant_id, patient_id, encounter_id, code

## 4. RBAC Roles
- **pathologist**: scoped to path
- **hematopathologist**: scoped to path
- **molecular_pathologist**: scoped to path
- **pathologist_assistant**: scoped to path
- **histo_tech**: scoped to path


## 5. Cache
- Redis: 5min TTL on list/search
- Vector cache: pgvector with ivfflat

## 6. Performance Targets
- p50 latency: <50ms
- p95 latency: <200ms
- p99 latency: <500ms
- Throughput: 100 RPS per dept