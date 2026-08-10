# APM & Logging Plan — Infectious (DEP-008)
**Last updated:** 2026-08-10

## Metrics tracked for Infectious

### Per-route

| Route | Latency p95 | Error rate | RPS |
|---|---|---|---|
| POST /api/dep_008/create | < 200ms | < 0.1% | ? |
| GET /api/dep_008/list | < 100ms | < 0.1% | ? |
| POST /api/dep_008/update | < 200ms | < 0.1% | ? |

### Per-engine

- `Infectious engine` latency, error rate, throughput
- DB query latency (per dept table)
- Cache hit rate (per dept cache)

## Structured logging

```json
{
  "timestamp": "2026-08-10T12:34:56Z",
  "level": "info",
  "service": "nama-medical-erp",
  "dept": "DEP-008",
  "tenant_id": "tnt_123",
  "user_id": "usr_456",
  "request_id": "req_abc",
  "trace_id": "trace_xyz",
  "route": "POST /api/dep_008/create",
  "duration_ms": 45,
  "msg": "Infectious created"
}
```

## Alerts

- Infectious error rate > 5% → PagerDuty
- Infectious p95 latency > 1s → email
- Infectious DB query > 500ms → APM
- Infectious RLS violation → PagerDuty + SMS

## Dashboards (Grafana)

- Infectious overview (latency, errors, RPS)
- Infectious per-tenant
- Infectious per-engine
- Infectious audit log

## Audit retention

- 7+ years (PDPL)
- Hash-chained (audit_middleware.js)
- Stored in `audit_log` table
