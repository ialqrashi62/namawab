# APM & Logging Plan — Psych (DEP-044)
**Last updated:** 2026-08-10

## Metrics tracked for Psych

### Per-route

| Route | Latency p95 | Error rate | RPS |
|---|---|---|---|
| POST /api/dep_044/create | < 200ms | < 0.1% | ? |
| GET /api/dep_044/list | < 100ms | < 0.1% | ? |
| POST /api/dep_044/update | < 200ms | < 0.1% | ? |

### Per-engine

- `Psych engine` latency, error rate, throughput
- DB query latency (per dept table)
- Cache hit rate (per dept cache)

## Structured logging

```json
{
  "timestamp": "2026-08-10T12:34:56Z",
  "level": "info",
  "service": "nama-medical-erp",
  "dept": "DEP-044",
  "tenant_id": "tnt_123",
  "user_id": "usr_456",
  "request_id": "req_abc",
  "trace_id": "trace_xyz",
  "route": "POST /api/dep_044/create",
  "duration_ms": 45,
  "msg": "Psych created"
}
```

## Alerts

- Psych error rate > 5% → PagerDuty
- Psych p95 latency > 1s → email
- Psych DB query > 500ms → APM
- Psych RLS violation → PagerDuty + SMS

## Dashboards (Grafana)

- Psych overview (latency, errors, RPS)
- Psych per-tenant
- Psych per-engine
- Psych audit log

## Audit retention

- 7+ years (PDPL)
- Hash-chained (audit_middleware.js)
- Stored in `audit_log` table
