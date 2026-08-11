# Technical Architecture — NICU (DEP-023)

> **PSA:** Mr. David Kim · Generated 2026-08-08

## 1. API Surface
- `GET /api/nicu/list` — list items
- `GET /api/nicu/:id` — get item
- `POST /api/nicu` — create
- `PUT /api/nicu/:id` — update
- `DELETE /api/nicu/:id` — soft delete
- `GET /api/nicu/search?q=` — search
- `POST /api/nicu/ai/diagnose` — AI diagnosis

## 2. Middleware Chain
```
requireAuth → requireTenantScope → requireRole(nicu_*) →
validateBody(RS.nicu_schema) → idempotencyGuard (if money) →
async (req, res) => { ... }
```

## 3. Database
- 8-15 entities (see `13_data_erd.sql`)
- All tables: FORCE_RLS enabled
- Audit columns: created_at, updated_at, deleted_at
- Indexes: tenant_id, patient_id, encounter_id, code

## 4. RBAC Roles
- **neonatologist**: scoped to nicu
- **nicu_nurse**: scoped to nicu
- **nicu_respiratory_therapist**: scoped to nicu


## 5. Cache
- Redis: 5min TTL on list/search
- Vector cache: pgvector with ivfflat

## 6. Performance Targets
- p50 latency: <50ms
- p95 latency: <200ms
- p99 latency: <500ms
- Throughput: 100 RPS per dept