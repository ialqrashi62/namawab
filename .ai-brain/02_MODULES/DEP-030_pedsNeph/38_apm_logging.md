# APM & Logging Plan — Pedsneph (DEP-030)
**Last updated:** 2026-08-10

## Metrics tracked for Pedsneph

### Per-route

| Route | Latency p95 | Error rate | RPS |
|---|---|---|---|
| POST /api/dep_030/create | < 200ms | < 0.1% | ? |
| GET /api/dep_030/list | < 100ms | < 0.1% | ? |
| POST /api/dep_030/update | < 200ms | < 0.1% | ? |

### Per-engine

- `Pedsneph engine` latency, error rate, throughput
- DB query latency (per dept table)
- Cache hit rate (per dept cache)

## Structured logging

```json
{
  "timestamp": "2026-08-10T12:34:56Z",
  "level": "info",
  "service": "nama-medical-erp",
  "dept": "DEP-030",
  "tenant_id": "tnt_123",
  "user_id": "usr_456",
  "request_id": "req_abc",
  "trace_id": "trace_xyz",
  "route": "POST /api/dep_030/create",
  "duration_ms": 45,
  "msg": "Pedsneph created"
}
```

## Alerts

- Pedsneph error rate > 5% → PagerDuty
- Pedsneph p95 latency > 1s → email
- Pedsneph DB query > 500ms → APM
- Pedsneph RLS violation → PagerDuty + SMS

## Dashboards (Grafana)

- Pedsneph overview (latency, errors, RPS)
- Pedsneph per-tenant
- Pedsneph per-engine
- Pedsneph audit log

## Audit retention

- 7+ years (PDPL)
- Hash-chained (audit_middleware.js)
- Stored in `audit_log` table
