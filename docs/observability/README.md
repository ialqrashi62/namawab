# Observability

| File | Purpose |
|------|---------|
| `prometheus/alerts.yml` | Alert rules (Sev1/2/3 across availability, latency, errors, clinical safety, infra, security) |
| `prometheus/slo.yml` | SLO definitions (Sloth-format) — generates burn-rate alerts |
| `grafana/dashboard_platform_overview.json` | RPS, p95, errors, DB connections |
| `grafana/dashboard_ed_live_board.json` | ED capacity, codes, CTAS distribution |
| `grafana/dashboard_ai_quality.json` | AI calls, confidence, latency, drift, fairness |

## Apply
```bash
# Prometheus rules (via prometheus-operator PrometheusRule CRDs)
kubectl apply -f prometheus/alerts.yml

# Grafana dashboards
curl -X POST -u admin:$GF_PASS \
  -H 'Content-Type: application/json' \
  -d @grafana/dashboard_platform_overview.json \
  http://grafana.nama.local/api/dashboards/db
```

## Naming conventions for emitted metrics
- `http_request_duration_seconds_*` — exposed by FastAPI middleware
- `ai_orchestrator_latency_seconds_*` — emitted by LangGraph wrapper
- `ai_calls_total`, `ai_confidence_*`, `ai_human_override_total`, `ai_hallucination_incidents_total`
- `audit_log_total`, `audit_hash_chain_break_total`
- Clinical: `stemi_d2b_*`, `sepsis_bundle_*`, `lab_critical_unacknowledged_total`
- ED: `ed_patients_in_dept`, `ed_capacity_total`, `ed_active_codes`, `ed_arrivals_total`

## Burn-rate alerts (Sloth)
Generates 4 alert windows (5m+1h fast, 30m+6h slow). Configure to PagerDuty for fast,
ticket for slow.

## Observability budget
- Trace sampling 10%; 100% on errors and Sev1+ alerts.
- Log retention: 30d hot, 1y cold.
- Metric retention: 15d high-res + 1y downsampled.
