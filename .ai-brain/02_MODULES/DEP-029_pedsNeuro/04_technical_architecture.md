# Technical Architecture — Pediatric_Neurology (DEP-029)

> **PSA:** Mr. David Kim · Generated 2026-08-08

## 1. API Surface
- `GET /api/pedsNeuro/list` — list items
- `GET /api/pedsNeuro/:id` — get item
- `POST /api/pedsNeuro` — create
- `PUT /api/pedsNeuro/:id` — update
- `DELETE /api/pedsNeuro/:id` — soft delete
- `GET /api/pedsNeuro/search?q=` — search
- `POST /api/pedsNeuro/ai/diagnose` — AI diagnosis

## 2. Middleware Chain
```
requireAuth → requireTenantScope → requireRole(pedsNeuro_*) →
validateBody(RS.pedsNeuro_schema) → idempotencyGuard (if money) →
async (req, res) => { ... }
```

## 3. Database
- 8-15 entities (see `13_data_erd.sql`)
- All tables: FORCE_RLS enabled
- Audit columns: created_at, updated_at, deleted_at
- Indexes: tenant_id, patient_id, encounter_id, code

## 4. RBAC Roles
- **pediatric_neurologist**: scoped to pedsNeuro
- **pediatric_epileptologist**: scoped to pedsNeuro
- **neuro_nurse_pediatric**: scoped to pedsNeuro


## 5. Cache
- Redis: 5min TTL on list/search
- Vector cache: pgvector with ivfflat

## 6. Performance Targets
- p50 latency: <50ms
- p95 latency: <200ms
- p99 latency: <500ms
- Throughput: 100 RPS per dept