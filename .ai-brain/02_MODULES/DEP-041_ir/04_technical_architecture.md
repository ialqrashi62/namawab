# Technical Architecture — Interventional_Radiology (DEP-041)

> **PSA:** Mr. David Kim · Generated 2026-08-08

## 1. API Surface
- `GET /api/ir/list` — list items
- `GET /api/ir/:id` — get item
- `POST /api/ir` — create
- `PUT /api/ir/:id` — update
- `DELETE /api/ir/:id` — soft delete
- `GET /api/ir/search?q=` — search
- `POST /api/ir/ai/diagnose` — AI diagnosis

## 2. Middleware Chain
```
requireAuth → requireTenantScope → requireRole(ir_*) →
validateBody(RS.ir_schema) → idempotencyGuard (if money) →
async (req, res) => { ... }
```

## 3. Database
- 8-15 entities (see `13_data_erd.sql`)
- All tables: FORCE_RLS enabled
- Audit columns: created_at, updated_at, deleted_at
- Indexes: tenant_id, patient_id, encounter_id, code

## 4. RBAC Roles
- **interventional_radiologist**: scoped to ir
- **ir_fellow**: scoped to ir
- **ir_nurse**: scoped to ir
- **ir_tech**: scoped to ir


## 5. Cache
- Redis: 5min TTL on list/search
- Vector cache: pgvector with ivfflat

## 6. Performance Targets
- p50 latency: <50ms
- p95 latency: <200ms
- p99 latency: <500ms
- Throughput: 100 RPS per dept