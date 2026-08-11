# Technical Architecture — Plastic_Burns (DEP-018)

> **PSA:** Mr. David Kim · Generated 2026-08-08

## 1. API Surface
- `GET /api/plastic/list` — list items
- `GET /api/plastic/:id` — get item
- `POST /api/plastic` — create
- `PUT /api/plastic/:id` — update
- `DELETE /api/plastic/:id` — soft delete
- `GET /api/plastic/search?q=` — search
- `POST /api/plastic/ai/diagnose` — AI diagnosis

## 2. Middleware Chain
```
requireAuth → requireTenantScope → requireRole(plastic_*) →
validateBody(RS.plastic_schema) → idempotencyGuard (if money) →
async (req, res) => { ... }
```

## 3. Database
- 8-15 entities (see `13_data_erd.sql`)
- All tables: FORCE_RLS enabled
- Audit columns: created_at, updated_at, deleted_at
- Indexes: tenant_id, patient_id, encounter_id, code

## 4. RBAC Roles
- **plastic_surgeon**: scoped to plastic
- **burn_specialist**: scoped to plastic
- **cosmetic_surgeon**: scoped to plastic
- **reconstructive_surgeon**: scoped to plastic
- **plastic_nurse**: scoped to plastic


## 5. Cache
- Redis: 5min TTL on list/search
- Vector cache: pgvector with ivfflat

## 6. Performance Targets
- p50 latency: <50ms
- p95 latency: <200ms
- p99 latency: <500ms
- Throughput: 100 RPS per dept