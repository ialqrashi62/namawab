# APM & Logging Plan — Gi-001 (GI-001)
**Last updated:** 2026-08-10

## Metrics tracked for Gi-001

### Per-route

| Route | Latency p95 | Error rate | RPS |
|---|---|---|---|
| POST /api/gi_001/create | < 200ms | < 0.1% | ? |
| GET /api/gi_001/list | < 100ms | < 0.1% | ? |
| POST /api/gi_001/update | < 200ms | < 0.1% | ? |

### Per-engine

- `Gi-001 engine` latency, error rate, throughput
- DB query latency (per dept table)
- Cache hit rate (per dept cache)

## Structured logging

```json
{
  "timestamp": "2026-08-10T12:34:56Z",
  "level": "info",
  "service": "nama-medical-erp",
  "dept": "GI-001",
  "tenant_id": "tnt_123",
  "user_id": "usr_456",
  "request_id": "req_abc",
  "trace_id": "trace_xyz",
  "route": "POST /api/gi_001/create",
  "duration_ms": 45,
  "msg": "Gi-001 created"
}
```

## Alerts

- Gi-001 error rate > 5% → PagerDuty
- Gi-001 p95 latency > 1s → email
- Gi-001 DB query > 500ms → APM
- Gi-001 RLS violation → PagerDuty + SMS

## Dashboards (Grafana)

- Gi-001 overview (latency, errors, RPS)
- Gi-001 per-tenant
- Gi-001 per-engine
- Gi-001 audit log

## Audit retention

- 7+ years (PDPL)
- Hash-chained (audit_middleware.js)
- Stored in `audit_log` table
