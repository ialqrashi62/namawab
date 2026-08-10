# APM & Logging Plan — Nnicu (NNICU)
**Last updated:** 2026-08-10

## Metrics tracked for Nnicu

### Per-route

| Route | Latency p95 | Error rate | RPS |
|---|---|---|---|
| POST /api/nnicu/create | < 200ms | < 0.1% | ? |
| GET /api/nnicu/list | < 100ms | < 0.1% | ? |
| POST /api/nnicu/update | < 200ms | < 0.1% | ? |

### Per-engine

- `Nnicu engine` latency, error rate, throughput
- DB query latency (per dept table)
- Cache hit rate (per dept cache)

## Structured logging

```json
{
  "timestamp": "2026-08-10T12:34:56Z",
  "level": "info",
  "service": "nama-medical-erp",
  "dept": "NNICU",
  "tenant_id": "tnt_123",
  "user_id": "usr_456",
  "request_id": "req_abc",
  "trace_id": "trace_xyz",
  "route": "POST /api/nnicu/create",
  "duration_ms": 45,
  "msg": "Nnicu created"
}
```

## Alerts

- Nnicu error rate > 5% → PagerDuty
- Nnicu p95 latency > 1s → email
- Nnicu DB query > 500ms → APM
- Nnicu RLS violation → PagerDuty + SMS

## Dashboards (Grafana)

- Nnicu overview (latency, errors, RPS)
- Nnicu per-tenant
- Nnicu per-engine
- Nnicu audit log

## Audit retention

- 7+ years (PDPL)
- Hash-chained (audit_middleware.js)
- Stored in `audit_log` table
