# APM & Logging Plan — Hemonc (DEP-004)
**Last updated:** 2026-08-10

## Metrics tracked for Hemonc

### Per-route

| Route | Latency p95 | Error rate | RPS |
|---|---|---|---|
| POST /api/dep_004/create | < 200ms | < 0.1% | ? |
| GET /api/dep_004/list | < 100ms | < 0.1% | ? |
| POST /api/dep_004/update | < 200ms | < 0.1% | ? |

### Per-engine

- `Hemonc engine` latency, error rate, throughput
- DB query latency (per dept table)
- Cache hit rate (per dept cache)

## Structured logging

```json
{
  "timestamp": "2026-08-10T12:34:56Z",
  "level": "info",
  "service": "nama-medical-erp",
  "dept": "DEP-004",
  "tenant_id": "tnt_123",
  "user_id": "usr_456",
  "request_id": "req_abc",
  "trace_id": "trace_xyz",
  "route": "POST /api/dep_004/create",
  "duration_ms": 45,
  "msg": "Hemonc created"
}
```

## Alerts

- Hemonc error rate > 5% → PagerDuty
- Hemonc p95 latency > 1s → email
- Hemonc DB query > 500ms → APM
- Hemonc RLS violation → PagerDuty + SMS

## Dashboards (Grafana)

- Hemonc overview (latency, errors, RPS)
- Hemonc per-tenant
- Hemonc per-engine
- Hemonc audit log

## Audit retention

- 7+ years (PDPL)
- Hash-chained (audit_middleware.js)
- Stored in `audit_log` table
