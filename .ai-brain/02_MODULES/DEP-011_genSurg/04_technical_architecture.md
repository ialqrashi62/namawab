# Technical Architecture — General_Surgery (DEP-011)

> **PSA:** Mr. David Kim · Generated 2026-08-08

## 1. API Surface
- `GET /api/genSurg/list` — list items
- `GET /api/genSurg/:id` — get item
- `POST /api/genSurg` — create
- `PUT /api/genSurg/:id` — update
- `DELETE /api/genSurg/:id` — soft delete
- `GET /api/genSurg/search?q=` — search
- `POST /api/genSurg/ai/diagnose` — AI diagnosis

## 2. Middleware Chain
```
requireAuth → requireTenantScope → requireRole(genSurg_*) →
validateBody(RS.genSurg_schema) → idempotencyGuard (if money) →
async (req, res) => { ... }
```

## 3. Database
- 8-15 entities (see `13_data_erd.sql`)
- All tables: FORCE_RLS enabled
- Audit columns: created_at, updated_at, deleted_at
- Indexes: tenant_id, patient_id, encounter_id, code

## 4. RBAC Roles
- **general_surgeon**: scoped to genSurg
- **surgical_resident**: scoped to genSurg
- **scrub_nurse**: scoped to genSurg
- **anesthesiologist**: scoped to genSurg


## 5. Cache
- Redis: 5min TTL on list/search
- Vector cache: pgvector with ivfflat

## 6. Performance Targets
- p50 latency: <50ms
- p95 latency: <200ms
- p99 latency: <500ms
- Throughput: 100 RPS per dept