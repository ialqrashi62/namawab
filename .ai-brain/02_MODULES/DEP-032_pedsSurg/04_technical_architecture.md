# Technical Architecture — Pediatric_Surgery (DEP-032)

> **PSA:** Mr. David Kim · Generated 2026-08-08

## 1. API Surface
- `GET /api/pedsSurg/list` — list items
- `GET /api/pedsSurg/:id` — get item
- `POST /api/pedsSurg` — create
- `PUT /api/pedsSurg/:id` — update
- `DELETE /api/pedsSurg/:id` — soft delete
- `GET /api/pedsSurg/search?q=` — search
- `POST /api/pedsSurg/ai/diagnose` — AI diagnosis

## 2. Middleware Chain
```
requireAuth → requireTenantScope → requireRole(pedsSurg_*) →
validateBody(RS.pedsSurg_schema) → idempotencyGuard (if money) →
async (req, res) => { ... }
```

## 3. Database
- 8-15 entities (see `13_data_erd.sql`)
- All tables: FORCE_RLS enabled
- Audit columns: created_at, updated_at, deleted_at
- Indexes: tenant_id, patient_id, encounter_id, code

## 4. RBAC Roles
- **pediatric_surgeon**: scoped to pedsSurg
- **neonatal_surgeon**: scoped to pedsSurg
- **pediatric_anesthesiologist**: scoped to pedsSurg
- **pediatric_surgical_nurse**: scoped to pedsSurg


## 5. Cache
- Redis: 5min TTL on list/search
- Vector cache: pgvector with ivfflat

## 6. Performance Targets
- p50 latency: <50ms
- p95 latency: <200ms
- p99 latency: <500ms
- Throughput: 100 RPS per dept