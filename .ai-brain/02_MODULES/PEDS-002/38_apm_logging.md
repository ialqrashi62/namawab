# APM & Logging Plan — Peds-002 (PEDS-002)
**Last updated:** 2026-08-10

## Metrics tracked for Peds-002

### Per-route

| Route | Latency p95 | Error rate | RPS |
|---|---|---|---|
| POST /api/peds_002/create | < 200ms | < 0.1% | ? |
| GET /api/peds_002/list | < 100ms | < 0.1% | ? |
| POST /api/peds_002/update | < 200ms | < 0.1% | ? |

### Per-engine

- `Peds-002 engine` latency, error rate, throughput
- DB query latency (per dept table)
- Cache hit rate (per dept cache)

## Structured logging

```json
{
  "timestamp": "2026-08-10T12:34:56Z",
  "level": "info",
  "service": "nama-medical-erp",
  "dept": "PEDS-002",
  "tenant_id": "tnt_123",
  "user_id": "usr_456",
  "request_id": "req_abc",
  "trace_id": "trace_xyz",
  "route": "POST /api/peds_002/create",
  "duration_ms": 45,
  "msg": "Peds-002 created"
}
```

## Alerts

- Peds-002 error rate > 5% → PagerDuty
- Peds-002 p95 latency > 1s → email
- Peds-002 DB query > 500ms → APM
- Peds-002 RLS violation → PagerDuty + SMS

## Dashboards (Grafana)

- Peds-002 overview (latency, errors, RPS)
- Peds-002 per-tenant
- Peds-002 per-engine
- Peds-002 audit log

## Audit retention

- 7+ years (PDPL)
- Hash-chained (audit_middleware.js)
- Stored in `audit_log` table
