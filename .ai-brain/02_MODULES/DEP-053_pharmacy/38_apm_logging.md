# APM & Logging Plan — Pharmacy (DEP-053)
**Last updated:** 2026-08-10

## Metrics tracked for Pharmacy

### Per-route

| Route | Latency p95 | Error rate | RPS |
|---|---|---|---|
| POST /api/dep_053/create | < 200ms | < 0.1% | ? |
| GET /api/dep_053/list | < 100ms | < 0.1% | ? |
| POST /api/dep_053/update | < 200ms | < 0.1% | ? |

### Per-engine

- `Pharmacy engine` latency, error rate, throughput
- DB query latency (per dept table)
- Cache hit rate (per dept cache)

## Structured logging

```json
{
  "timestamp": "2026-08-10T12:34:56Z",
  "level": "info",
  "service": "nama-medical-erp",
  "dept": "DEP-053",
  "tenant_id": "tnt_123",
  "user_id": "usr_456",
  "request_id": "req_abc",
  "trace_id": "trace_xyz",
  "route": "POST /api/dep_053/create",
  "duration_ms": 45,
  "msg": "Pharmacy created"
}
```

## Alerts

- Pharmacy error rate > 5% → PagerDuty
- Pharmacy p95 latency > 1s → email
- Pharmacy DB query > 500ms → APM
- Pharmacy RLS violation → PagerDuty + SMS

## Dashboards (Grafana)

- Pharmacy overview (latency, errors, RPS)
- Pharmacy per-tenant
- Pharmacy per-engine
- Pharmacy audit log

## Audit retention

- 7+ years (PDPL)
- Hash-chained (audit_middleware.js)
- Stored in `audit_log` table
