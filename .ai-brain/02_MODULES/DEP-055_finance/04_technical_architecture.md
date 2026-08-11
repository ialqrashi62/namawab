# Technical Architecture — Finance_Accounting (DEP-055)

> **PSA:** Mr. David Kim · Generated 2026-08-08

## 1. API Surface
- `GET /api/finance/list` — list items
- `GET /api/finance/:id` — get item
- `POST /api/finance` — create
- `PUT /api/finance/:id` — update
- `DELETE /api/finance/:id` — soft delete
- `GET /api/finance/search?q=` — search
- `POST /api/finance/ai/diagnose` — AI diagnosis

## 2. Middleware Chain
```
requireAuth → requireTenantScope → requireRole(finance_*) →
validateBody(RS.finance_schema) → idempotencyGuard (if money) →
async (req, res) => { ... }
```

## 3. Database
- 8-15 entities (see `13_data_erd.sql`)
- All tables: FORCE_RLS enabled
- Audit columns: created_at, updated_at, deleted_at
- Indexes: tenant_id, patient_id, encounter_id, code

## 4. RBAC Roles
- **cfo**: scoped to finance
- **finance_manager**: scoped to finance
- **accountant**: scoped to finance
- **accounts_payable_clerk**: scoped to finance
- **accounts_receivable_clerk**: scoped to finance
- **payroll_specialist**: scoped to finance


## 5. Cache
- Redis: 5min TTL on list/search
- Vector cache: pgvector with ivfflat

## 6. Performance Targets
- p50 latency: <50ms
- p95 latency: <200ms
- p99 latency: <500ms
- Throughput: 100 RPS per dept