# Technical Architecture — Cardiothoracic_Surgery (DEP-014)

> **PSA:** Mr. David Kim · Generated 2026-08-08

## 1. API Surface
- `GET /api/cardioTh/list` — list items
- `GET /api/cardioTh/:id` — get item
- `POST /api/cardioTh` — create
- `PUT /api/cardioTh/:id` — update
- `DELETE /api/cardioTh/:id` — soft delete
- `GET /api/cardioTh/search?q=` — search
- `POST /api/cardioTh/ai/diagnose` — AI diagnosis

## 2. Middleware Chain
```
requireAuth → requireTenantScope → requireRole(cardioTh_*) →
validateBody(RS.cardioTh_schema) → idempotencyGuard (if money) →
async (req, res) => { ... }
```

## 3. Database
- 8-15 entities (see `13_data_erd.sql`)
- All tables: FORCE_RLS enabled
- Audit columns: created_at, updated_at, deleted_at
- Indexes: tenant_id, patient_id, encounter_id, code

## 4. RBAC Roles
- **cardiothoracic_surgeon**: scoped to cardioTh
- **cardiac_surgeon**: scoped to cardioTh
- **thoracic_surgeon**: scoped to cardioTh
- **perfusionist**: scoped to cardioTh
- **cticu_nurse**: scoped to cardioTh


## 5. Cache
- Redis: 5min TTL on list/search
- Vector cache: pgvector with ivfflat

## 6. Performance Targets
- p50 latency: <50ms
- p95 latency: <200ms
- p99 latency: <500ms
- Throughput: 100 RPS per dept