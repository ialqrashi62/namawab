# Technical Architecture — Neonatology (DEP-027)

> **PSA:** Mr. David Kim · Generated 2026-08-08

## 1. API Surface
- `GET /api/neonate/list` — list items
- `GET /api/neonate/:id` — get item
- `POST /api/neonate` — create
- `PUT /api/neonate/:id` — update
- `DELETE /api/neonate/:id` — soft delete
- `GET /api/neonate/search?q=` — search
- `POST /api/neonate/ai/diagnose` — AI diagnosis

## 2. Middleware Chain
```
requireAuth → requireTenantScope → requireRole(neonate_*) →
validateBody(RS.neonate_schema) → idempotencyGuard (if money) →
async (req, res) => { ... }
```

## 3. Database
- 8-15 entities (see `13_data_erd.sql`)
- All tables: FORCE_RLS enabled
- Audit columns: created_at, updated_at, deleted_at
- Indexes: tenant_id, patient_id, encounter_id, code

## 4. RBAC Roles
- **neonatologist**: scoped to neonate
- **neonatal_nurse**: scoped to neonate
- **neonatal_np**: scoped to neonate


## 5. Cache
- Redis: 5min TTL on list/search
- Vector cache: pgvector with ivfflat

## 6. Performance Targets
- p50 latency: <50ms
- p95 latency: <200ms
- p99 latency: <500ms
- Throughput: 100 RPS per dept