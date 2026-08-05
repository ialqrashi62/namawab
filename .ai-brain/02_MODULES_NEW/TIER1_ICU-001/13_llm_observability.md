# ICU-001 — LLM Observability

```yaml
langfuse:
  prompts_to_track:
    - PROMPT:ICU-001:initial_assessment
    - PROMPT:ICU-001:risk_stratification
  metrics:
    - calls_per_day
    - cost_per_call
    - latency_p95
    - success_rate
    - citation_coverage
    - override_rate
    - red_flag_recall
dashboard: grafana (ai-cost + ICU-001-prompt.json)
alert:
  if cost > {threshold_usd_day}: slack
  if red_flag_recall < 0.99: page CMO
retention_days: 90
```

---

*Owner: AIE+DSL — 2026-08-01*
