# Technical Architecture — Hematology_Oncology (DEP-004)

> **PSA:** Mr. David Kim · Generated 2026-08-08

## 1. API Surface
- `GET /api/hemOnc/list` — list items
- `GET /api/hemOnc/:id` — get item
- `POST /api/hemOnc` — create
- `PUT /api/hemOnc/:id` — update
- `DELETE /api/hemOnc/:id` — soft delete
- `GET /api/hemOnc/search?q=` — search
- `POST /api/hemOnc/ai/diagnose` — AI diagnosis

## 2. Middleware Chain
```
requireAuth → requireTenantScope → requireRole(hemOnc_*) →
validateBody(RS.hemOnc_schema) → idempotencyGuard (if money) →
async (req, res) => { ... }
```

## 3. Database
- 8-15 entities (see `13_data_erd.sql`)
- All tables: FORCE_RLS enabled
- Audit columns: created_at, updated_at, deleted_at
- Indexes: tenant_id, patient_id, encounter_id, code

## 4. RBAC Roles
- **oncologist**: scoped to hemOnc
- **hematologist**: scoped to hemOnc
- **oncology_nurse**: scoped to hemOnc
- **bmt_coordinator**: scoped to hemOnc


## 5. Cache
- Redis: 5min TTL on list/search
- Vector cache: pgvector with ivfflat

## 6. Performance Targets
- p50 latency: <50ms
- p95 latency: <200ms
- p99 latency: <500ms
- Throughput: 100 RPS per dept