# APM & Logging Plan — Gensurg (DEP-011)
**Last updated:** 2026-08-10

## Metrics tracked for Gensurg

### Per-route

| Route | Latency p95 | Error rate | RPS |
|---|---|---|---|
| POST /api/dep_011/create | < 200ms | < 0.1% | ? |
| GET /api/dep_011/list | < 100ms | < 0.1% | ? |
| POST /api/dep_011/update | < 200ms | < 0.1% | ? |

### Per-engine

- `Gensurg engine` latency, error rate, throughput
- DB query latency (per dept table)
- Cache hit rate (per dept cache)

## Structured logging

```json
{
  "timestamp": "2026-08-10T12:34:56Z",
  "level": "info",
  "service": "nama-medical-erp",
  "dept": "DEP-011",
  "tenant_id": "tnt_123",
  "user_id": "usr_456",
  "request_id": "req_abc",
  "trace_id": "trace_xyz",
  "route": "POST /api/dep_011/create",
  "duration_ms": 45,
  "msg": "Gensurg created"
}
```

## Alerts

- Gensurg error rate > 5% → PagerDuty
- Gensurg p95 latency > 1s → email
- Gensurg DB query > 500ms → APM
- Gensurg RLS violation → PagerDuty + SMS

## Dashboards (Grafana)

- Gensurg overview (latency, errors, RPS)
- Gensurg per-tenant
- Gensurg per-engine
- Gensurg audit log

## Audit retention

- 7+ years (PDPL)
- Hash-chained (audit_middleware.js)
- Stored in `audit_log` table
