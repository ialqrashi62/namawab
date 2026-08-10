# APM & Logging Plan — Surg-010 (SURG-010)
**Last updated:** 2026-08-10

## Metrics tracked for Surg-010

### Per-route

| Route | Latency p95 | Error rate | RPS |
|---|---|---|---|
| POST /api/surg_010/create | < 200ms | < 0.1% | ? |
| GET /api/surg_010/list | < 100ms | < 0.1% | ? |
| POST /api/surg_010/update | < 200ms | < 0.1% | ? |

### Per-engine

- `Surg-010 engine` latency, error rate, throughput
- DB query latency (per dept table)
- Cache hit rate (per dept cache)

## Structured logging

```json
{
  "timestamp": "2026-08-10T12:34:56Z",
  "level": "info",
  "service": "nama-medical-erp",
  "dept": "SURG-010",
  "tenant_id": "tnt_123",
  "user_id": "usr_456",
  "request_id": "req_abc",
  "trace_id": "trace_xyz",
  "route": "POST /api/surg_010/create",
  "duration_ms": 45,
  "msg": "Surg-010 created"
}
```

## Alerts

- Surg-010 error rate > 5% → PagerDuty
- Surg-010 p95 latency > 1s → email
- Surg-010 DB query > 500ms → APM
- Surg-010 RLS violation → PagerDuty + SMS

## Dashboards (Grafana)

- Surg-010 overview (latency, errors, RPS)
- Surg-010 per-tenant
- Surg-010 per-engine
- Surg-010 audit log

## Audit retention

- 7+ years (PDPL)
- Hash-chained (audit_middleware.js)
- Stored in `audit_log` table
