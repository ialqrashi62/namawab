# APM & Logging Plan — Er-004 (ER-004)
**Last updated:** 2026-08-10

## Metrics tracked for Er-004

### Per-route

| Route | Latency p95 | Error rate | RPS |
|---|---|---|---|
| POST /api/er_004/create | < 200ms | < 0.1% | ? |
| GET /api/er_004/list | < 100ms | < 0.1% | ? |
| POST /api/er_004/update | < 200ms | < 0.1% | ? |

### Per-engine

- `Er-004 engine` latency, error rate, throughput
- DB query latency (per dept table)
- Cache hit rate (per dept cache)

## Structured logging

```json
{
  "timestamp": "2026-08-10T12:34:56Z",
  "level": "info",
  "service": "nama-medical-erp",
  "dept": "ER-004",
  "tenant_id": "tnt_123",
  "user_id": "usr_456",
  "request_id": "req_abc",
  "trace_id": "trace_xyz",
  "route": "POST /api/er_004/create",
  "duration_ms": 45,
  "msg": "Er-004 created"
}
```

## Alerts

- Er-004 error rate > 5% → PagerDuty
- Er-004 p95 latency > 1s → email
- Er-004 DB query > 500ms → APM
- Er-004 RLS violation → PagerDuty + SMS

## Dashboards (Grafana)

- Er-004 overview (latency, errors, RPS)
- Er-004 per-tenant
- Er-004 per-engine
- Er-004 audit log

## Audit retention

- 7+ years (PDPL)
- Hash-chained (audit_middleware.js)
- Stored in `audit_log` table
