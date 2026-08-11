# Technical Architecture — Pediatric_Cardiology (DEP-028)

> **PSA:** Mr. David Kim · Generated 2026-08-08

## 1. API Surface
- `GET /api/pedsCard/list` — list items
- `GET /api/pedsCard/:id` — get item
- `POST /api/pedsCard` — create
- `PUT /api/pedsCard/:id` — update
- `DELETE /api/pedsCard/:id` — soft delete
- `GET /api/pedsCard/search?q=` — search
- `POST /api/pedsCard/ai/diagnose` — AI diagnosis

## 2. Middleware Chain
```
requireAuth → requireTenantScope → requireRole(pedsCard_*) →
validateBody(RS.pedsCard_schema) → idempotencyGuard (if money) →
async (req, res) => { ... }
```

## 3. Database
- 8-15 entities (see `13_data_erd.sql`)
- All tables: FORCE_RLS enabled
- Audit columns: created_at, updated_at, deleted_at
- Indexes: tenant_id, patient_id, encounter_id, code

## 4. RBAC Roles
- **pediatric_cardiologist**: scoped to pedsCard
- **echo_tech_pediatric**: scoped to pedsCard
- **pediatric_cardiac_nurse**: scoped to pedsCard


## 5. Cache
- Redis: 5min TTL on list/search
- Vector cache: pgvector with ivfflat

## 6. Performance Targets
- p50 latency: <50ms
- p95 latency: <200ms
- p99 latency: <500ms
- Throughput: 100 RPS per dept