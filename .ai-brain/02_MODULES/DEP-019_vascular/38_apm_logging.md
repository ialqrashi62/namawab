# APM & Logging Plan — Vascular (DEP-019)
**Last updated:** 2026-08-10

## Metrics tracked for Vascular

### Per-route

| Route | Latency p95 | Error rate | RPS |
|---|---|---|---|
| POST /api/dep_019/create | < 200ms | < 0.1% | ? |
| GET /api/dep_019/list | < 100ms | < 0.1% | ? |
| POST /api/dep_019/update | < 200ms | < 0.1% | ? |

### Per-engine

- `Vascular engine` latency, error rate, throughput
- DB query latency (per dept table)
- Cache hit rate (per dept cache)

## Structured logging

```json
{
  "timestamp": "2026-08-10T12:34:56Z",
  "level": "info",
  "service": "nama-medical-erp",
  "dept": "DEP-019",
  "tenant_id": "tnt_123",
  "user_id": "usr_456",
  "request_id": "req_abc",
  "trace_id": "trace_xyz",
  "route": "POST /api/dep_019/create",
  "duration_ms": 45,
  "msg": "Vascular created"
}
```

## Alerts

- Vascular error rate > 5% → PagerDuty
- Vascular p95 latency > 1s → email
- Vascular DB query > 500ms → APM
- Vascular RLS violation → PagerDuty + SMS

## Dashboards (Grafana)

- Vascular overview (latency, errors, RPS)
- Vascular per-tenant
- Vascular per-engine
- Vascular audit log

## Audit retention

- 7+ years (PDPL)
- Hash-chained (audit_middleware.js)
- Stored in `audit_log` table
