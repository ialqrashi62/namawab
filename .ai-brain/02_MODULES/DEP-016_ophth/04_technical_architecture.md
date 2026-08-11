# Technical Architecture — Ophthalmology (DEP-016)

> **PSA:** Mr. David Kim · Generated 2026-08-08

## 1. API Surface
- `GET /api/ophth/list` — list items
- `GET /api/ophth/:id` — get item
- `POST /api/ophth` — create
- `PUT /api/ophth/:id` — update
- `DELETE /api/ophth/:id` — soft delete
- `GET /api/ophth/search?q=` — search
- `POST /api/ophth/ai/diagnose` — AI diagnosis

## 2. Middleware Chain
```
requireAuth → requireTenantScope → requireRole(ophth_*) →
validateBody(RS.ophth_schema) → idempotencyGuard (if money) →
async (req, res) => { ... }
```

## 3. Database
- 8-15 entities (see `13_data_erd.sql`)
- All tables: FORCE_RLS enabled
- Audit columns: created_at, updated_at, deleted_at
- Indexes: tenant_id, patient_id, encounter_id, code

## 4. RBAC Roles
- **ophthalmologist**: scoped to ophth
- **retina_specialist**: scoped to ophth
- **glaucoma_specialist**: scoped to ophth
- **optometrist**: scoped to ophth
- **ophthalmic_nurse**: scoped to ophth


## 5. Cache
- Redis: 5min TTL on list/search
- Vector cache: pgvector with ivfflat

## 6. Performance Targets
- p50 latency: <50ms
- p95 latency: <200ms
- p99 latency: <500ms
- Throughput: 100 RPS per dept