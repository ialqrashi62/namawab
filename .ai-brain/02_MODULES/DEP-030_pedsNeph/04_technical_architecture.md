# Technical Architecture — Pediatric_Nephrology (DEP-030)

> **PSA:** Mr. David Kim · Generated 2026-08-08

## 1. API Surface
- `GET /api/pedsNeph/list` — list items
- `GET /api/pedsNeph/:id` — get item
- `POST /api/pedsNeph` — create
- `PUT /api/pedsNeph/:id` — update
- `DELETE /api/pedsNeph/:id` — soft delete
- `GET /api/pedsNeph/search?q=` — search
- `POST /api/pedsNeph/ai/diagnose` — AI diagnosis

## 2. Middleware Chain
```
requireAuth → requireTenantScope → requireRole(pedsNeph_*) →
validateBody(RS.pedsNeph_schema) → idempotencyGuard (if money) →
async (req, res) => { ... }
```

## 3. Database
- 8-15 entities (see `13_data_erd.sql`)
- All tables: FORCE_RLS enabled
- Audit columns: created_at, updated_at, deleted_at
- Indexes: tenant_id, patient_id, encounter_id, code

## 4. RBAC Roles
- **pediatric_nephrologist**: scoped to pedsNeph
- **pediatric_dialysis_nurse**: scoped to pedsNeph


## 5. Cache
- Redis: 5min TTL on list/search
- Vector cache: pgvector with ivfflat

## 6. Performance Targets
- p50 latency: <50ms
- p95 latency: <200ms
- p99 latency: <500ms
- Throughput: 100 RPS per dept