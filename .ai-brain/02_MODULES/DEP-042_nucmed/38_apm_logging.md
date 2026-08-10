# APM & Logging Plan — Nucmed (DEP-042)
**Last updated:** 2026-08-10

## Metrics tracked for Nucmed

### Per-route

| Route | Latency p95 | Error rate | RPS |
|---|---|---|---|
| POST /api/dep_042/create | < 200ms | < 0.1% | ? |
| GET /api/dep_042/list | < 100ms | < 0.1% | ? |
| POST /api/dep_042/update | < 200ms | < 0.1% | ? |

### Per-engine

- `Nucmed engine` latency, error rate, throughput
- DB query latency (per dept table)
- Cache hit rate (per dept cache)

## Structured logging

```json
{
  "timestamp": "2026-08-10T12:34:56Z",
  "level": "info",
  "service": "nama-medical-erp",
  "dept": "DEP-042",
  "tenant_id": "tnt_123",
  "user_id": "usr_456",
  "request_id": "req_abc",
  "trace_id": "trace_xyz",
  "route": "POST /api/dep_042/create",
  "duration_ms": 45,
  "msg": "Nucmed created"
}
```

## Alerts

- Nucmed error rate > 5% → PagerDuty
- Nucmed p95 latency > 1s → email
- Nucmed DB query > 500ms → APM
- Nucmed RLS violation → PagerDuty + SMS

## Dashboards (Grafana)

- Nucmed overview (latency, errors, RPS)
- Nucmed per-tenant
- Nucmed per-engine
- Nucmed audit log

## Audit retention

- 7+ years (PDPL)
- Hash-chained (audit_middleware.js)
- Stored in `audit_log` table
