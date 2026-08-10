# APM & Logging Plan — Ortho (DEP-012)
**Last updated:** 2026-08-10

## Metrics tracked for Ortho

### Per-route

| Route | Latency p95 | Error rate | RPS |
|---|---|---|---|
| POST /api/dep_012/create | < 200ms | < 0.1% | ? |
| GET /api/dep_012/list | < 100ms | < 0.1% | ? |
| POST /api/dep_012/update | < 200ms | < 0.1% | ? |

### Per-engine

- `Ortho engine` latency, error rate, throughput
- DB query latency (per dept table)
- Cache hit rate (per dept cache)

## Structured logging

```json
{
  "timestamp": "2026-08-10T12:34:56Z",
  "level": "info",
  "service": "nama-medical-erp",
  "dept": "DEP-012",
  "tenant_id": "tnt_123",
  "user_id": "usr_456",
  "request_id": "req_abc",
  "trace_id": "trace_xyz",
  "route": "POST /api/dep_012/create",
  "duration_ms": 45,
  "msg": "Ortho created"
}
```

## Alerts

- Ortho error rate > 5% → PagerDuty
- Ortho p95 latency > 1s → email
- Ortho DB query > 500ms → APM
- Ortho RLS violation → PagerDuty + SMS

## Dashboards (Grafana)

- Ortho overview (latency, errors, RPS)
- Ortho per-tenant
- Ortho per-engine
- Ortho audit log

## Audit retention

- 7+ years (PDPL)
- Hash-chained (audit_middleware.js)
- Stored in `audit_log` table
