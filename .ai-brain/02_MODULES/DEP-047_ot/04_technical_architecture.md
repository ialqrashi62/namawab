# Technical Architecture — Occupational_Therapy (DEP-047)

> **PSA:** Mr. David Kim · Generated 2026-08-08

## 1. API Surface
- `GET /api/ot/list` — list items
- `GET /api/ot/:id` — get item
- `POST /api/ot` — create
- `PUT /api/ot/:id` — update
- `DELETE /api/ot/:id` — soft delete
- `GET /api/ot/search?q=` — search
- `POST /api/ot/ai/diagnose` — AI diagnosis

## 2. Middleware Chain
```
requireAuth → requireTenantScope → requireRole(ot_*) →
validateBody(RS.ot_schema) → idempotencyGuard (if money) →
async (req, res) => { ... }
```

## 3. Database
- 8-15 entities (see `13_data_erd.sql`)
- All tables: FORCE_RLS enabled
- Audit columns: created_at, updated_at, deleted_at
- Indexes: tenant_id, patient_id, encounter_id, code

## 4. RBAC Roles
- **occupational_therapist**: scoped to ot
- **hand_therapist**: scoped to ot
- **pediatric_ot**: scoped to ot
- **geriatric_ot**: scoped to ot
- **mental_health_ot**: scoped to ot


## 5. Cache
- Redis: 5min TTL on list/search
- Vector cache: pgvector with ivfflat

## 6. Performance Targets
- p50 latency: <50ms
- p95 latency: <200ms
- p99 latency: <500ms
- Throughput: 100 RPS per dept