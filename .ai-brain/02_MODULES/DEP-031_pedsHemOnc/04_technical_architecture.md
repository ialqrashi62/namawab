# Technical Architecture — Pediatric_HemOnc (DEP-031)

> **PSA:** Mr. David Kim · Generated 2026-08-08

## 1. API Surface
- `GET /api/pedsHemOnc/list` — list items
- `GET /api/pedsHemOnc/:id` — get item
- `POST /api/pedsHemOnc` — create
- `PUT /api/pedsHemOnc/:id` — update
- `DELETE /api/pedsHemOnc/:id` — soft delete
- `GET /api/pedsHemOnc/search?q=` — search
- `POST /api/pedsHemOnc/ai/diagnose` — AI diagnosis

## 2. Middleware Chain
```
requireAuth → requireTenantScope → requireRole(pedsHemOnc_*) →
validateBody(RS.pedsHemOnc_schema) → idempotencyGuard (if money) →
async (req, res) => { ... }
```

## 3. Database
- 8-15 entities (see `13_data_erd.sql`)
- All tables: FORCE_RLS enabled
- Audit columns: created_at, updated_at, deleted_at
- Indexes: tenant_id, patient_id, encounter_id, code

## 4. RBAC Roles
- **pediatric_oncologist**: scoped to pedsHemOnc
- **pediatric_hematologist**: scoped to pedsHemOnc
- **oncology_nurse_pediatric**: scoped to pedsHemOnc
- **bmt_coordinator_pediatric**: scoped to pedsHemOnc


## 5. Cache
- Redis: 5min TTL on list/search
- Vector cache: pgvector with ivfflat

## 6. Performance Targets
- p50 latency: <50ms
- p95 latency: <200ms
- p99 latency: <500ms
- Throughput: 100 RPS per dept