# APM & Logging Plan — Ir (DEP-041)
**Last updated:** 2026-08-10

## Metrics tracked for Ir

### Per-route

| Route | Latency p95 | Error rate | RPS |
|---|---|---|---|
| POST /api/dep_041/create | < 200ms | < 0.1% | ? |
| GET /api/dep_041/list | < 100ms | < 0.1% | ? |
| POST /api/dep_041/update | < 200ms | < 0.1% | ? |

### Per-engine

- `Ir engine` latency, error rate, throughput
- DB query latency (per dept table)
- Cache hit rate (per dept cache)

## Structured logging

```json
{
  "timestamp": "2026-08-10T12:34:56Z",
  "level": "info",
  "service": "nama-medical-erp",
  "dept": "DEP-041",
  "tenant_id": "tnt_123",
  "user_id": "usr_456",
  "request_id": "req_abc",
  "trace_id": "trace_xyz",
  "route": "POST /api/dep_041/create",
  "duration_ms": 45,
  "msg": "Ir created"
}
```

## Alerts

- Ir error rate > 5% → PagerDuty
- Ir p95 latency > 1s → email
- Ir DB query > 500ms → APM
- Ir RLS violation → PagerDuty + SMS

## Dashboards (Grafana)

- Ir overview (latency, errors, RPS)
- Ir per-tenant
- Ir per-engine
- Ir audit log

## Audit retention

- 7+ years (PDPL)
- Hash-chained (audit_middleware.js)
- Stored in `audit_log` table
