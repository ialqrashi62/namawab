# 39 — Monitoring & Alerting (CARD-001)

> Owner: DSL · Tier 2

## Stack

- **APM:** OpenTelemetry → OTLP → Grafana Tempo + Prometheus
- **Logs:** Loki (Promtail)
- **Metrics:** Prometheus + Grafana dashboards
- **Alerts:** Alertmanager → PagerDuty / Slack / SMS
- **Uptime:** Blackbox exporter + heartbeat

## SLIs / SLOs

| SLI | Target | SLO | Window |
|-----|--------|-----|--------|
| API availability | 99.9% | 99.5% | 30 days |
| API p50 latency | < 200ms | 99% < 200ms | 7 days |
| API p95 latency | < 500ms | 99% < 500ms | 7 days |
| API p99 latency | < 1500ms | 99% < 1500ms | 7 days |
| Co-pilot p95 latency | < 3s | 95% < 3s | 7 days |
| Co-pilot refusal rate | < 5% | monitor | 7 days |
| Co-pilot red-flag detection | > 99% | 99% | quarterly |
| LLM cost per tenant | < $100/month | 100% | monthly |
| DB connection pool | < 80% utilized | 100% < 80% | 5 min |
| Audit log write success | 100% | 100% | 7 days |
| Backup success | 100% | 100% | 30 days |
| Disaster RTO | < 4h | 100% | on incident |
| Disaster RPO | < 1h | 100% | on incident |

## Dashboards

### Cardiology Health

- API latency (p50, p95, p99) by endpoint
- Error rate by endpoint
- Active red flags count
- Co-pilot queries per hour
- Co-pilot red-flag detection rate
- LLM cost per tenant
- DB pool utilization
- Audit log writes/sec

### Clinical KPIs

- Encounters / day
- ECG / day
- Echo / day
- Cath / day
- Devices implanted / week
- NPHIES claims / day
- NPHIES success rate
- HF GDMT optimization rate
- Door-to-balloon time (STEMI)

### Security

- Failed logins / 5 min
- Cross-tenant access attempts
- Cross-specialty write attempts
- Idempotency conflicts
- LLM injection attempts
- LLM refusals
- Audit chain integrity
- Pen test findings (open)

## Alerts

| Alert | Condition | Severity | Channel | Runbook |
|-------|-----------|----------|---------|---------|
| API down | 5xx > 1% / 5 min | critical | PagerDuty + Slack | 41_incident_response |
| DB pool exhaustion | > 90% / 5 min | critical | PagerDuty | 41_incident_response |
| Audit log write fail | any | critical | PagerDuty | 41_incident_response |
| Backup fail | any | high | Slack | 41_incident_response |
| RLS policy drop | any | critical | PagerDuty | 41_incident_response |
| Cross-tenant breach | any | critical | PagerDuty + Owner | 41_incident_response |
| LLM cost cap hit | > 100% | high | Slack | throttle |
| LLM cost warning | > 80% | medium | Slack | notify |
| Co-pilot latency p95 | > 5s | medium | Slack | 41_incident_response |
| Co-pilot refusal rate | > 10% | high | Slack | review |
| Red flag detection rate | < 95% | critical | PagerDuty + CMIO | 41_incident_response |
| NPHIES down | 5xx > 50% | high | Slack | 41_incident_response |
| LLM injection attempt | any | high | Slack + CMIO | 41_incident_response |
| LLM refusal suspicious | > 20% | medium | Slack | review |

## Health endpoints

- `GET /healthz` — overall health
- `GET /healthz/live` — liveness (process alive)
- `GET /healthz/ready` — readiness (DB + Redis + LLM up)
- `GET /healthz/deps` — dependency status (DB, Redis, OpenAI, Anthropic, Langfuse, NPHIES, email, SMS)
- `GET /metrics` — Prometheus format

## Log structure

```json
{
  "ts": "2026-07-27T01:00:00Z",
  "level": "info|warn|error|debug",
  "service": "nama-medical-erp",
  "request_id": "uuid",
  "tenant_id": "uuid",
  "user_id": "uuid",
  "route": "/api/cardiology/copilot/query",
  "method": "POST",
  "status": 200,
  "latency_ms": 1234,
  "msg": "...",
  "context": { ... }
}
```

## Critical log events

- All red_flag activations (CRITICAL)
- All NPHIES claims
- All money routes
- All cross-tenant access attempts
- All role changes
- All secret access
- All LLM refusals
- All co-pilot queries (trace_id)

## Retention

- Hot logs (Loki): 7 days
- Cold logs (S3 / GCS): 90 days
- Audit log: 7+ years
- LLM traces: 1 year
- Backups: 30 days rolling + 7 years for monthly
