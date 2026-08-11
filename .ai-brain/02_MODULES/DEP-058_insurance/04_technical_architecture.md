# Technical Architecture — Insurance_Claims_NPHIES (DEP-058)

> **PSA:** Mr. David Kim · Generated 2026-08-08

## 1. API Surface
- `GET /api/insurance/list` — list items
- `GET /api/insurance/:id` — get item
- `POST /api/insurance` — create
- `PUT /api/insurance/:id` — update
- `DELETE /api/insurance/:id` — soft delete
- `GET /api/insurance/search?q=` — search
- `POST /api/insurance/ai/diagnose` — AI diagnosis

## 2. Middleware Chain
```
requireAuth → requireTenantScope → requireRole(insurance_*) →
validateBody(RS.insurance_schema) → idempotencyGuard (if money) →
async (req, res) => { ... }
```

## 3. Database
- 8-15 entities (see `13_data_erd.sql`)
- All tables: FORCE_RLS enabled
- Audit columns: created_at, updated_at, deleted_at
- Indexes: tenant_id, patient_id, encounter_id, code

## 4. RBAC Roles
- **insurance_coordinator**: scoped to insurance
- **claims_specialist**: scoped to insurance
- **denial_specialist**: scoped to insurance
- **network_manager**: scoped to insurance
- **member_services_rep**: scoped to insurance


## 5. Cache
- Redis: 5min TTL on list/search
- Vector cache: pgvector with ivfflat

## 6. Performance Targets
- p50 latency: <50ms
- p95 latency: <200ms
- p99 latency: <500ms
- Throughput: 100 RPS per dept