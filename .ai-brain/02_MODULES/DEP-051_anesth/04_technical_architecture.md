# Technical Architecture — Anesthesia (DEP-051)

> **PSA:** Mr. David Kim · Generated 2026-08-08

## 1. API Surface
- `GET /api/anesth/list` — list items
- `GET /api/anesth/:id` — get item
- `POST /api/anesth` — create
- `PUT /api/anesth/:id` — update
- `DELETE /api/anesth/:id` — soft delete
- `GET /api/anesth/search?q=` — search
- `POST /api/anesth/ai/diagnose` — AI diagnosis

## 2. Middleware Chain
```
requireAuth → requireTenantScope → requireRole(anesth_*) →
validateBody(RS.anesth_schema) → idempotencyGuard (if money) →
async (req, res) => { ... }
```

## 3. Database
- 8-15 entities (see `13_data_erd.sql`)
- All tables: FORCE_RLS enabled
- Audit columns: created_at, updated_at, deleted_at
- Indexes: tenant_id, patient_id, encounter_id, code

## 4. RBAC Roles
- **anesthesiologist**: scoped to anesth
- **crna**: scoped to anesth
- **anesthesiologist_assistant**: scoped to anesth
- **anesthesia_tech**: scoped to anesth


## 5. Cache
- Redis: 5min TTL on list/search
- Vector cache: pgvector with ivfflat

## 6. Performance Targets
- p50 latency: <50ms
- p95 latency: <200ms
- p99 latency: <500ms
- Throughput: 100 RPS per dept