# APM & Logging Plan — Anes-001 (ANES-001)
**Last updated:** 2026-08-10

## Metrics tracked for Anes-001

### Per-route

| Route | Latency p95 | Error rate | RPS |
|---|---|---|---|
| POST /api/anes_001/create | < 200ms | < 0.1% | ? |
| GET /api/anes_001/list | < 100ms | < 0.1% | ? |
| POST /api/anes_001/update | < 200ms | < 0.1% | ? |

### Per-engine

- `Anes-001 engine` latency, error rate, throughput
- DB query latency (per dept table)
- Cache hit rate (per dept cache)

## Structured logging

```json
{
  "timestamp": "2026-08-10T12:34:56Z",
  "level": "info",
  "service": "nama-medical-erp",
  "dept": "ANES-001",
  "tenant_id": "tnt_123",
  "user_id": "usr_456",
  "request_id": "req_abc",
  "trace_id": "trace_xyz",
  "route": "POST /api/anes_001/create",
  "duration_ms": 45,
  "msg": "Anes-001 created"
}
```

## Alerts

- Anes-001 error rate > 5% → PagerDuty
- Anes-001 p95 latency > 1s → email
- Anes-001 DB query > 500ms → APM
- Anes-001 RLS violation → PagerDuty + SMS

## Dashboards (Grafana)

- Anes-001 overview (latency, errors, RPS)
- Anes-001 per-tenant
- Anes-001 per-engine
- Anes-001 audit log

## Audit retention

- 7+ years (PDPL)
- Hash-chained (audit_middleware.js)
- Stored in `audit_log` table
