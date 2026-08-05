# PSYC-001 — Workflow Orchestration

```yaml
orchestrator: langgraph_supervisor
dept: PSYC-001
nodes:
  - id: triage
  - id: assessment
  - id: orders
  - id: results_review
  - id: care_plan
  - id: follow_up
edges:
  triage -> assessment (always)
  assessment -> orders (if approved)
  assessment -> care_plan (parallel)
  orders -> results_review
  results_review -> follow_up
hitl_triggers:
  - red_flag_fired
  - drug_alert_block
  - confidence < 0.7
escalation_rules:
  - red_flag -> page_oncall
  - drug_alert -> senior_review
audit:
  hash_chained: true
  retention_years: 7
```

Care pathways (top 5):
- per dept (cite .ai-brain/99-upgrade/16-business/pathways/)

---

*Owner: SA — 2026-08-01*
