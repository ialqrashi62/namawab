# APM & Logging Plan — Picu (PICU)
**Last updated:** 2026-08-10

## Metrics tracked for Picu

### Per-route

| Route | Latency p95 | Error rate | RPS |
|---|---|---|---|
| POST /api/picu/create | < 200ms | < 0.1% | ? |
| GET /api/picu/list | < 100ms | < 0.1% | ? |
| POST /api/picu/update | < 200ms | < 0.1% | ? |

### Per-engine

- `Picu engine` latency, error rate, throughput
- DB query latency (per dept table)
- Cache hit rate (per dept cache)

## Structured logging

```json
{
  "timestamp": "2026-08-10T12:34:56Z",
  "level": "info",
  "service": "nama-medical-erp",
  "dept": "PICU",
  "tenant_id": "tnt_123",
  "user_id": "usr_456",
  "request_id": "req_abc",
  "trace_id": "trace_xyz",
  "route": "POST /api/picu/create",
  "duration_ms": 45,
  "msg": "Picu created"
}
```

## Alerts

- Picu error rate > 5% → PagerDuty
- Picu p95 latency > 1s → email
- Picu DB query > 500ms → APM
- Picu RLS violation → PagerDuty + SMS

## Dashboards (Grafana)

- Picu overview (latency, errors, RPS)
- Picu per-tenant
- Picu per-engine
- Picu audit log

## Audit retention

- 7+ years (PDPL)
- Hash-chained (audit_middleware.js)
- Stored in `audit_log` table
