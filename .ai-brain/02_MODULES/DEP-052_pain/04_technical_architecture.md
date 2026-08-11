# Technical Architecture — Pain_Management (DEP-052)

> **PSA:** Mr. David Kim · Generated 2026-08-08

## 1. API Surface
- `GET /api/pain/list` — list items
- `GET /api/pain/:id` — get item
- `POST /api/pain` — create
- `PUT /api/pain/:id` — update
- `DELETE /api/pain/:id` — soft delete
- `GET /api/pain/search?q=` — search
- `POST /api/pain/ai/diagnose` — AI diagnosis

## 2. Middleware Chain
```
requireAuth → requireTenantScope → requireRole(pain_*) →
validateBody(RS.pain_schema) → idempotencyGuard (if money) →
async (req, res) => { ... }
```

## 3. Database
- 8-15 entities (see `13_data_erd.sql`)
- All tables: FORCE_RLS enabled
- Audit columns: created_at, updated_at, deleted_at
- Indexes: tenant_id, patient_id, encounter_id, code

## 4. RBAC Roles
- **pain_specialist**: scoped to pain
- **anesthesiologist_pain**: scoped to pain
- **interventional_pain_physician**: scoped to pain
- **pain_nurse**: scoped to pain
- **pain_psychologist**: scoped to pain


## 5. Cache
- Redis: 5min TTL on list/search
- Vector cache: pgvector with ivfflat

## 6. Performance Targets
- p50 latency: <50ms
- p95 latency: <200ms
- p99 latency: <500ms
- Throughput: 100 RPS per dept