# APM & Logging Plan — Prev-001 (PREV-001)
**Last updated:** 2026-08-10

## Metrics tracked for Prev-001

### Per-route

| Route | Latency p95 | Error rate | RPS |
|---|---|---|---|
| POST /api/prev_001/create | < 200ms | < 0.1% | ? |
| GET /api/prev_001/list | < 100ms | < 0.1% | ? |
| POST /api/prev_001/update | < 200ms | < 0.1% | ? |

### Per-engine

- `Prev-001 engine` latency, error rate, throughput
- DB query latency (per dept table)
- Cache hit rate (per dept cache)

## Structured logging

```json
{
  "timestamp": "2026-08-10T12:34:56Z",
  "level": "info",
  "service": "nama-medical-erp",
  "dept": "PREV-001",
  "tenant_id": "tnt_123",
  "user_id": "usr_456",
  "request_id": "req_abc",
  "trace_id": "trace_xyz",
  "route": "POST /api/prev_001/create",
  "duration_ms": 45,
  "msg": "Prev-001 created"
}
```

## Alerts

- Prev-001 error rate > 5% → PagerDuty
- Prev-001 p95 latency > 1s → email
- Prev-001 DB query > 500ms → APM
- Prev-001 RLS violation → PagerDuty + SMS

## Dashboards (Grafana)

- Prev-001 overview (latency, errors, RPS)
- Prev-001 per-tenant
- Prev-001 per-engine
- Prev-001 audit log

## Audit retention

- 7+ years (PDPL)
- Hash-chained (audit_middleware.js)
- Stored in `audit_log` table
