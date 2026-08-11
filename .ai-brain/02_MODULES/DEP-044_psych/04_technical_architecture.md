# Technical Architecture — Psychiatry (DEP-044)

> **PSA:** Mr. David Kim · Generated 2026-08-08

## 1. API Surface
- `GET /api/psych/list` — list items
- `GET /api/psych/:id` — get item
- `POST /api/psych` — create
- `PUT /api/psych/:id` — update
- `DELETE /api/psych/:id` — soft delete
- `GET /api/psych/search?q=` — search
- `POST /api/psych/ai/diagnose` — AI diagnosis

## 2. Middleware Chain
```
requireAuth → requireTenantScope → requireRole(psych_*) →
validateBody(RS.psych_schema) → idempotencyGuard (if money) →
async (req, res) => { ... }
```

## 3. Database
- 8-15 entities (see `13_data_erd.sql`)
- All tables: FORCE_RLS enabled
- Audit columns: created_at, updated_at, deleted_at
- Indexes: tenant_id, patient_id, encounter_id, code

## 4. RBAC Roles
- **psychiatrist**: scoped to psych
- **addiction_specialist**: scoped to psych
- **psychiatric_nurse**: scoped to psych
- **psychologist**: scoped to psych
- **social_worker**: scoped to psych


## 5. Cache
- Redis: 5min TTL on list/search
- Vector cache: pgvector with ivfflat

## 6. Performance Targets
- p50 latency: <50ms
- p95 latency: <200ms
- p99 latency: <500ms
- Throughput: 100 RPS per dept