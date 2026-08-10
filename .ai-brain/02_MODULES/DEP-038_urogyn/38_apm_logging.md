# APM & Logging Plan — Urogyn (DEP-038)
**Last updated:** 2026-08-10

## Metrics tracked for Urogyn

### Per-route

| Route | Latency p95 | Error rate | RPS |
|---|---|---|---|
| POST /api/dep_038/create | < 200ms | < 0.1% | ? |
| GET /api/dep_038/list | < 100ms | < 0.1% | ? |
| POST /api/dep_038/update | < 200ms | < 0.1% | ? |

### Per-engine

- `Urogyn engine` latency, error rate, throughput
- DB query latency (per dept table)
- Cache hit rate (per dept cache)

## Structured logging

```json
{
  "timestamp": "2026-08-10T12:34:56Z",
  "level": "info",
  "service": "nama-medical-erp",
  "dept": "DEP-038",
  "tenant_id": "tnt_123",
  "user_id": "usr_456",
  "request_id": "req_abc",
  "trace_id": "trace_xyz",
  "route": "POST /api/dep_038/create",
  "duration_ms": 45,
  "msg": "Urogyn created"
}
```

## Alerts

- Urogyn error rate > 5% → PagerDuty
- Urogyn p95 latency > 1s → email
- Urogyn DB query > 500ms → APM
- Urogyn RLS violation → PagerDuty + SMS

## Dashboards (Grafana)

- Urogyn overview (latency, errors, RPS)
- Urogyn per-tenant
- Urogyn per-engine
- Urogyn audit log

## Audit retention

- 7+ years (PDPL)
- Hash-chained (audit_middleware.js)
- Stored in `audit_log` table
