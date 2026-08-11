# Technical Architecture — Physical_Therapy_Rehab (DEP-046)

> **PSA:** Mr. David Kim · Generated 2026-08-08

## 1. API Surface
- `GET /api/pt/list` — list items
- `GET /api/pt/:id` — get item
- `POST /api/pt` — create
- `PUT /api/pt/:id` — update
- `DELETE /api/pt/:id` — soft delete
- `GET /api/pt/search?q=` — search
- `POST /api/pt/ai/diagnose` — AI diagnosis

## 2. Middleware Chain
```
requireAuth → requireTenantScope → requireRole(pt_*) →
validateBody(RS.pt_schema) → idempotencyGuard (if money) →
async (req, res) => { ... }
```

## 3. Database
- 8-15 entities (see `13_data_erd.sql`)
- All tables: FORCE_RLS enabled
- Audit columns: created_at, updated_at, deleted_at
- Indexes: tenant_id, patient_id, encounter_id, code

## 4. RBAC Roles
- **physical_therapist**: scoped to pt
- **rehab_specialist**: scoped to pt
- **orthopedic_pt**: scoped to pt
- **neuro_pt**: scoped to pt
- **sports_therapist**: scoped to pt


## 5. Cache
- Redis: 5min TTL on list/search
- Vector cache: pgvector with ivfflat

## 6. Performance Targets
- p50 latency: <50ms
- p95 latency: <200ms
- p99 latency: <500ms
- Throughput: 100 RPS per dept