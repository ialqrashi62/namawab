# APM & Logging Plan — Pulmonology (DEP-006)
**Last updated:** 2026-08-10

## Metrics tracked for Pulmonology

### Per-route

| Route | Latency p95 | Error rate | RPS |
|---|---|---|---|
| POST /api/dep_006/create | < 200ms | < 0.1% | ? |
| GET /api/dep_006/list | < 100ms | < 0.1% | ? |
| POST /api/dep_006/update | < 200ms | < 0.1% | ? |

### Per-engine

- `Pulmonology engine` latency, error rate, throughput
- DB query latency (per dept table)
- Cache hit rate (per dept cache)

## Structured logging

```json
{
  "timestamp": "2026-08-10T12:34:56Z",
  "level": "info",
  "service": "nama-medical-erp",
  "dept": "DEP-006",
  "tenant_id": "tnt_123",
  "user_id": "usr_456",
  "request_id": "req_abc",
  "trace_id": "trace_xyz",
  "route": "POST /api/dep_006/create",
  "duration_ms": 45,
  "msg": "Pulmonology created"
}
```

## Alerts

- Pulmonology error rate > 5% → PagerDuty
- Pulmonology p95 latency > 1s → email
- Pulmonology DB query > 500ms → APM
- Pulmonology RLS violation → PagerDuty + SMS

## Dashboards (Grafana)

- Pulmonology overview (latency, errors, RPS)
- Pulmonology per-tenant
- Pulmonology per-engine
- Pulmonology audit log

## Audit retention

- 7+ years (PDPL)
- Hash-chained (audit_middleware.js)
- Stored in `audit_log` table
