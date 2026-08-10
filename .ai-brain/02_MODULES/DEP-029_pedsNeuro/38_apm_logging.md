# APM & Logging Plan — Pedsneuro (DEP-029)
**Last updated:** 2026-08-10

## Metrics tracked for Pedsneuro

### Per-route

| Route | Latency p95 | Error rate | RPS |
|---|---|---|---|
| POST /api/dep_029/create | < 200ms | < 0.1% | ? |
| GET /api/dep_029/list | < 100ms | < 0.1% | ? |
| POST /api/dep_029/update | < 200ms | < 0.1% | ? |

### Per-engine

- `Pedsneuro engine` latency, error rate, throughput
- DB query latency (per dept table)
- Cache hit rate (per dept cache)

## Structured logging

```json
{
  "timestamp": "2026-08-10T12:34:56Z",
  "level": "info",
  "service": "nama-medical-erp",
  "dept": "DEP-029",
  "tenant_id": "tnt_123",
  "user_id": "usr_456",
  "request_id": "req_abc",
  "trace_id": "trace_xyz",
  "route": "POST /api/dep_029/create",
  "duration_ms": 45,
  "msg": "Pedsneuro created"
}
```

## Alerts

- Pedsneuro error rate > 5% → PagerDuty
- Pedsneuro p95 latency > 1s → email
- Pedsneuro DB query > 500ms → APM
- Pedsneuro RLS violation → PagerDuty + SMS

## Dashboards (Grafana)

- Pedsneuro overview (latency, errors, RPS)
- Pedsneuro per-tenant
- Pedsneuro per-engine
- Pedsneuro audit log

## Audit retention

- 7+ years (PDPL)
- Hash-chained (audit_middleware.js)
- Stored in `audit_log` table
