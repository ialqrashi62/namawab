# APM & Logging Plan — Finance (DEP-055)
**Last updated:** 2026-08-10

## Metrics tracked for Finance

### Per-route

| Route | Latency p95 | Error rate | RPS |
|---|---|---|---|
| POST /api/dep_055/create | < 200ms | < 0.1% | ? |
| GET /api/dep_055/list | < 100ms | < 0.1% | ? |
| POST /api/dep_055/update | < 200ms | < 0.1% | ? |

### Per-engine

- `Finance engine` latency, error rate, throughput
- DB query latency (per dept table)
- Cache hit rate (per dept cache)

## Structured logging

```json
{
  "timestamp": "2026-08-10T12:34:56Z",
  "level": "info",
  "service": "nama-medical-erp",
  "dept": "DEP-055",
  "tenant_id": "tnt_123",
  "user_id": "usr_456",
  "request_id": "req_abc",
  "trace_id": "trace_xyz",
  "route": "POST /api/dep_055/create",
  "duration_ms": 45,
  "msg": "Finance created"
}
```

## Alerts

- Finance error rate > 5% → PagerDuty
- Finance p95 latency > 1s → email
- Finance DB query > 500ms → APM
- Finance RLS violation → PagerDuty + SMS

## Dashboards (Grafana)

- Finance overview (latency, errors, RPS)
- Finance per-tenant
- Finance per-engine
- Finance audit log

## Audit retention

- 7+ years (PDPL)
- Hash-chained (audit_middleware.js)
- Stored in `audit_log` table
