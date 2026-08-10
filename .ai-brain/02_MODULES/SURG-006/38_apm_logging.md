# APM & Logging Plan — Surg-006 (SURG-006)
**Last updated:** 2026-08-10

## Metrics tracked for Surg-006

### Per-route

| Route | Latency p95 | Error rate | RPS |
|---|---|---|---|
| POST /api/surg_006/create | < 200ms | < 0.1% | ? |
| GET /api/surg_006/list | < 100ms | < 0.1% | ? |
| POST /api/surg_006/update | < 200ms | < 0.1% | ? |

### Per-engine

- `Surg-006 engine` latency, error rate, throughput
- DB query latency (per dept table)
- Cache hit rate (per dept cache)

## Structured logging

```json
{
  "timestamp": "2026-08-10T12:34:56Z",
  "level": "info",
  "service": "nama-medical-erp",
  "dept": "SURG-006",
  "tenant_id": "tnt_123",
  "user_id": "usr_456",
  "request_id": "req_abc",
  "trace_id": "trace_xyz",
  "route": "POST /api/surg_006/create",
  "duration_ms": 45,
  "msg": "Surg-006 created"
}
```

## Alerts

- Surg-006 error rate > 5% → PagerDuty
- Surg-006 p95 latency > 1s → email
- Surg-006 DB query > 500ms → APM
- Surg-006 RLS violation → PagerDuty + SMS

## Dashboards (Grafana)

- Surg-006 overview (latency, errors, RPS)
- Surg-006 per-tenant
- Surg-006 per-engine
- Surg-006 audit log

## Audit retention

- 7+ years (PDPL)
- Hash-chained (audit_middleware.js)
- Stored in `audit_log` table
