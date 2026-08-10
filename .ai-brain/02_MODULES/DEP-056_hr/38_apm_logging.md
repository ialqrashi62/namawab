# APM & Logging Plan — Hr (DEP-056)
**Last updated:** 2026-08-10

## Metrics tracked for Hr

### Per-route

| Route | Latency p95 | Error rate | RPS |
|---|---|---|---|
| POST /api/dep_056/create | < 200ms | < 0.1% | ? |
| GET /api/dep_056/list | < 100ms | < 0.1% | ? |
| POST /api/dep_056/update | < 200ms | < 0.1% | ? |

### Per-engine

- `Hr engine` latency, error rate, throughput
- DB query latency (per dept table)
- Cache hit rate (per dept cache)

## Structured logging

```json
{
  "timestamp": "2026-08-10T12:34:56Z",
  "level": "info",
  "service": "nama-medical-erp",
  "dept": "DEP-056",
  "tenant_id": "tnt_123",
  "user_id": "usr_456",
  "request_id": "req_abc",
  "trace_id": "trace_xyz",
  "route": "POST /api/dep_056/create",
  "duration_ms": 45,
  "msg": "Hr created"
}
```

## Alerts

- Hr error rate > 5% → PagerDuty
- Hr p95 latency > 1s → email
- Hr DB query > 500ms → APM
- Hr RLS violation → PagerDuty + SMS

## Dashboards (Grafana)

- Hr overview (latency, errors, RPS)
- Hr per-tenant
- Hr per-engine
- Hr audit log

## Audit retention

- 7+ years (PDPL)
- Hash-chained (audit_middleware.js)
- Stored in `audit_log` table
