# Technical Architecture — Inventory_Supply_Chain (DEP-054)

> **PSA:** Mr. David Kim · Generated 2026-08-08

## 1. API Surface
- `GET /api/inventory/list` — list items
- `GET /api/inventory/:id` — get item
- `POST /api/inventory` — create
- `PUT /api/inventory/:id` — update
- `DELETE /api/inventory/:id` — soft delete
- `GET /api/inventory/search?q=` — search
- `POST /api/inventory/ai/diagnose` — AI diagnosis

## 2. Middleware Chain
```
requireAuth → requireTenantScope → requireRole(inventory_*) →
validateBody(RS.inventory_schema) → idempotencyGuard (if money) →
async (req, res) => { ... }
```

## 3. Database
- 8-15 entities (see `13_data_erd.sql`)
- All tables: FORCE_RLS enabled
- Audit columns: created_at, updated_at, deleted_at
- Indexes: tenant_id, patient_id, encounter_id, code

## 4. RBAC Roles
- **pharmacy_supply_chain_manager**: scoped to inventory
- **materials_manager**: scoped to inventory
- **buyer**: scoped to inventory
- **storekeeper**: scoped to inventory
- **inventory_controller**: scoped to inventory


## 5. Cache
- Redis: 5min TTL on list/search
- Vector cache: pgvector with ivfflat

## 6. Performance Targets
- p50 latency: <50ms
- p95 latency: <200ms
- p99 latency: <500ms
- Throughput: 100 RPS per dept