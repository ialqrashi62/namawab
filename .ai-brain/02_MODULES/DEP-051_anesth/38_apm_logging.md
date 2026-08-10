# APM & Logging Plan — Anesth (DEP-051)
**Last updated:** 2026-08-10

## Metrics tracked for Anesth

### Per-route

| Route | Latency p95 | Error rate | RPS |
|---|---|---|---|
| POST /api/dep_051/create | < 200ms | < 0.1% | ? |
| GET /api/dep_051/list | < 100ms | < 0.1% | ? |
| POST /api/dep_051/update | < 200ms | < 0.1% | ? |

### Per-engine

- `Anesth engine` latency, error rate, throughput
- DB query latency (per dept table)
- Cache hit rate (per dept cache)

## Structured logging

```json
{
  "timestamp": "2026-08-10T12:34:56Z",
  "level": "info",
  "service": "nama-medical-erp",
  "dept": "DEP-051",
  "tenant_id": "tnt_123",
  "user_id": "usr_456",
  "request_id": "req_abc",
  "trace_id": "trace_xyz",
  "route": "POST /api/dep_051/create",
  "duration_ms": 45,
  "msg": "Anesth created"
}
```

## Alerts

- Anesth error rate > 5% → PagerDuty
- Anesth p95 latency > 1s → email
- Anesth DB query > 500ms → APM
- Anesth RLS violation → PagerDuty + SMS

## Dashboards (Grafana)

- Anesth overview (latency, errors, RPS)
- Anesth per-tenant
- Anesth per-engine
- Anesth audit log

## Audit retention

- 7+ years (PDPL)
- Hash-chained (audit_middleware.js)
- Stored in `audit_log` table
