# APM & Logging Plan — Radonc (DEP-049)
**Last updated:** 2026-08-10

## Metrics tracked for Radonc

### Per-route

| Route | Latency p95 | Error rate | RPS |
|---|---|---|---|
| POST /api/dep_049/create | < 200ms | < 0.1% | ? |
| GET /api/dep_049/list | < 100ms | < 0.1% | ? |
| POST /api/dep_049/update | < 200ms | < 0.1% | ? |

### Per-engine

- `Radonc engine` latency, error rate, throughput
- DB query latency (per dept table)
- Cache hit rate (per dept cache)

## Structured logging

```json
{
  "timestamp": "2026-08-10T12:34:56Z",
  "level": "info",
  "service": "nama-medical-erp",
  "dept": "DEP-049",
  "tenant_id": "tnt_123",
  "user_id": "usr_456",
  "request_id": "req_abc",
  "trace_id": "trace_xyz",
  "route": "POST /api/dep_049/create",
  "duration_ms": 45,
  "msg": "Radonc created"
}
```

## Alerts

- Radonc error rate > 5% → PagerDuty
- Radonc p95 latency > 1s → email
- Radonc DB query > 500ms → APM
- Radonc RLS violation → PagerDuty + SMS

## Dashboards (Grafana)

- Radonc overview (latency, errors, RPS)
- Radonc per-tenant
- Radonc per-engine
- Radonc audit log

## Audit retention

- 7+ years (PDPL)
- Hash-chained (audit_middleware.js)
- Stored in `audit_log` table
