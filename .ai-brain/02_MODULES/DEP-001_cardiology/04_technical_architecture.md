# Technical Architecture — Cardiology (DEP-001)

> **PSA:** Mr. David Kim · Generated 2026-08-08

## 1. API Surface
- `GET /api/cardiology/list` — list items
- `GET /api/cardiology/:id` — get item
- `POST /api/cardiology` — create
- `PUT /api/cardiology/:id` — update
- `DELETE /api/cardiology/:id` — soft delete
- `GET /api/cardiology/search?q=` — search
- `POST /api/cardiology/ai/diagnose` — AI diagnosis

## 2. Middleware Chain
```
requireAuth → requireTenantScope → requireRole(cardiology_*) →
validateBody(RS.cardiology_schema) → idempotencyGuard (if money) →
async (req, res) => { ... }
```

## 3. Database
- 8-15 entities (see `13_data_erd.sql`)
- All tables: FORCE_RLS enabled
- Audit columns: created_at, updated_at, deleted_at
- Indexes: tenant_id, patient_id, encounter_id, code

## 4. RBAC Roles
- **cardiologist**: scoped to cardiology
- **cardiologist_interventional**: scoped to cardiology
- **cardiologist_ep**: scoped to cardiology
- **cardiology_nurse**: scoped to cardiology
- **cardiology_tech**: scoped to cardiology


## 5. Cache
- Redis: 5min TTL on list/search
- Vector cache: pgvector with ivfflat

## 6. Performance Targets
- p50 latency: <50ms
- p95 latency: <200ms
- p99 latency: <500ms
- Throughput: 100 RPS per dept