# APM & Logging Plan — Peds (DEP-026)
**Last updated:** 2026-08-10

## Metrics tracked for Peds

### Per-route

| Route | Latency p95 | Error rate | RPS |
|---|---|---|---|
| POST /api/dep_026/create | < 200ms | < 0.1% | ? |
| GET /api/dep_026/list | < 100ms | < 0.1% | ? |
| POST /api/dep_026/update | < 200ms | < 0.1% | ? |

### Per-engine

- `Peds engine` latency, error rate, throughput
- DB query latency (per dept table)
- Cache hit rate (per dept cache)

## Structured logging

```json
{
  "timestamp": "2026-08-10T12:34:56Z",
  "level": "info",
  "service": "nama-medical-erp",
  "dept": "DEP-026",
  "tenant_id": "tnt_123",
  "user_id": "usr_456",
  "request_id": "req_abc",
  "trace_id": "trace_xyz",
  "route": "POST /api/dep_026/create",
  "duration_ms": 45,
  "msg": "Peds created"
}
```

## Alerts

- Peds error rate > 5% → PagerDuty
- Peds p95 latency > 1s → email
- Peds DB query > 500ms → APM
- Peds RLS violation → PagerDuty + SMS

## Dashboards (Grafana)

- Peds overview (latency, errors, RPS)
- Peds per-tenant
- Peds per-engine
- Peds audit log

## Audit retention

- 7+ years (PDPL)
- Hash-chained (audit_middleware.js)
- Stored in `audit_log` table
