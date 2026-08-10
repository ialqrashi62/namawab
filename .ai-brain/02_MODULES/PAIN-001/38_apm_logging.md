# APM & Logging Plan — Pain-001 (PAIN-001)
**Last updated:** 2026-08-10

## Metrics tracked for Pain-001

### Per-route

| Route | Latency p95 | Error rate | RPS |
|---|---|---|---|
| POST /api/pain_001/create | < 200ms | < 0.1% | ? |
| GET /api/pain_001/list | < 100ms | < 0.1% | ? |
| POST /api/pain_001/update | < 200ms | < 0.1% | ? |

### Per-engine

- `Pain-001 engine` latency, error rate, throughput
- DB query latency (per dept table)
- Cache hit rate (per dept cache)

## Structured logging

```json
{
  "timestamp": "2026-08-10T12:34:56Z",
  "level": "info",
  "service": "nama-medical-erp",
  "dept": "PAIN-001",
  "tenant_id": "tnt_123",
  "user_id": "usr_456",
  "request_id": "req_abc",
  "trace_id": "trace_xyz",
  "route": "POST /api/pain_001/create",
  "duration_ms": 45,
  "msg": "Pain-001 created"
}
```

## Alerts

- Pain-001 error rate > 5% → PagerDuty
- Pain-001 p95 latency > 1s → email
- Pain-001 DB query > 500ms → APM
- Pain-001 RLS violation → PagerDuty + SMS

## Dashboards (Grafana)

- Pain-001 overview (latency, errors, RPS)
- Pain-001 per-tenant
- Pain-001 per-engine
- Pain-001 audit log

## Audit retention

- 7+ years (PDPL)
- Hash-chained (audit_middleware.js)
- Stored in `audit_log` table
