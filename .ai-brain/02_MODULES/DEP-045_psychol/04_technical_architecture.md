# Technical Architecture — Psychology (DEP-045)

> **PSA:** Mr. David Kim · Generated 2026-08-08

## 1. API Surface
- `GET /api/psychol/list` — list items
- `GET /api/psychol/:id` — get item
- `POST /api/psychol` — create
- `PUT /api/psychol/:id` — update
- `DELETE /api/psychol/:id` — soft delete
- `GET /api/psychol/search?q=` — search
- `POST /api/psychol/ai/diagnose` — AI diagnosis

## 2. Middleware Chain
```
requireAuth → requireTenantScope → requireRole(psychol_*) →
validateBody(RS.psychol_schema) → idempotencyGuard (if money) →
async (req, res) => { ... }
```

## 3. Database
- 8-15 entities (see `13_data_erd.sql`)
- All tables: FORCE_RLS enabled
- Audit columns: created_at, updated_at, deleted_at
- Indexes: tenant_id, patient_id, encounter_id, code

## 4. RBAC Roles
- **clinical_psychologist**: scoped to psychol
- **neuropsychologist**: scoped to psychol
- **child_psychologist**: scoped to psychol
- **psychotherapist**: scoped to psychol
- **counseling_psychologist**: scoped to psychol


## 5. Cache
- Redis: 5min TTL on list/search
- Vector cache: pgvector with ivfflat

## 6. Performance Targets
- p50 latency: <50ms
- p95 latency: <200ms
- p99 latency: <500ms
- Throughput: 100 RPS per dept