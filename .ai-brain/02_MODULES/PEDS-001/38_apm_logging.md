# APM & Logging Plan — Peds-001 (PEDS-001)
**Last updated:** 2026-08-10

## Metrics tracked for Peds-001

### Per-route

| Route | Latency p95 | Error rate | RPS |
|---|---|---|---|
| POST /api/peds_001/create | < 200ms | < 0.1% | ? |
| GET /api/peds_001/list | < 100ms | < 0.1% | ? |
| POST /api/peds_001/update | < 200ms | < 0.1% | ? |

### Per-engine

- `Peds-001 engine` latency, error rate, throughput
- DB query latency (per dept table)
- Cache hit rate (per dept cache)

## Structured logging

```json
{
  "timestamp": "2026-08-10T12:34:56Z",
  "level": "info",
  "service": "nama-medical-erp",
  "dept": "PEDS-001",
  "tenant_id": "tnt_123",
  "user_id": "usr_456",
  "request_id": "req_abc",
  "trace_id": "trace_xyz",
  "route": "POST /api/peds_001/create",
  "duration_ms": 45,
  "msg": "Peds-001 created"
}
```

## Alerts

- Peds-001 error rate > 5% → PagerDuty
- Peds-001 p95 latency > 1s → email
- Peds-001 DB query > 500ms → APM
- Peds-001 RLS violation → PagerDuty + SMS

## Dashboards (Grafana)

- Peds-001 overview (latency, errors, RPS)
- Peds-001 per-tenant
- Peds-001 per-engine
- Peds-001 audit log

## Audit retention

- 7+ years (PDPL)
- Hash-chained (audit_middleware.js)
- Stored in `audit_log` table
