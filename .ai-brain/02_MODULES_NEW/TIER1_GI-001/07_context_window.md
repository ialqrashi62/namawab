# GI-001 — Context Window Shape

```yaml
context_budget:
  default_model: gpt-4o
  budgets:
    gpt-4o: 128000
    claude-3.5: 200000
    med-llama: 8000
allocation_for_gi-001:
  system_prompt: 800
  patient_mask_summary: 200
  encounter_payload: 1000
  chart_history: 1500
  labs_imaging_recent: 800
  rag_top5: 1500
  few_shot_examples: 800
  citation_context: 500
  total_estimate: ~7100
patient_timeline_api: /api/v1/context/patients/{id}/timeline
compaction_strategy: rolling_window_90d
red_flags_on_budget_exceeded: shrink_rag_first
```

---

*Owner: AIE — 2026-08-01*
