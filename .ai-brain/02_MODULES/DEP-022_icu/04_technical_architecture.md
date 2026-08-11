# Technical Architecture — ICU_Adult (DEP-022)

> **PSA:** Mr. David Kim · Generated 2026-08-08

## 1. API Surface
- `GET /api/icu/list` — list items
- `GET /api/icu/:id` — get item
- `POST /api/icu` — create
- `PUT /api/icu/:id` — update
- `DELETE /api/icu/:id` — soft delete
- `GET /api/icu/search?q=` — search
- `POST /api/icu/ai/diagnose` — AI diagnosis

## 2. Middleware Chain
```
requireAuth → requireTenantScope → requireRole(icu_*) →
validateBody(RS.icu_schema) → idempotencyGuard (if money) →
async (req, res) => { ... }
```

## 3. Database
- 8-15 entities (see `13_data_erd.sql`)
- All tables: FORCE_RLS enabled
- Audit columns: created_at, updated_at, deleted_at
- Indexes: tenant_id, patient_id, encounter_id, code

## 4. RBAC Roles
- **intensivist**: scoped to icu
- **icu_physician**: scoped to icu
- **icu_nurse**: scoped to icu
- **respiratory_therapist**: scoped to icu
- **icu_pharmacist**: scoped to icu


## 5. Cache
- Redis: 5min TTL on list/search
- Vector cache: pgvector with ivfflat

## 6. Performance Targets
- p50 latency: <50ms
- p95 latency: <200ms
- p99 latency: <500ms
- Throughput: 100 RPS per dept