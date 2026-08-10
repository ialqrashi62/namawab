# APM & Logging Plan — Fertility (DEP-036)
**Last updated:** 2026-08-10

## Metrics tracked for Fertility

### Per-route

| Route | Latency p95 | Error rate | RPS |
|---|---|---|---|
| POST /api/dep_036/create | < 200ms | < 0.1% | ? |
| GET /api/dep_036/list | < 100ms | < 0.1% | ? |
| POST /api/dep_036/update | < 200ms | < 0.1% | ? |

### Per-engine

- `Fertility engine` latency, error rate, throughput
- DB query latency (per dept table)
- Cache hit rate (per dept cache)

## Structured logging

```json
{
  "timestamp": "2026-08-10T12:34:56Z",
  "level": "info",
  "service": "nama-medical-erp",
  "dept": "DEP-036",
  "tenant_id": "tnt_123",
  "user_id": "usr_456",
  "request_id": "req_abc",
  "trace_id": "trace_xyz",
  "route": "POST /api/dep_036/create",
  "duration_ms": 45,
  "msg": "Fertility created"
}
```

## Alerts

- Fertility error rate > 5% → PagerDuty
- Fertility p95 latency > 1s → email
- Fertility DB query > 500ms → APM
- Fertility RLS violation → PagerDuty + SMS

## Dashboards (Grafana)

- Fertility overview (latency, errors, RPS)
- Fertility per-tenant
- Fertility per-engine
- Fertility audit log

## Audit retention

- 7+ years (PDPL)
- Hash-chained (audit_middleware.js)
- Stored in `audit_log` table
