# Technical Architecture — Emergency (DEP-021)

> **PSA:** Mr. David Kim · Generated 2026-08-08

## 1. API Surface
- `GET /api/emergency/list` — list items
- `GET /api/emergency/:id` — get item
- `POST /api/emergency` — create
- `PUT /api/emergency/:id` — update
- `DELETE /api/emergency/:id` — soft delete
- `GET /api/emergency/search?q=` — search
- `POST /api/emergency/ai/diagnose` — AI diagnosis

## 2. Middleware Chain
```
requireAuth → requireTenantScope → requireRole(emergency_*) →
validateBody(RS.emergency_schema) → idempotencyGuard (if money) →
async (req, res) => { ... }
```

## 3. Database
- 8-15 entities (see `13_data_erd.sql`)
- All tables: FORCE_RLS enabled
- Audit columns: created_at, updated_at, deleted_at
- Indexes: tenant_id, patient_id, encounter_id, code

## 4. RBAC Roles
- **emergency_physician**: scoped to emergency
- **emergency_nurse**: scoped to emergency
- **trauma_surgeon**: scoped to emergency
- **er_tech**: scoped to emergency


## 5. Cache
- Redis: 5min TTL on list/search
- Vector cache: pgvector with ivfflat

## 6. Performance Targets
- p50 latency: <50ms
- p95 latency: <200ms
- p99 latency: <500ms
- Throughput: 100 RPS per dept