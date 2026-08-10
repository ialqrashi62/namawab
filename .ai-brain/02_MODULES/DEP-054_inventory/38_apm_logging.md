# APM & Logging Plan — Inventory (DEP-054)
**Last updated:** 2026-08-10

## Metrics tracked for Inventory

### Per-route

| Route | Latency p95 | Error rate | RPS |
|---|---|---|---|
| POST /api/dep_054/create | < 200ms | < 0.1% | ? |
| GET /api/dep_054/list | < 100ms | < 0.1% | ? |
| POST /api/dep_054/update | < 200ms | < 0.1% | ? |

### Per-engine

- `Inventory engine` latency, error rate, throughput
- DB query latency (per dept table)
- Cache hit rate (per dept cache)

## Structured logging

```json
{
  "timestamp": "2026-08-10T12:34:56Z",
  "level": "info",
  "service": "nama-medical-erp",
  "dept": "DEP-054",
  "tenant_id": "tnt_123",
  "user_id": "usr_456",
  "request_id": "req_abc",
  "trace_id": "trace_xyz",
  "route": "POST /api/dep_054/create",
  "duration_ms": 45,
  "msg": "Inventory created"
}
```

## Alerts

- Inventory error rate > 5% → PagerDuty
- Inventory p95 latency > 1s → email
- Inventory DB query > 500ms → APM
- Inventory RLS violation → PagerDuty + SMS

## Dashboards (Grafana)

- Inventory overview (latency, errors, RPS)
- Inventory per-tenant
- Inventory per-engine
- Inventory audit log

## Audit retention

- 7+ years (PDPL)
- Hash-chained (audit_middleware.js)
- Stored in `audit_log` table
