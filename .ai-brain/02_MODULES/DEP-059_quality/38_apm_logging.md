# APM & Logging Plan — Quality (DEP-059)
**Last updated:** 2026-08-10

## Metrics tracked for Quality

### Per-route

| Route | Latency p95 | Error rate | RPS |
|---|---|---|---|
| POST /api/dep_059/create | < 200ms | < 0.1% | ? |
| GET /api/dep_059/list | < 100ms | < 0.1% | ? |
| POST /api/dep_059/update | < 200ms | < 0.1% | ? |

### Per-engine

- `Quality engine` latency, error rate, throughput
- DB query latency (per dept table)
- Cache hit rate (per dept cache)

## Structured logging

```json
{
  "timestamp": "2026-08-10T12:34:56Z",
  "level": "info",
  "service": "nama-medical-erp",
  "dept": "DEP-059",
  "tenant_id": "tnt_123",
  "user_id": "usr_456",
  "request_id": "req_abc",
  "trace_id": "trace_xyz",
  "route": "POST /api/dep_059/create",
  "duration_ms": 45,
  "msg": "Quality created"
}
```

## Alerts

- Quality error rate > 5% → PagerDuty
- Quality p95 latency > 1s → email
- Quality DB query > 500ms → APM
- Quality RLS violation → PagerDuty + SMS

## Dashboards (Grafana)

- Quality overview (latency, errors, RPS)
- Quality per-tenant
- Quality per-engine
- Quality audit log

## Audit retention

- 7+ years (PDPL)
- Hash-chained (audit_middleware.js)
- Stored in `audit_log` table
