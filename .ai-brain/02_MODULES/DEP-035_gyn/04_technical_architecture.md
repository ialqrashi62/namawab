# Technical Architecture — Gynecology (DEP-035)

> **PSA:** Mr. David Kim · Generated 2026-08-08

## 1. API Surface
- `GET /api/gyn/list` — list items
- `GET /api/gyn/:id` — get item
- `POST /api/gyn` — create
- `PUT /api/gyn/:id` — update
- `DELETE /api/gyn/:id` — soft delete
- `GET /api/gyn/search?q=` — search
- `POST /api/gyn/ai/diagnose` — AI diagnosis

## 2. Middleware Chain
```
requireAuth → requireTenantScope → requireRole(gyn_*) →
validateBody(RS.gyn_schema) → idempotencyGuard (if money) →
async (req, res) => { ... }
```

## 3. Database
- 8-15 entities (see `13_data_erd.sql`)
- All tables: FORCE_RLS enabled
- Audit columns: created_at, updated_at, deleted_at
- Indexes: tenant_id, patient_id, encounter_id, code

## 4. RBAC Roles
- **gynecologist**: scoped to gyn
- **gyne_oncologist**: scoped to gyn
- **repro_endocrinologist**: scoped to gyn
- **gyn_nurse**: scoped to gyn


## 5. Cache
- Redis: 5min TTL on list/search
- Vector cache: pgvector with ivfflat

## 6. Performance Targets
- p50 latency: <50ms
- p95 latency: <200ms
- p99 latency: <500ms
- Throughput: 100 RPS per dept