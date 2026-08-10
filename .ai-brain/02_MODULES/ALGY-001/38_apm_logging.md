# APM & Logging Plan — Algy-001 (ALGY-001)
**Last updated:** 2026-08-10

## Metrics tracked for Algy-001

### Per-route

| Route | Latency p95 | Error rate | RPS |
|---|---|---|---|
| POST /api/algy_001/create | < 200ms | < 0.1% | ? |
| GET /api/algy_001/list | < 100ms | < 0.1% | ? |
| POST /api/algy_001/update | < 200ms | < 0.1% | ? |

### Per-engine

- `Algy-001 engine` latency, error rate, throughput
- DB query latency (per dept table)
- Cache hit rate (per dept cache)

## Structured logging

```json
{
  "timestamp": "2026-08-10T12:34:56Z",
  "level": "info",
  "service": "nama-medical-erp",
  "dept": "ALGY-001",
  "tenant_id": "tnt_123",
  "user_id": "usr_456",
  "request_id": "req_abc",
  "trace_id": "trace_xyz",
  "route": "POST /api/algy_001/create",
  "duration_ms": 45,
  "msg": "Algy-001 created"
}
```

## Alerts

- Algy-001 error rate > 5% → PagerDuty
- Algy-001 p95 latency > 1s → email
- Algy-001 DB query > 500ms → APM
- Algy-001 RLS violation → PagerDuty + SMS

## Dashboards (Grafana)

- Algy-001 overview (latency, errors, RPS)
- Algy-001 per-tenant
- Algy-001 per-engine
- Algy-001 audit log

## Audit retention

- 7+ years (PDPL)
- Hash-chained (audit_middleware.js)
- Stored in `audit_log` table
