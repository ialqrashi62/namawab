# APM & Logging Plan — Obs (DEP-034)
**Last updated:** 2026-08-10

## Metrics tracked for Obs

### Per-route

| Route | Latency p95 | Error rate | RPS |
|---|---|---|---|
| POST /api/dep_034/create | < 200ms | < 0.1% | ? |
| GET /api/dep_034/list | < 100ms | < 0.1% | ? |
| POST /api/dep_034/update | < 200ms | < 0.1% | ? |

### Per-engine

- `Obs engine` latency, error rate, throughput
- DB query latency (per dept table)
- Cache hit rate (per dept cache)

## Structured logging

```json
{
  "timestamp": "2026-08-10T12:34:56Z",
  "level": "info",
  "service": "nama-medical-erp",
  "dept": "DEP-034",
  "tenant_id": "tnt_123",
  "user_id": "usr_456",
  "request_id": "req_abc",
  "trace_id": "trace_xyz",
  "route": "POST /api/dep_034/create",
  "duration_ms": 45,
  "msg": "Obs created"
}
```

## Alerts

- Obs error rate > 5% → PagerDuty
- Obs p95 latency > 1s → email
- Obs DB query > 500ms → APM
- Obs RLS violation → PagerDuty + SMS

## Dashboards (Grafana)

- Obs overview (latency, errors, RPS)
- Obs per-tenant
- Obs per-engine
- Obs audit log

## Audit retention

- 7+ years (PDPL)
- Hash-chained (audit_middleware.js)
- Stored in `audit_log` table
