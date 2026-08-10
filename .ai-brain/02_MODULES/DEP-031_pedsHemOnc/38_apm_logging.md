# APM & Logging Plan — Pedshemonc (DEP-031)
**Last updated:** 2026-08-10

## Metrics tracked for Pedshemonc

### Per-route

| Route | Latency p95 | Error rate | RPS |
|---|---|---|---|
| POST /api/dep_031/create | < 200ms | < 0.1% | ? |
| GET /api/dep_031/list | < 100ms | < 0.1% | ? |
| POST /api/dep_031/update | < 200ms | < 0.1% | ? |

### Per-engine

- `Pedshemonc engine` latency, error rate, throughput
- DB query latency (per dept table)
- Cache hit rate (per dept cache)

## Structured logging

```json
{
  "timestamp": "2026-08-10T12:34:56Z",
  "level": "info",
  "service": "nama-medical-erp",
  "dept": "DEP-031",
  "tenant_id": "tnt_123",
  "user_id": "usr_456",
  "request_id": "req_abc",
  "trace_id": "trace_xyz",
  "route": "POST /api/dep_031/create",
  "duration_ms": 45,
  "msg": "Pedshemonc created"
}
```

## Alerts

- Pedshemonc error rate > 5% → PagerDuty
- Pedshemonc p95 latency > 1s → email
- Pedshemonc DB query > 500ms → APM
- Pedshemonc RLS violation → PagerDuty + SMS

## Dashboards (Grafana)

- Pedshemonc overview (latency, errors, RPS)
- Pedshemonc per-tenant
- Pedshemonc per-engine
- Pedshemonc audit log

## Audit retention

- 7+ years (PDPL)
- Hash-chained (audit_middleware.js)
- Stored in `audit_log` table
