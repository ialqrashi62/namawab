# APM & Logging Plan — Ccu (CCU)
**Last updated:** 2026-08-10

## Metrics tracked for Ccu

### Per-route

| Route | Latency p95 | Error rate | RPS |
|---|---|---|---|
| POST /api/ccu/create | < 200ms | < 0.1% | ? |
| GET /api/ccu/list | < 100ms | < 0.1% | ? |
| POST /api/ccu/update | < 200ms | < 0.1% | ? |

### Per-engine

- `Ccu engine` latency, error rate, throughput
- DB query latency (per dept table)
- Cache hit rate (per dept cache)

## Structured logging

```json
{
  "timestamp": "2026-08-10T12:34:56Z",
  "level": "info",
  "service": "nama-medical-erp",
  "dept": "CCU",
  "tenant_id": "tnt_123",
  "user_id": "usr_456",
  "request_id": "req_abc",
  "trace_id": "trace_xyz",
  "route": "POST /api/ccu/create",
  "duration_ms": 45,
  "msg": "Ccu created"
}
```

## Alerts

- Ccu error rate > 5% → PagerDuty
- Ccu p95 latency > 1s → email
- Ccu DB query > 500ms → APM
- Ccu RLS violation → PagerDuty + SMS

## Dashboards (Grafana)

- Ccu overview (latency, errors, RPS)
- Ccu per-tenant
- Ccu per-engine
- Ccu audit log

## Audit retention

- 7+ years (PDPL)
- Hash-chained (audit_middleware.js)
- Stored in `audit_log` table
