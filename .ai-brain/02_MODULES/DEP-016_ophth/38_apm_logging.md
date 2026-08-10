# APM & Logging Plan — Ophth (DEP-016)
**Last updated:** 2026-08-10

## Metrics tracked for Ophth

### Per-route

| Route | Latency p95 | Error rate | RPS |
|---|---|---|---|
| POST /api/dep_016/create | < 200ms | < 0.1% | ? |
| GET /api/dep_016/list | < 100ms | < 0.1% | ? |
| POST /api/dep_016/update | < 200ms | < 0.1% | ? |

### Per-engine

- `Ophth engine` latency, error rate, throughput
- DB query latency (per dept table)
- Cache hit rate (per dept cache)

## Structured logging

```json
{
  "timestamp": "2026-08-10T12:34:56Z",
  "level": "info",
  "service": "nama-medical-erp",
  "dept": "DEP-016",
  "tenant_id": "tnt_123",
  "user_id": "usr_456",
  "request_id": "req_abc",
  "trace_id": "trace_xyz",
  "route": "POST /api/dep_016/create",
  "duration_ms": 45,
  "msg": "Ophth created"
}
```

## Alerts

- Ophth error rate > 5% → PagerDuty
- Ophth p95 latency > 1s → email
- Ophth DB query > 500ms → APM
- Ophth RLS violation → PagerDuty + SMS

## Dashboards (Grafana)

- Ophth overview (latency, errors, RPS)
- Ophth per-tenant
- Ophth per-engine
- Ophth audit log

## Audit retention

- 7+ years (PDPL)
- Hash-chained (audit_middleware.js)
- Stored in `audit_log` table
