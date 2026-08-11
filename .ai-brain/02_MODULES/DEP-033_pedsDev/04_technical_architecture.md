# Technical Architecture — Pediatric_Development_Rehab (DEP-033)

> **PSA:** Mr. David Kim · Generated 2026-08-08

## 1. API Surface
- `GET /api/pedsDev/list` — list items
- `GET /api/pedsDev/:id` — get item
- `POST /api/pedsDev` — create
- `PUT /api/pedsDev/:id` — update
- `DELETE /api/pedsDev/:id` — soft delete
- `GET /api/pedsDev/search?q=` — search
- `POST /api/pedsDev/ai/diagnose` — AI diagnosis

## 2. Middleware Chain
```
requireAuth → requireTenantScope → requireRole(pedsDev_*) →
validateBody(RS.pedsDev_schema) → idempotencyGuard (if money) →
async (req, res) => { ... }
```

## 3. Database
- 8-15 entities (see `13_data_erd.sql`)
- All tables: FORCE_RLS enabled
- Audit columns: created_at, updated_at, deleted_at
- Indexes: tenant_id, patient_id, encounter_id, code

## 4. RBAC Roles
- **developmental_pediatrician**: scoped to pedsDev
- **pediatric_therapist**: scoped to pedsDev
- **speech_therapist_peds**: scoped to pedsDev
- **occupational_therapist_peds**: scoped to pedsDev


## 5. Cache
- Redis: 5min TTL on list/search
- Vector cache: pgvector with ivfflat

## 6. Performance Targets
- p50 latency: <50ms
- p95 latency: <200ms
- p99 latency: <500ms
- Throughput: 100 RPS per dept