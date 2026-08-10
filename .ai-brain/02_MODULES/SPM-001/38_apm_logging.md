# APM & Logging Plan — Spm-001 (SPM-001)
**Last updated:** 2026-08-10

## Metrics tracked for Spm-001

### Per-route

| Route | Latency p95 | Error rate | RPS |
|---|---|---|---|
| POST /api/spm_001/create | < 200ms | < 0.1% | ? |
| GET /api/spm_001/list | < 100ms | < 0.1% | ? |
| POST /api/spm_001/update | < 200ms | < 0.1% | ? |

### Per-engine

- `Spm-001 engine` latency, error rate, throughput
- DB query latency (per dept table)
- Cache hit rate (per dept cache)

## Structured logging

```json
{
  "timestamp": "2026-08-10T12:34:56Z",
  "level": "info",
  "service": "nama-medical-erp",
  "dept": "SPM-001",
  "tenant_id": "tnt_123",
  "user_id": "usr_456",
  "request_id": "req_abc",
  "trace_id": "trace_xyz",
  "route": "POST /api/spm_001/create",
  "duration_ms": 45,
  "msg": "Spm-001 created"
}
```

## Alerts

- Spm-001 error rate > 5% → PagerDuty
- Spm-001 p95 latency > 1s → email
- Spm-001 DB query > 500ms → APM
- Spm-001 RLS violation → PagerDuty + SMS

## Dashboards (Grafana)

- Spm-001 overview (latency, errors, RPS)
- Spm-001 per-tenant
- Spm-001 per-engine
- Spm-001 audit log

## Audit retention

- 7+ years (PDPL)
- Hash-chained (audit_middleware.js)
- Stored in `audit_log` table
