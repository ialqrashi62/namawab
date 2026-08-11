# Technical Architecture — Palliative_Care (DEP-050)

> **PSA:** Mr. David Kim · Generated 2026-08-08

## 1. API Surface
- `GET /api/palliative/list` — list items
- `GET /api/palliative/:id` — get item
- `POST /api/palliative` — create
- `PUT /api/palliative/:id` — update
- `DELETE /api/palliative/:id` — soft delete
- `GET /api/palliative/search?q=` — search
- `POST /api/palliative/ai/diagnose` — AI diagnosis

## 2. Middleware Chain
```
requireAuth → requireTenantScope → requireRole(palliative_*) →
validateBody(RS.palliative_schema) → idempotencyGuard (if money) →
async (req, res) => { ... }
```

## 3. Database
- 8-15 entities (see `13_data_erd.sql`)
- All tables: FORCE_RLS enabled
- Audit columns: created_at, updated_at, deleted_at
- Indexes: tenant_id, patient_id, encounter_id, code

## 4. RBAC Roles
- **palliative_care_physician**: scoped to palliative
- **hospice_physician**: scoped to palliative
- **palliative_nurse**: scoped to palliative
- **social_worker_pall**: scoped to palliative
- **chaplain**: scoped to palliative


## 5. Cache
- Redis: 5min TTL on list/search
- Vector cache: pgvector with ivfflat

## 6. Performance Targets
- p50 latency: <50ms
- p95 latency: <200ms
- p99 latency: <500ms
- Throughput: 100 RPS per dept