# APM & Logging Plan — Rheumatology (DEP-007)
**Last updated:** 2026-08-10

## Metrics tracked for Rheumatology

### Per-route

| Route | Latency p95 | Error rate | RPS |
|---|---|---|---|
| POST /api/dep_007/create | < 200ms | < 0.1% | ? |
| GET /api/dep_007/list | < 100ms | < 0.1% | ? |
| POST /api/dep_007/update | < 200ms | < 0.1% | ? |

### Per-engine

- `Rheumatology engine` latency, error rate, throughput
- DB query latency (per dept table)
- Cache hit rate (per dept cache)

## Structured logging

```json
{
  "timestamp": "2026-08-10T12:34:56Z",
  "level": "info",
  "service": "nama-medical-erp",
  "dept": "DEP-007",
  "tenant_id": "tnt_123",
  "user_id": "usr_456",
  "request_id": "req_abc",
  "trace_id": "trace_xyz",
  "route": "POST /api/dep_007/create",
  "duration_ms": 45,
  "msg": "Rheumatology created"
}
```

## Alerts

- Rheumatology error rate > 5% → PagerDuty
- Rheumatology p95 latency > 1s → email
- Rheumatology DB query > 500ms → APM
- Rheumatology RLS violation → PagerDuty + SMS

## Dashboards (Grafana)

- Rheumatology overview (latency, errors, RPS)
- Rheumatology per-tenant
- Rheumatology per-engine
- Rheumatology audit log

## Audit retention

- 7+ years (PDPL)
- Hash-chained (audit_middleware.js)
- Stored in `audit_log` table
