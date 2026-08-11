# Technical Architecture — Gastroenterology (DEP-003)

> **PSA:** Mr. David Kim · Generated 2026-08-08

## 1. API Surface
- `GET /api/gastroenterology/list` — list items
- `GET /api/gastroenterology/:id` — get item
- `POST /api/gastroenterology` — create
- `PUT /api/gastroenterology/:id` — update
- `DELETE /api/gastroenterology/:id` — soft delete
- `GET /api/gastroenterology/search?q=` — search
- `POST /api/gastroenterology/ai/diagnose` — AI diagnosis

## 2. Middleware Chain
```
requireAuth → requireTenantScope → requireRole(gastroenterology_*) →
validateBody(RS.gastroenterology_schema) → idempotencyGuard (if money) →
async (req, res) => { ... }
```

## 3. Database
- 8-15 entities (see `13_data_erd.sql`)
- All tables: FORCE_RLS enabled
- Audit columns: created_at, updated_at, deleted_at
- Indexes: tenant_id, patient_id, encounter_id, code

## 4. RBAC Roles
- **gastroenterologist**: scoped to gastroenterology
- **hepatologist**: scoped to gastroenterology
- **endoscopy_specialist**: scoped to gastroenterology
- **gi_nurse**: scoped to gastroenterology


## 5. Cache
- Redis: 5min TTL on list/search
- Vector cache: pgvector with ivfflat

## 6. Performance Targets
- p50 latency: <50ms
- p95 latency: <200ms
- p99 latency: <500ms
- Throughput: 100 RPS per dept