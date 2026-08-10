# APM & Logging Plan — Pulm-001 (PULM-001)
**Last updated:** 2026-08-10

## Metrics tracked for Pulm-001

### Per-route

| Route | Latency p95 | Error rate | RPS |
|---|---|---|---|
| POST /api/pulm_001/create | < 200ms | < 0.1% | ? |
| GET /api/pulm_001/list | < 100ms | < 0.1% | ? |
| POST /api/pulm_001/update | < 200ms | < 0.1% | ? |

### Per-engine

- `Pulm-001 engine` latency, error rate, throughput
- DB query latency (per dept table)
- Cache hit rate (per dept cache)

## Structured logging

```json
{
  "timestamp": "2026-08-10T12:34:56Z",
  "level": "info",
  "service": "nama-medical-erp",
  "dept": "PULM-001",
  "tenant_id": "tnt_123",
  "user_id": "usr_456",
  "request_id": "req_abc",
  "trace_id": "trace_xyz",
  "route": "POST /api/pulm_001/create",
  "duration_ms": 45,
  "msg": "Pulm-001 created"
}
```

## Alerts

- Pulm-001 error rate > 5% → PagerDuty
- Pulm-001 p95 latency > 1s → email
- Pulm-001 DB query > 500ms → APM
- Pulm-001 RLS violation → PagerDuty + SMS

## Dashboards (Grafana)

- Pulm-001 overview (latency, errors, RPS)
- Pulm-001 per-tenant
- Pulm-001 per-engine
- Pulm-001 audit log

## Audit retention

- 7+ years (PDPL)
- Hash-chained (audit_middleware.js)
- Stored in `audit_log` table
