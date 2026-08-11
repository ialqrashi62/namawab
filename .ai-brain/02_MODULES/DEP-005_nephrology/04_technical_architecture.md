# Technical Architecture — Nephrology (DEP-005)

> **PSA:** Mr. David Kim · Generated 2026-08-08

## 1. API Surface
- `GET /api/nephrology/list` — list items
- `GET /api/nephrology/:id` — get item
- `POST /api/nephrology` — create
- `PUT /api/nephrology/:id` — update
- `DELETE /api/nephrology/:id` — soft delete
- `GET /api/nephrology/search?q=` — search
- `POST /api/nephrology/ai/diagnose` — AI diagnosis

## 2. Middleware Chain
```
requireAuth → requireTenantScope → requireRole(nephrology_*) →
validateBody(RS.nephrology_schema) → idempotencyGuard (if money) →
async (req, res) => { ... }
```

## 3. Database
- 8-15 entities (see `13_data_erd.sql`)
- All tables: FORCE_RLS enabled
- Audit columns: created_at, updated_at, deleted_at
- Indexes: tenant_id, patient_id, encounter_id, code

## 4. RBAC Roles
- **nephrologist**: scoped to nephrology
- **transplant_nephrologist**: scoped to nephrology
- **dialysis_nurse**: scoped to nephrology
- **dialysis_tech**: scoped to nephrology


## 5. Cache
- Redis: 5min TTL on list/search
- Vector cache: pgvector with ivfflat

## 6. Performance Targets
- p50 latency: <50ms
- p95 latency: <200ms
- p99 latency: <500ms
- Throughput: 100 RPS per dept