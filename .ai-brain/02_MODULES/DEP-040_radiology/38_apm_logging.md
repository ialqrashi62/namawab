# APM & Logging Plan — Radiology (DEP-040)
**Last updated:** 2026-08-10

## Metrics tracked for Radiology

### Per-route

| Route | Latency p95 | Error rate | RPS |
|---|---|---|---|
| POST /api/dep_040/create | < 200ms | < 0.1% | ? |
| GET /api/dep_040/list | < 100ms | < 0.1% | ? |
| POST /api/dep_040/update | < 200ms | < 0.1% | ? |

### Per-engine

- `Radiology engine` latency, error rate, throughput
- DB query latency (per dept table)
- Cache hit rate (per dept cache)

## Structured logging

```json
{
  "timestamp": "2026-08-10T12:34:56Z",
  "level": "info",
  "service": "nama-medical-erp",
  "dept": "DEP-040",
  "tenant_id": "tnt_123",
  "user_id": "usr_456",
  "request_id": "req_abc",
  "trace_id": "trace_xyz",
  "route": "POST /api/dep_040/create",
  "duration_ms": 45,
  "msg": "Radiology created"
}
```

## Alerts

- Radiology error rate > 5% → PagerDuty
- Radiology p95 latency > 1s → email
- Radiology DB query > 500ms → APM
- Radiology RLS violation → PagerDuty + SMS

## Dashboards (Grafana)

- Radiology overview (latency, errors, RPS)
- Radiology per-tenant
- Radiology per-engine
- Radiology audit log

## Audit retention

- 7+ years (PDPL)
- Hash-chained (audit_middleware.js)
- Stored in `audit_log` table
