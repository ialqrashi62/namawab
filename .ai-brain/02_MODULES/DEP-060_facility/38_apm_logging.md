# APM & Logging Plan — Facility (DEP-060)
**Last updated:** 2026-08-10

## Metrics tracked for Facility

### Per-route

| Route | Latency p95 | Error rate | RPS |
|---|---|---|---|
| POST /api/dep_060/create | < 200ms | < 0.1% | ? |
| GET /api/dep_060/list | < 100ms | < 0.1% | ? |
| POST /api/dep_060/update | < 200ms | < 0.1% | ? |

### Per-engine

- `Facility engine` latency, error rate, throughput
- DB query latency (per dept table)
- Cache hit rate (per dept cache)

## Structured logging

```json
{
  "timestamp": "2026-08-10T12:34:56Z",
  "level": "info",
  "service": "nama-medical-erp",
  "dept": "DEP-060",
  "tenant_id": "tnt_123",
  "user_id": "usr_456",
  "request_id": "req_abc",
  "trace_id": "trace_xyz",
  "route": "POST /api/dep_060/create",
  "duration_ms": 45,
  "msg": "Facility created"
}
```

## Alerts

- Facility error rate > 5% → PagerDuty
- Facility p95 latency > 1s → email
- Facility DB query > 500ms → APM
- Facility RLS violation → PagerDuty + SMS

## Dashboards (Grafana)

- Facility overview (latency, errors, RPS)
- Facility per-tenant
- Facility per-engine
- Facility audit log

## Audit retention

- 7+ years (PDPL)
- Hash-chained (audit_middleware.js)
- Stored in `audit_log` table
