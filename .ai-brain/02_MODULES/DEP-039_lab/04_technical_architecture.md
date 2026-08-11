# Technical Architecture — Laboratory (DEP-039)

> **PSA:** Mr. David Kim · Generated 2026-08-08

## 1. API Surface
- `GET /api/lab/list` — list items
- `GET /api/lab/:id` — get item
- `POST /api/lab` — create
- `PUT /api/lab/:id` — update
- `DELETE /api/lab/:id` — soft delete
- `GET /api/lab/search?q=` — search
- `POST /api/lab/ai/diagnose` — AI diagnosis

## 2. Middleware Chain
```
requireAuth → requireTenantScope → requireRole(lab_*) →
validateBody(RS.lab_schema) → idempotencyGuard (if money) →
async (req, res) => { ... }
```

## 3. Database
- 8-15 entities (see `13_data_erd.sql`)
- All tables: FORCE_RLS enabled
- Audit columns: created_at, updated_at, deleted_at
- Indexes: tenant_id, patient_id, encounter_id, code

## 4. RBAC Roles
- **clinical_pathologist**: scoped to lab
- **lab_technician**: scoped to lab
- **microbiologist**: scoped to lab
- **blood_bank_specialist**: scoped to lab


## 5. Cache
- Redis: 5min TTL on list/search
- Vector cache: pgvector with ivfflat

## 6. Performance Targets
- p50 latency: <50ms
- p95 latency: <200ms
- p99 latency: <500ms
- Throughput: 100 RPS per dept