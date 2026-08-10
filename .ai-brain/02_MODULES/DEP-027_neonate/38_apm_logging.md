# APM & Logging Plan — Neonate (DEP-027)
**Last updated:** 2026-08-10

## Metrics tracked for Neonate

### Per-route

| Route | Latency p95 | Error rate | RPS |
|---|---|---|---|
| POST /api/dep_027/create | < 200ms | < 0.1% | ? |
| GET /api/dep_027/list | < 100ms | < 0.1% | ? |
| POST /api/dep_027/update | < 200ms | < 0.1% | ? |

### Per-engine

- `Neonate engine` latency, error rate, throughput
- DB query latency (per dept table)
- Cache hit rate (per dept cache)

## Structured logging

```json
{
  "timestamp": "2026-08-10T12:34:56Z",
  "level": "info",
  "service": "nama-medical-erp",
  "dept": "DEP-027",
  "tenant_id": "tnt_123",
  "user_id": "usr_456",
  "request_id": "req_abc",
  "trace_id": "trace_xyz",
  "route": "POST /api/dep_027/create",
  "duration_ms": 45,
  "msg": "Neonate created"
}
```

## Alerts

- Neonate error rate > 5% → PagerDuty
- Neonate p95 latency > 1s → email
- Neonate DB query > 500ms → APM
- Neonate RLS violation → PagerDuty + SMS

## Dashboards (Grafana)

- Neonate overview (latency, errors, RPS)
- Neonate per-tenant
- Neonate per-engine
- Neonate audit log

## Audit retention

- 7+ years (PDPL)
- Hash-chained (audit_middleware.js)
- Stored in `audit_log` table
