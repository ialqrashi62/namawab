# APM & Logging Plan — Transplant (DEP-020)
**Last updated:** 2026-08-10

## Metrics tracked for Transplant

### Per-route

| Route | Latency p95 | Error rate | RPS |
|---|---|---|---|
| POST /api/dep_020/create | < 200ms | < 0.1% | ? |
| GET /api/dep_020/list | < 100ms | < 0.1% | ? |
| POST /api/dep_020/update | < 200ms | < 0.1% | ? |

### Per-engine

- `Transplant engine` latency, error rate, throughput
- DB query latency (per dept table)
- Cache hit rate (per dept cache)

## Structured logging

```json
{
  "timestamp": "2026-08-10T12:34:56Z",
  "level": "info",
  "service": "nama-medical-erp",
  "dept": "DEP-020",
  "tenant_id": "tnt_123",
  "user_id": "usr_456",
  "request_id": "req_abc",
  "trace_id": "trace_xyz",
  "route": "POST /api/dep_020/create",
  "duration_ms": 45,
  "msg": "Transplant created"
}
```

## Alerts

- Transplant error rate > 5% → PagerDuty
- Transplant p95 latency > 1s → email
- Transplant DB query > 500ms → APM
- Transplant RLS violation → PagerDuty + SMS

## Dashboards (Grafana)

- Transplant overview (latency, errors, RPS)
- Transplant per-tenant
- Transplant per-engine
- Transplant audit log

## Audit retention

- 7+ years (PDPL)
- Hash-chained (audit_middleware.js)
- Stored in `audit_log` table
