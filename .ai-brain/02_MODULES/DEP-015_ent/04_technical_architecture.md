# Technical Architecture — ENT (DEP-015)

> **PSA:** Mr. David Kim · Generated 2026-08-08

## 1. API Surface
- `GET /api/ent/list` — list items
- `GET /api/ent/:id` — get item
- `POST /api/ent` — create
- `PUT /api/ent/:id` — update
- `DELETE /api/ent/:id` — soft delete
- `GET /api/ent/search?q=` — search
- `POST /api/ent/ai/diagnose` — AI diagnosis

## 2. Middleware Chain
```
requireAuth → requireTenantScope → requireRole(ent_*) →
validateBody(RS.ent_schema) → idempotencyGuard (if money) →
async (req, res) => { ... }
```

## 3. Database
- 8-15 entities (see `13_data_erd.sql`)
- All tables: FORCE_RLS enabled
- Audit columns: created_at, updated_at, deleted_at
- Indexes: tenant_id, patient_id, encounter_id, code

## 4. RBAC Roles
- **ent_surgeon**: scoped to ent
- **otolaryngologist**: scoped to ent
- **audiologist**: scoped to ent
- **ent_nurse**: scoped to ent


## 5. Cache
- Redis: 5min TTL on list/search
- Vector cache: pgvector with ivfflat

## 6. Performance Targets
- p50 latency: <50ms
- p95 latency: <200ms
- p99 latency: <500ms
- Throughput: 100 RPS per dept