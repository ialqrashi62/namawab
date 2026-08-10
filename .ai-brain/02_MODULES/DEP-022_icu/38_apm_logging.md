# APM & Logging Plan — Icu (DEP-022)
**Last updated:** 2026-08-10

## Metrics tracked for Icu

### Per-route

| Route | Latency p95 | Error rate | RPS |
|---|---|---|---|
| POST /api/dep_022/create | < 200ms | < 0.1% | ? |
| GET /api/dep_022/list | < 100ms | < 0.1% | ? |
| POST /api/dep_022/update | < 200ms | < 0.1% | ? |

### Per-engine

- `Icu engine` latency, error rate, throughput
- DB query latency (per dept table)
- Cache hit rate (per dept cache)

## Structured logging

```json
{
  "timestamp": "2026-08-10T12:34:56Z",
  "level": "info",
  "service": "nama-medical-erp",
  "dept": "DEP-022",
  "tenant_id": "tnt_123",
  "user_id": "usr_456",
  "request_id": "req_abc",
  "trace_id": "trace_xyz",
  "route": "POST /api/dep_022/create",
  "duration_ms": 45,
  "msg": "Icu created"
}
```

## Alerts

- Icu error rate > 5% → PagerDuty
- Icu p95 latency > 1s → email
- Icu DB query > 500ms → APM
- Icu RLS violation → PagerDuty + SMS

## Dashboards (Grafana)

- Icu overview (latency, errors, RPS)
- Icu per-tenant
- Icu per-engine
- Icu audit log

## Audit retention

- 7+ years (PDPL)
- Hash-chained (audit_middleware.js)
- Stored in `audit_log` table
