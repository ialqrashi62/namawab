# APM & Logging Plan — Psychol (DEP-045)
**Last updated:** 2026-08-10

## Metrics tracked for Psychol

### Per-route

| Route | Latency p95 | Error rate | RPS |
|---|---|---|---|
| POST /api/dep_045/create | < 200ms | < 0.1% | ? |
| GET /api/dep_045/list | < 100ms | < 0.1% | ? |
| POST /api/dep_045/update | < 200ms | < 0.1% | ? |

### Per-engine

- `Psychol engine` latency, error rate, throughput
- DB query latency (per dept table)
- Cache hit rate (per dept cache)

## Structured logging

```json
{
  "timestamp": "2026-08-10T12:34:56Z",
  "level": "info",
  "service": "nama-medical-erp",
  "dept": "DEP-045",
  "tenant_id": "tnt_123",
  "user_id": "usr_456",
  "request_id": "req_abc",
  "trace_id": "trace_xyz",
  "route": "POST /api/dep_045/create",
  "duration_ms": 45,
  "msg": "Psychol created"
}
```

## Alerts

- Psychol error rate > 5% → PagerDuty
- Psychol p95 latency > 1s → email
- Psychol DB query > 500ms → APM
- Psychol RLS violation → PagerDuty + SMS

## Dashboards (Grafana)

- Psychol overview (latency, errors, RPS)
- Psychol per-tenant
- Psychol per-engine
- Psychol audit log

## Audit retention

- 7+ years (PDPL)
- Hash-chained (audit_middleware.js)
- Stored in `audit_log` table
