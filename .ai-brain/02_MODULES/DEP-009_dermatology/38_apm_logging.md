# APM & Logging Plan — Dermatology (DEP-009)
**Last updated:** 2026-08-10

## Metrics tracked for Dermatology

### Per-route

| Route | Latency p95 | Error rate | RPS |
|---|---|---|---|
| POST /api/dep_009/create | < 200ms | < 0.1% | ? |
| GET /api/dep_009/list | < 100ms | < 0.1% | ? |
| POST /api/dep_009/update | < 200ms | < 0.1% | ? |

### Per-engine

- `Dermatology engine` latency, error rate, throughput
- DB query latency (per dept table)
- Cache hit rate (per dept cache)

## Structured logging

```json
{
  "timestamp": "2026-08-10T12:34:56Z",
  "level": "info",
  "service": "nama-medical-erp",
  "dept": "DEP-009",
  "tenant_id": "tnt_123",
  "user_id": "usr_456",
  "request_id": "req_abc",
  "trace_id": "trace_xyz",
  "route": "POST /api/dep_009/create",
  "duration_ms": 45,
  "msg": "Dermatology created"
}
```

## Alerts

- Dermatology error rate > 5% → PagerDuty
- Dermatology p95 latency > 1s → email
- Dermatology DB query > 500ms → APM
- Dermatology RLS violation → PagerDuty + SMS

## Dashboards (Grafana)

- Dermatology overview (latency, errors, RPS)
- Dermatology per-tenant
- Dermatology per-engine
- Dermatology audit log

## Audit retention

- 7+ years (PDPL)
- Hash-chained (audit_middleware.js)
- Stored in `audit_log` table
