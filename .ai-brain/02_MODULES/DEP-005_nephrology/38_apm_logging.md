# APM & Logging Plan — Nephrology (DEP-005)
**Last updated:** 2026-08-10

## Metrics tracked for Nephrology

### Per-route

| Route | Latency p95 | Error rate | RPS |
|---|---|---|---|
| POST /api/dep_005/create | < 200ms | < 0.1% | ? |
| GET /api/dep_005/list | < 100ms | < 0.1% | ? |
| POST /api/dep_005/update | < 200ms | < 0.1% | ? |

### Per-engine

- `Nephrology engine` latency, error rate, throughput
- DB query latency (per dept table)
- Cache hit rate (per dept cache)

## Structured logging

```json
{
  "timestamp": "2026-08-10T12:34:56Z",
  "level": "info",
  "service": "nama-medical-erp",
  "dept": "DEP-005",
  "tenant_id": "tnt_123",
  "user_id": "usr_456",
  "request_id": "req_abc",
  "trace_id": "trace_xyz",
  "route": "POST /api/dep_005/create",
  "duration_ms": 45,
  "msg": "Nephrology created"
}
```

## Alerts

- Nephrology error rate > 5% → PagerDuty
- Nephrology p95 latency > 1s → email
- Nephrology DB query > 500ms → APM
- Nephrology RLS violation → PagerDuty + SMS

## Dashboards (Grafana)

- Nephrology overview (latency, errors, RPS)
- Nephrology per-tenant
- Nephrology per-engine
- Nephrology audit log

## Audit retention

- 7+ years (PDPL)
- Hash-chained (audit_middleware.js)
- Stored in `audit_log` table
