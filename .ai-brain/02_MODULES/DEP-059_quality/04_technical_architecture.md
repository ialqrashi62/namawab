# Technical Architecture — Quality_Safety (DEP-059)

> **PSA:** Mr. David Kim · Generated 2026-08-08

## 1. API Surface
- `GET /api/quality/list` — list items
- `GET /api/quality/:id` — get item
- `POST /api/quality` — create
- `PUT /api/quality/:id` — update
- `DELETE /api/quality/:id` — soft delete
- `GET /api/quality/search?q=` — search
- `POST /api/quality/ai/diagnose` — AI diagnosis

## 2. Middleware Chain
```
requireAuth → requireTenantScope → requireRole(quality_*) →
validateBody(RS.quality_schema) → idempotencyGuard (if money) →
async (req, res) => { ... }
```

## 3. Database
- 8-15 entities (see `13_data_erd.sql`)
- All tables: FORCE_RLS enabled
- Audit columns: created_at, updated_at, deleted_at
- Indexes: tenant_id, patient_id, encounter_id, code

## 4. RBAC Roles
- **quality_director**: scoped to quality
- **patient_safety_officer**: scoped to quality
- **infection_control_practitioner**: scoped to quality
- **risk_manager**: scoped to quality
- **accreditation_coordinator**: scoped to quality


## 5. Cache
- Redis: 5min TTL on list/search
- Vector cache: pgvector with ivfflat

## 6. Performance Targets
- p50 latency: <50ms
- p95 latency: <200ms
- p99 latency: <500ms
- Throughput: 100 RPS per dept