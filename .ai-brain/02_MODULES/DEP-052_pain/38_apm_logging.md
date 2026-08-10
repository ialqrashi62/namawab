# APM & Logging Plan — Pain (DEP-052)
**Last updated:** 2026-08-10

## Metrics tracked for Pain

### Per-route

| Route | Latency p95 | Error rate | RPS |
|---|---|---|---|
| POST /api/dep_052/create | < 200ms | < 0.1% | ? |
| GET /api/dep_052/list | < 100ms | < 0.1% | ? |
| POST /api/dep_052/update | < 200ms | < 0.1% | ? |

### Per-engine

- `Pain engine` latency, error rate, throughput
- DB query latency (per dept table)
- Cache hit rate (per dept cache)

## Structured logging

```json
{
  "timestamp": "2026-08-10T12:34:56Z",
  "level": "info",
  "service": "nama-medical-erp",
  "dept": "DEP-052",
  "tenant_id": "tnt_123",
  "user_id": "usr_456",
  "request_id": "req_abc",
  "trace_id": "trace_xyz",
  "route": "POST /api/dep_052/create",
  "duration_ms": 45,
  "msg": "Pain created"
}
```

## Alerts

- Pain error rate > 5% → PagerDuty
- Pain p95 latency > 1s → email
- Pain DB query > 500ms → APM
- Pain RLS violation → PagerDuty + SMS

## Dashboards (Grafana)

- Pain overview (latency, errors, RPS)
- Pain per-tenant
- Pain per-engine
- Pain audit log

## Audit retention

- 7+ years (PDPL)
- Hash-chained (audit_middleware.js)
- Stored in `audit_log` table
