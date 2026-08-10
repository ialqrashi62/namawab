# APM & Logging Plan — Derm-001 (DERM-001)
**Last updated:** 2026-08-10

## Metrics tracked for Derm-001

### Per-route

| Route | Latency p95 | Error rate | RPS |
|---|---|---|---|
| POST /api/derm_001/create | < 200ms | < 0.1% | ? |
| GET /api/derm_001/list | < 100ms | < 0.1% | ? |
| POST /api/derm_001/update | < 200ms | < 0.1% | ? |

### Per-engine

- `Derm-001 engine` latency, error rate, throughput
- DB query latency (per dept table)
- Cache hit rate (per dept cache)

## Structured logging

```json
{
  "timestamp": "2026-08-10T12:34:56Z",
  "level": "info",
  "service": "nama-medical-erp",
  "dept": "DERM-001",
  "tenant_id": "tnt_123",
  "user_id": "usr_456",
  "request_id": "req_abc",
  "trace_id": "trace_xyz",
  "route": "POST /api/derm_001/create",
  "duration_ms": 45,
  "msg": "Derm-001 created"
}
```

## Alerts

- Derm-001 error rate > 5% → PagerDuty
- Derm-001 p95 latency > 1s → email
- Derm-001 DB query > 500ms → APM
- Derm-001 RLS violation → PagerDuty + SMS

## Dashboards (Grafana)

- Derm-001 overview (latency, errors, RPS)
- Derm-001 per-tenant
- Derm-001 per-engine
- Derm-001 audit log

## Audit retention

- 7+ years (PDPL)
- Hash-chained (audit_middleware.js)
- Stored in `audit_log` table
