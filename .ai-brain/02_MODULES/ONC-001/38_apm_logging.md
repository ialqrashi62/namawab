# APM & Logging Plan — Onc-001 (ONC-001)
**Last updated:** 2026-08-10

## Metrics tracked for Onc-001

### Per-route

| Route | Latency p95 | Error rate | RPS |
|---|---|---|---|
| POST /api/onc_001/create | < 200ms | < 0.1% | ? |
| GET /api/onc_001/list | < 100ms | < 0.1% | ? |
| POST /api/onc_001/update | < 200ms | < 0.1% | ? |

### Per-engine

- `Onc-001 engine` latency, error rate, throughput
- DB query latency (per dept table)
- Cache hit rate (per dept cache)

## Structured logging

```json
{
  "timestamp": "2026-08-10T12:34:56Z",
  "level": "info",
  "service": "nama-medical-erp",
  "dept": "ONC-001",
  "tenant_id": "tnt_123",
  "user_id": "usr_456",
  "request_id": "req_abc",
  "trace_id": "trace_xyz",
  "route": "POST /api/onc_001/create",
  "duration_ms": 45,
  "msg": "Onc-001 created"
}
```

## Alerts

- Onc-001 error rate > 5% → PagerDuty
- Onc-001 p95 latency > 1s → email
- Onc-001 DB query > 500ms → APM
- Onc-001 RLS violation → PagerDuty + SMS

## Dashboards (Grafana)

- Onc-001 overview (latency, errors, RPS)
- Onc-001 per-tenant
- Onc-001 per-engine
- Onc-001 audit log

## Audit retention

- 7+ years (PDPL)
- Hash-chained (audit_middleware.js)
- Stored in `audit_log` table
