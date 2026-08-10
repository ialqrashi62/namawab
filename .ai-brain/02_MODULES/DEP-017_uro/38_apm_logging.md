# APM & Logging Plan — Uro (DEP-017)
**Last updated:** 2026-08-10

## Metrics tracked for Uro

### Per-route

| Route | Latency p95 | Error rate | RPS |
|---|---|---|---|
| POST /api/dep_017/create | < 200ms | < 0.1% | ? |
| GET /api/dep_017/list | < 100ms | < 0.1% | ? |
| POST /api/dep_017/update | < 200ms | < 0.1% | ? |

### Per-engine

- `Uro engine` latency, error rate, throughput
- DB query latency (per dept table)
- Cache hit rate (per dept cache)

## Structured logging

```json
{
  "timestamp": "2026-08-10T12:34:56Z",
  "level": "info",
  "service": "nama-medical-erp",
  "dept": "DEP-017",
  "tenant_id": "tnt_123",
  "user_id": "usr_456",
  "request_id": "req_abc",
  "trace_id": "trace_xyz",
  "route": "POST /api/dep_017/create",
  "duration_ms": 45,
  "msg": "Uro created"
}
```

## Alerts

- Uro error rate > 5% → PagerDuty
- Uro p95 latency > 1s → email
- Uro DB query > 500ms → APM
- Uro RLS violation → PagerDuty + SMS

## Dashboards (Grafana)

- Uro overview (latency, errors, RPS)
- Uro per-tenant
- Uro per-engine
- Uro audit log

## Audit retention

- 7+ years (PDPL)
- Hash-chained (audit_middleware.js)
- Stored in `audit_log` table
