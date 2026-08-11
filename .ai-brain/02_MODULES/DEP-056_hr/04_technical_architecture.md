# Technical Architecture — HR_Staffing (DEP-056)

> **PSA:** Mr. David Kim · Generated 2026-08-08

## 1. API Surface
- `GET /api/hr/list` — list items
- `GET /api/hr/:id` — get item
- `POST /api/hr` — create
- `PUT /api/hr/:id` — update
- `DELETE /api/hr/:id` — soft delete
- `GET /api/hr/search?q=` — search
- `POST /api/hr/ai/diagnose` — AI diagnosis

## 2. Middleware Chain
```
requireAuth → requireTenantScope → requireRole(hr_*) →
validateBody(RS.hr_schema) → idempotencyGuard (if money) →
async (req, res) => { ... }
```

## 3. Database
- 8-15 entities (see `13_data_erd.sql`)
- All tables: FORCE_RLS enabled
- Audit columns: created_at, updated_at, deleted_at
- Indexes: tenant_id, patient_id, encounter_id, code

## 4. RBAC Roles
- **hr_director**: scoped to hr
- **hr_manager**: scoped to hr
- **recruiter**: scoped to hr
- **training_coordinator**: scoped to hr
- **hr_specialist**: scoped to hr


## 5. Cache
- Redis: 5min TTL on list/search
- Vector cache: pgvector with ivfflat

## 6. Performance Targets
- p50 latency: <50ms
- p95 latency: <200ms
- p99 latency: <500ms
- Throughput: 100 RPS per dept