# Technical Architecture — Neurosurgery (DEP-013)

> **PSA:** Mr. David Kim · Generated 2026-08-08

## 1. API Surface
- `GET /api/neuroSurg/list` — list items
- `GET /api/neuroSurg/:id` — get item
- `POST /api/neuroSurg` — create
- `PUT /api/neuroSurg/:id` — update
- `DELETE /api/neuroSurg/:id` — soft delete
- `GET /api/neuroSurg/search?q=` — search
- `POST /api/neuroSurg/ai/diagnose` — AI diagnosis

## 2. Middleware Chain
```
requireAuth → requireTenantScope → requireRole(neuroSurg_*) →
validateBody(RS.neuroSurg_schema) → idempotencyGuard (if money) →
async (req, res) => { ... }
```

## 3. Database
- 8-15 entities (see `13_data_erd.sql`)
- All tables: FORCE_RLS enabled
- Audit columns: created_at, updated_at, deleted_at
- Indexes: tenant_id, patient_id, encounter_id, code

## 4. RBAC Roles
- **neurosurgeon**: scoped to neuroSurg
- **spine_surgeon**: scoped to neuroSurg
- **neuro_nurse**: scoped to neuroSurg
- **neuro_icu_nurse**: scoped to neuroSurg


## 5. Cache
- Redis: 5min TTL on list/search
- Vector cache: pgvector with ivfflat

## 6. Performance Targets
- p50 latency: <50ms
- p95 latency: <200ms
- p99 latency: <500ms
- Throughput: 100 RPS per dept