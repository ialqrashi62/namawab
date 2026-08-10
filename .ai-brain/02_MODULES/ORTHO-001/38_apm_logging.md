# APM & Logging Plan — Ortho-001 (ORTHO-001)
**Last updated:** 2026-08-10

## Metrics tracked for Ortho-001

### Per-route

| Route | Latency p95 | Error rate | RPS |
|---|---|---|---|
| POST /api/ortho_001/create | < 200ms | < 0.1% | ? |
| GET /api/ortho_001/list | < 100ms | < 0.1% | ? |
| POST /api/ortho_001/update | < 200ms | < 0.1% | ? |

### Per-engine

- `Ortho-001 engine` latency, error rate, throughput
- DB query latency (per dept table)
- Cache hit rate (per dept cache)

## Structured logging

```json
{
  "timestamp": "2026-08-10T12:34:56Z",
  "level": "info",
  "service": "nama-medical-erp",
  "dept": "ORTHO-001",
  "tenant_id": "tnt_123",
  "user_id": "usr_456",
  "request_id": "req_abc",
  "trace_id": "trace_xyz",
  "route": "POST /api/ortho_001/create",
  "duration_ms": 45,
  "msg": "Ortho-001 created"
}
```

## Alerts

- Ortho-001 error rate > 5% → PagerDuty
- Ortho-001 p95 latency > 1s → email
- Ortho-001 DB query > 500ms → APM
- Ortho-001 RLS violation → PagerDuty + SMS

## Dashboards (Grafana)

- Ortho-001 overview (latency, errors, RPS)
- Ortho-001 per-tenant
- Ortho-001 per-engine
- Ortho-001 audit log

## Audit retention

- 7+ years (PDPL)
- Hash-chained (audit_middleware.js)
- Stored in `audit_log` table
