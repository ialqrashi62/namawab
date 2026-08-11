# Technical Architecture — PACU (DEP-025)

> **PSA:** Mr. David Kim · Generated 2026-08-08

## 1. API Surface
- `GET /api/pacu/list` — list items
- `GET /api/pacu/:id` — get item
- `POST /api/pacu` — create
- `PUT /api/pacu/:id` — update
- `DELETE /api/pacu/:id` — soft delete
- `GET /api/pacu/search?q=` — search
- `POST /api/pacu/ai/diagnose` — AI diagnosis

## 2. Middleware Chain
```
requireAuth → requireTenantScope → requireRole(pacu_*) →
validateBody(RS.pacu_schema) → idempotencyGuard (if money) →
async (req, res) => { ... }
```

## 3. Database
- 8-15 entities (see `13_data_erd.sql`)
- All tables: FORCE_RLS enabled
- Audit columns: created_at, updated_at, deleted_at
- Indexes: tenant_id, patient_id, encounter_id, code

## 4. RBAC Roles
- **anesthesiologist**: scoped to pacu
- **pacu_nurse**: scoped to pacu
- **post_op_nurse**: scoped to pacu


## 5. Cache
- Redis: 5min TTL on list/search
- Vector cache: pgvector with ivfflat

## 6. Performance Targets
- p50 latency: <50ms
- p95 latency: <200ms
- p99 latency: <500ms
- Throughput: 100 RPS per dept