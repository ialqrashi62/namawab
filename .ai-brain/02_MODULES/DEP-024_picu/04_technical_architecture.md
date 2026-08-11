# Technical Architecture — PICU (DEP-024)

> **PSA:** Mr. David Kim · Generated 2026-08-08

## 1. API Surface
- `GET /api/picu/list` — list items
- `GET /api/picu/:id` — get item
- `POST /api/picu` — create
- `PUT /api/picu/:id` — update
- `DELETE /api/picu/:id` — soft delete
- `GET /api/picu/search?q=` — search
- `POST /api/picu/ai/diagnose` — AI diagnosis

## 2. Middleware Chain
```
requireAuth → requireTenantScope → requireRole(picu_*) →
validateBody(RS.picu_schema) → idempotencyGuard (if money) →
async (req, res) => { ... }
```

## 3. Database
- 8-15 entities (see `13_data_erd.sql`)
- All tables: FORCE_RLS enabled
- Audit columns: created_at, updated_at, deleted_at
- Indexes: tenant_id, patient_id, encounter_id, code

## 4. RBAC Roles
- **pediatric_intensivist**: scoped to picu
- **picu_nurse**: scoped to picu
- **pediatric_respiratory_therapist**: scoped to picu


## 5. Cache
- Redis: 5min TTL on list/search
- Vector cache: pgvector with ivfflat

## 6. Performance Targets
- p50 latency: <50ms
- p95 latency: <200ms
- p99 latency: <500ms
- Throughput: 100 RPS per dept