# Technical Architecture — General_Pediatrics (DEP-026)

> **PSA:** Mr. David Kim · Generated 2026-08-08

## 1. API Surface
- `GET /api/peds/list` — list items
- `GET /api/peds/:id` — get item
- `POST /api/peds` — create
- `PUT /api/peds/:id` — update
- `DELETE /api/peds/:id` — soft delete
- `GET /api/peds/search?q=` — search
- `POST /api/peds/ai/diagnose` — AI diagnosis

## 2. Middleware Chain
```
requireAuth → requireTenantScope → requireRole(peds_*) →
validateBody(RS.peds_schema) → idempotencyGuard (if money) →
async (req, res) => { ... }
```

## 3. Database
- 8-15 entities (see `13_data_erd.sql`)
- All tables: FORCE_RLS enabled
- Audit columns: created_at, updated_at, deleted_at
- Indexes: tenant_id, patient_id, encounter_id, code

## 4. RBAC Roles
- **pediatrician**: scoped to peds
- **pediatric_nurse**: scoped to peds
- **neonatologist**: scoped to peds


## 5. Cache
- Redis: 5min TTL on list/search
- Vector cache: pgvector with ivfflat

## 6. Performance Targets
- p50 latency: <50ms
- p95 latency: <200ms
- p99 latency: <500ms
- Throughput: 100 RPS per dept