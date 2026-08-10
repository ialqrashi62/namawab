# APM & Logging Plan — Cardioth (DEP-014)
**Last updated:** 2026-08-10

## Metrics tracked for Cardioth

### Per-route

| Route | Latency p95 | Error rate | RPS |
|---|---|---|---|
| POST /api/dep_014/create | < 200ms | < 0.1% | ? |
| GET /api/dep_014/list | < 100ms | < 0.1% | ? |
| POST /api/dep_014/update | < 200ms | < 0.1% | ? |

### Per-engine

- `Cardioth engine` latency, error rate, throughput
- DB query latency (per dept table)
- Cache hit rate (per dept cache)

## Structured logging

```json
{
  "timestamp": "2026-08-10T12:34:56Z",
  "level": "info",
  "service": "nama-medical-erp",
  "dept": "DEP-014",
  "tenant_id": "tnt_123",
  "user_id": "usr_456",
  "request_id": "req_abc",
  "trace_id": "trace_xyz",
  "route": "POST /api/dep_014/create",
  "duration_ms": 45,
  "msg": "Cardioth created"
}
```

## Alerts

- Cardioth error rate > 5% → PagerDuty
- Cardioth p95 latency > 1s → email
- Cardioth DB query > 500ms → APM
- Cardioth RLS violation → PagerDuty + SMS

## Dashboards (Grafana)

- Cardioth overview (latency, errors, RPS)
- Cardioth per-tenant
- Cardioth per-engine
- Cardioth audit log

## Audit retention

- 7+ years (PDPL)
- Hash-chained (audit_middleware.js)
- Stored in `audit_log` table
