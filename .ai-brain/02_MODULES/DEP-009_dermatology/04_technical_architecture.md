# Technical Architecture — Dermatology (DEP-009)

> **PSA:** Mr. David Kim · Generated 2026-08-08

## 1. API Surface
- `GET /api/dermatology/list` — list items
- `GET /api/dermatology/:id` — get item
- `POST /api/dermatology` — create
- `PUT /api/dermatology/:id` — update
- `DELETE /api/dermatology/:id` — soft delete
- `GET /api/dermatology/search?q=` — search
- `POST /api/dermatology/ai/diagnose` — AI diagnosis

## 2. Middleware Chain
```
requireAuth → requireTenantScope → requireRole(dermatology_*) →
validateBody(RS.dermatology_schema) → idempotencyGuard (if money) →
async (req, res) => { ... }
```

## 3. Database
- 8-15 entities (see `13_data_erd.sql`)
- All tables: FORCE_RLS enabled
- Audit columns: created_at, updated_at, deleted_at
- Indexes: tenant_id, patient_id, encounter_id, code

## 4. RBAC Roles
- **dermatologist**: scoped to dermatology
- **dermatology_surgeon**: scoped to dermatology
- **cosmetic_specialist**: scoped to dermatology
- **derm_nurse**: scoped to dermatology


## 5. Cache
- Redis: 5min TTL on list/search
- Vector cache: pgvector with ivfflat

## 6. Performance Targets
- p50 latency: <50ms
- p95 latency: <200ms
- p99 latency: <500ms
- Throughput: 100 RPS per dept