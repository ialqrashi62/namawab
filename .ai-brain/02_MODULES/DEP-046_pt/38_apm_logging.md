# APM & Logging Plan — Pt (DEP-046)
**Last updated:** 2026-08-10

## Metrics tracked for Pt

### Per-route

| Route | Latency p95 | Error rate | RPS |
|---|---|---|---|
| POST /api/dep_046/create | < 200ms | < 0.1% | ? |
| GET /api/dep_046/list | < 100ms | < 0.1% | ? |
| POST /api/dep_046/update | < 200ms | < 0.1% | ? |

### Per-engine

- `Pt engine` latency, error rate, throughput
- DB query latency (per dept table)
- Cache hit rate (per dept cache)

## Structured logging

```json
{
  "timestamp": "2026-08-10T12:34:56Z",
  "level": "info",
  "service": "nama-medical-erp",
  "dept": "DEP-046",
  "tenant_id": "tnt_123",
  "user_id": "usr_456",
  "request_id": "req_abc",
  "trace_id": "trace_xyz",
  "route": "POST /api/dep_046/create",
  "duration_ms": 45,
  "msg": "Pt created"
}
```

## Alerts

- Pt error rate > 5% → PagerDuty
- Pt p95 latency > 1s → email
- Pt DB query > 500ms → APM
- Pt RLS violation → PagerDuty + SMS

## Dashboards (Grafana)

- Pt overview (latency, errors, RPS)
- Pt per-tenant
- Pt per-engine
- Pt audit log

## Audit retention

- 7+ years (PDPL)
- Hash-chained (audit_middleware.js)
- Stored in `audit_log` table
