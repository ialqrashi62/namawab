# APM & Logging Plan — Billing (DEP-057)
**Last updated:** 2026-08-10

## Metrics tracked for Billing

### Per-route

| Route | Latency p95 | Error rate | RPS |
|---|---|---|---|
| POST /api/dep_057/create | < 200ms | < 0.1% | ? |
| GET /api/dep_057/list | < 100ms | < 0.1% | ? |
| POST /api/dep_057/update | < 200ms | < 0.1% | ? |

### Per-engine

- `Billing engine` latency, error rate, throughput
- DB query latency (per dept table)
- Cache hit rate (per dept cache)

## Structured logging

```json
{
  "timestamp": "2026-08-10T12:34:56Z",
  "level": "info",
  "service": "nama-medical-erp",
  "dept": "DEP-057",
  "tenant_id": "tnt_123",
  "user_id": "usr_456",
  "request_id": "req_abc",
  "trace_id": "trace_xyz",
  "route": "POST /api/dep_057/create",
  "duration_ms": 45,
  "msg": "Billing created"
}
```

## Alerts

- Billing error rate > 5% → PagerDuty
- Billing p95 latency > 1s → email
- Billing DB query > 500ms → APM
- Billing RLS violation → PagerDuty + SMS

## Dashboards (Grafana)

- Billing overview (latency, errors, RPS)
- Billing per-tenant
- Billing per-engine
- Billing audit log

## Audit retention

- 7+ years (PDPL)
- Hash-chained (audit_middleware.js)
- Stored in `audit_log` table
