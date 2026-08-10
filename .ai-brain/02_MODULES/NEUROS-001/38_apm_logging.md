# APM & Logging Plan — Neuros-001 (NEUROS-001)
**Last updated:** 2026-08-10

## Metrics tracked for Neuros-001

### Per-route

| Route | Latency p95 | Error rate | RPS |
|---|---|---|---|
| POST /api/neuros_001/create | < 200ms | < 0.1% | ? |
| GET /api/neuros_001/list | < 100ms | < 0.1% | ? |
| POST /api/neuros_001/update | < 200ms | < 0.1% | ? |

### Per-engine

- `Neuros-001 engine` latency, error rate, throughput
- DB query latency (per dept table)
- Cache hit rate (per dept cache)

## Structured logging

```json
{
  "timestamp": "2026-08-10T12:34:56Z",
  "level": "info",
  "service": "nama-medical-erp",
  "dept": "NEUROS-001",
  "tenant_id": "tnt_123",
  "user_id": "usr_456",
  "request_id": "req_abc",
  "trace_id": "trace_xyz",
  "route": "POST /api/neuros_001/create",
  "duration_ms": 45,
  "msg": "Neuros-001 created"
}
```

## Alerts

- Neuros-001 error rate > 5% → PagerDuty
- Neuros-001 p95 latency > 1s → email
- Neuros-001 DB query > 500ms → APM
- Neuros-001 RLS violation → PagerDuty + SMS

## Dashboards (Grafana)

- Neuros-001 overview (latency, errors, RPS)
- Neuros-001 per-tenant
- Neuros-001 per-engine
- Neuros-001 audit log

## Audit retention

- 7+ years (PDPL)
- Hash-chained (audit_middleware.js)
- Stored in `audit_log` table
