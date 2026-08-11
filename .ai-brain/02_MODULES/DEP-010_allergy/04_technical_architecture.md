# Technical Architecture — Allergy_Immunology (DEP-010)

> **PSA:** Mr. David Kim · Generated 2026-08-08

## 1. API Surface
- `GET /api/allergy/list` — list items
- `GET /api/allergy/:id` — get item
- `POST /api/allergy` — create
- `PUT /api/allergy/:id` — update
- `DELETE /api/allergy/:id` — soft delete
- `GET /api/allergy/search?q=` — search
- `POST /api/allergy/ai/diagnose` — AI diagnosis

## 2. Middleware Chain
```
requireAuth → requireTenantScope → requireRole(allergy_*) →
validateBody(RS.allergy_schema) → idempotencyGuard (if money) →
async (req, res) => { ... }
```

## 3. Database
- 8-15 entities (see `13_data_erd.sql`)
- All tables: FORCE_RLS enabled
- Audit columns: created_at, updated_at, deleted_at
- Indexes: tenant_id, patient_id, encounter_id, code

## 4. RBAC Roles
- **allergist**: scoped to allergy
- **immunologist**: scoped to allergy
- **allergy_nurse**: scoped to allergy


## 5. Cache
- Redis: 5min TTL on list/search
- Vector cache: pgvector with ivfflat

## 6. Performance Targets
- p50 latency: <50ms
- p95 latency: <200ms
- p99 latency: <500ms
- Throughput: 100 RPS per dept