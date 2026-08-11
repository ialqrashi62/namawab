# Technical Architecture — Radiation_Oncology (DEP-049)

> **PSA:** Mr. David Kim · Generated 2026-08-08

## 1. API Surface
- `GET /api/radOnc/list` — list items
- `GET /api/radOnc/:id` — get item
- `POST /api/radOnc` — create
- `PUT /api/radOnc/:id` — update
- `DELETE /api/radOnc/:id` — soft delete
- `GET /api/radOnc/search?q=` — search
- `POST /api/radOnc/ai/diagnose` — AI diagnosis

## 2. Middleware Chain
```
requireAuth → requireTenantScope → requireRole(radOnc_*) →
validateBody(RS.radOnc_schema) → idempotencyGuard (if money) →
async (req, res) => { ... }
```

## 3. Database
- 8-15 entities (see `13_data_erd.sql`)
- All tables: FORCE_RLS enabled
- Audit columns: created_at, updated_at, deleted_at
- Indexes: tenant_id, patient_id, encounter_id, code

## 4. RBAC Roles
- **radiation_oncologist**: scoped to radOnc
- **medical_physicist**: scoped to radOnc
- **dosimetrist**: scoped to radOnc
- **radiation_therapist**: scoped to radOnc


## 5. Cache
- Redis: 5min TTL on list/search
- Vector cache: pgvector with ivfflat

## 6. Performance Targets
- p50 latency: <50ms
- p95 latency: <200ms
- p99 latency: <500ms
- Throughput: 100 RPS per dept