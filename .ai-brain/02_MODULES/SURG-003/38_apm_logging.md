# APM & Logging Plan — Surg-003 (SURG-003)
**Last updated:** 2026-08-10

## Metrics tracked for Surg-003

### Per-route

| Route | Latency p95 | Error rate | RPS |
|---|---|---|---|
| POST /api/surg_003/create | < 200ms | < 0.1% | ? |
| GET /api/surg_003/list | < 100ms | < 0.1% | ? |
| POST /api/surg_003/update | < 200ms | < 0.1% | ? |

### Per-engine

- `Surg-003 engine` latency, error rate, throughput
- DB query latency (per dept table)
- Cache hit rate (per dept cache)

## Structured logging

```json
{
  "timestamp": "2026-08-10T12:34:56Z",
  "level": "info",
  "service": "nama-medical-erp",
  "dept": "SURG-003",
  "tenant_id": "tnt_123",
  "user_id": "usr_456",
  "request_id": "req_abc",
  "trace_id": "trace_xyz",
  "route": "POST /api/surg_003/create",
  "duration_ms": 45,
  "msg": "Surg-003 created"
}
```

## Alerts

- Surg-003 error rate > 5% → PagerDuty
- Surg-003 p95 latency > 1s → email
- Surg-003 DB query > 500ms → APM
- Surg-003 RLS violation → PagerDuty + SMS

## Dashboards (Grafana)

- Surg-003 overview (latency, errors, RPS)
- Surg-003 per-tenant
- Surg-003 per-engine
- Surg-003 audit log

## Audit retention

- 7+ years (PDPL)
- Hash-chained (audit_middleware.js)
- Stored in `audit_log` table
