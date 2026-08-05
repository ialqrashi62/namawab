# ANES-001 — Budget + Token Cost

```yaml
budget_anes-001:
  monthly_cap_usd_per_tenant: 500
  per_prompt:
    PROMPT:ANES-001:initial_assessment:
      avg_tokens_in: 1200
      avg_tokens_out: 350
      cost_usd: 0.014
  alerts:
    - at_80pct: notify
    - at_95pct: warn
    - at_100pct: degrade non-critical
```

Tracking: `src/cost/recorder.ts` + Grafana dashboard.

---

*Owner: DSL+ORC — 2026-08-01*
