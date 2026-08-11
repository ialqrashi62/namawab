# Technical Architecture — Orthopedics (DEP-012)

> **PSA:** Mr. David Kim · Generated 2026-08-08

## 1. API Surface
- `GET /api/ortho/list` — list items
- `GET /api/ortho/:id` — get item
- `POST /api/ortho` — create
- `PUT /api/ortho/:id` — update
- `DELETE /api/ortho/:id` — soft delete
- `GET /api/ortho/search?q=` — search
- `POST /api/ortho/ai/diagnose` — AI diagnosis

## 2. Middleware Chain
```
requireAuth → requireTenantScope → requireRole(ortho_*) →
validateBody(RS.ortho_schema) → idempotencyGuard (if money) →
async (req, res) => { ... }
```

## 3. Database
- 8-15 entities (see `13_data_erd.sql`)
- All tables: FORCE_RLS enabled
- Audit columns: created_at, updated_at, deleted_at
- Indexes: tenant_id, patient_id, encounter_id, code

## 4. RBAC Roles
- **orthopedic_surgeon**: scoped to ortho
- **sports_medicine_specialist**: scoped to ortho
- **spine_surgeon**: scoped to ortho
- **orthopedic_nurse**: scoped to ortho


## 5. Cache
- Redis: 5min TTL on list/search
- Vector cache: pgvector with ivfflat

## 6. Performance Targets
- p50 latency: <50ms
- p95 latency: <200ms
- p99 latency: <500ms
- Throughput: 100 RPS per dept