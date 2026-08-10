# APM & Logging Plan — Micu (MICU)
**Last updated:** 2026-08-10

## Metrics tracked for Micu

### Per-route

| Route | Latency p95 | Error rate | RPS |
|---|---|---|---|
| POST /api/micu/create | < 200ms | < 0.1% | ? |
| GET /api/micu/list | < 100ms | < 0.1% | ? |
| POST /api/micu/update | < 200ms | < 0.1% | ? |

### Per-engine

- `Micu engine` latency, error rate, throughput
- DB query latency (per dept table)
- Cache hit rate (per dept cache)

## Structured logging

```json
{
  "timestamp": "2026-08-10T12:34:56Z",
  "level": "info",
  "service": "nama-medical-erp",
  "dept": "MICU",
  "tenant_id": "tnt_123",
  "user_id": "usr_456",
  "request_id": "req_abc",
  "trace_id": "trace_xyz",
  "route": "POST /api/micu/create",
  "duration_ms": 45,
  "msg": "Micu created"
}
```

## Alerts

- Micu error rate > 5% → PagerDuty
- Micu p95 latency > 1s → email
- Micu DB query > 500ms → APM
- Micu RLS violation → PagerDuty + SMS

## Dashboards (Grafana)

- Micu overview (latency, errors, RPS)
- Micu per-tenant
- Micu per-engine
- Micu audit log

## Audit retention

- 7+ years (PDPL)
- Hash-chained (audit_middleware.js)
- Stored in `audit_log` table
