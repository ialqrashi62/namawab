# Technical Architecture — Infectious_Diseases (DEP-008)

> **PSA:** Mr. David Kim · Generated 2026-08-08

## 1. API Surface
- `GET /api/infectious/list` — list items
- `GET /api/infectious/:id` — get item
- `POST /api/infectious` — create
- `PUT /api/infectious/:id` — update
- `DELETE /api/infectious/:id` — soft delete
- `GET /api/infectious/search?q=` — search
- `POST /api/infectious/ai/diagnose` — AI diagnosis

## 2. Middleware Chain
```
requireAuth → requireTenantScope → requireRole(infectious_*) →
validateBody(RS.infectious_schema) → idempotencyGuard (if money) →
async (req, res) => { ... }
```

## 3. Database
- 8-15 entities (see `13_data_erd.sql`)
- All tables: FORCE_RLS enabled
- Audit columns: created_at, updated_at, deleted_at
- Indexes: tenant_id, patient_id, encounter_id, code

## 4. RBAC Roles
- **infectious_disease_specialist**: scoped to infectious
- **infection_control_officer**: scoped to infectious
- **hiv_counselor**: scoped to infectious
- **id_nurse**: scoped to infectious


## 5. Cache
- Redis: 5min TTL on list/search
- Vector cache: pgvector with ivfflat

## 6. Performance Targets
- p50 latency: <50ms
- p95 latency: <200ms
- p99 latency: <500ms
- Throughput: 100 RPS per dept