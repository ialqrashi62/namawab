# Technical Architecture — Pulmonology (DEP-006)

> **PSA:** Mr. David Kim · Generated 2026-08-08

## 1. API Surface
- `GET /api/pulmonology/list` — list items
- `GET /api/pulmonology/:id` — get item
- `POST /api/pulmonology` — create
- `PUT /api/pulmonology/:id` — update
- `DELETE /api/pulmonology/:id` — soft delete
- `GET /api/pulmonology/search?q=` — search
- `POST /api/pulmonology/ai/diagnose` — AI diagnosis

## 2. Middleware Chain
```
requireAuth → requireTenantScope → requireRole(pulmonology_*) →
validateBody(RS.pulmonology_schema) → idempotencyGuard (if money) →
async (req, res) => { ... }
```

## 3. Database
- 8-15 entities (see `13_data_erd.sql`)
- All tables: FORCE_RLS enabled
- Audit columns: created_at, updated_at, deleted_at
- Indexes: tenant_id, patient_id, encounter_id, code

## 4. RBAC Roles
- **pulmonologist**: scoped to pulmonology
- **sleep_specialist**: scoped to pulmonology
- **bronchoscopist**: scoped to pulmonology
- **respiratory_therapist**: scoped to pulmonology


## 5. Cache
- Redis: 5min TTL on list/search
- Vector cache: pgvector with ivfflat

## 6. Performance Targets
- p50 latency: <50ms
- p95 latency: <200ms
- p99 latency: <500ms
- Throughput: 100 RPS per dept