---
id: BUDGET-TOKEN-COST
version: 1.0
date: 2026-08-01
owner: DSL+ORC
status: ACTIVE
---

# Budget & Token Cost Management

> **Purpose:** Centralized cost tracking and budget controls for LLM usage across all 100+ depts.

---

## 1. Cost dimensions

| Axis | Examples |
|------|----------|
| **By prompt_id** | PROMPT:CARD-001:initial_assessment |
| **By dept** | CARD, ER, ICU |
| **By tenant** | tenant_A, tenant_B |
| **By user/role** | doctor, nurse, admin |
| **By model** | gpt-4o, claude-3.5, multilingual-e5 |
| **By time** | day, week, month |

---

## 2. Per-prompt baseline cost

```yaml
prompt_costs_usd_per_call:
  PROMPT:CARD-001:initial_assessment:
    model: gpt-4o
    avg_tokens_in: 1200
    avg_tokens_out: 350
    cost_usd: 0.014
    p95_tokens_in: 1800
    p95_tokens_out: 600
    p95_cost_usd: 0.022
  PROMPT:ER-001:triage_esi:
    model: gpt-4o
    avg_tokens_in: 800
    avg_tokens_out: 250
    cost_usd: 0.009
  PROMPT:GLOBAL:vector_query:
    model: local-multilingual-e5  # free
    cost_usd: 0.0001  # compute
  PROMPT:GLOBAL:embedding:
    model: local-multilingual-e5
    cost_usd: 0.0001
```

---

## 3. Monthly budget

| Tenant tier | Monthly cap (USD) | Action at 80% | Action at 95% | Action at 100% |
|-------------|-------------------|---------------|---------------|----------------|
| starter | 100 | notify | warn | degrade |
| professional | 1,000 | notify | warn | pause non-critical |
| enterprise | 10,000 | notify | notify | throttle |

---

## 4. Cost dashboard

- `.ai-brain/24-apm/llm-cost-dashboard.json` (Grafana)
- Widgets:
  - Cost/day by dept
  - Cost/prompt by tenant
  - Top 10 most expensive calls
  - Cache hit rate (savings)
  - Override rate (cost-implications)

---

## 5. Optimization levers

1. **Caching**: query + response cached (24h)
2. **Hybrid retrieval**: avoid expensive vector calls when BM25 suffices
3. **Prompt compression**: S6 (compressed prompts)
4. **Chunk sharing**: same chunk reused across depts
5. **Model downshift**: use Claude-3-Haiku for low-risk flows
6. **Local models**: multilingual-e5 for embedding (free)

---

## 6. Cross-tenant cost visibility

Tenant admin can see:
- Today's usage
- Top prompts
- Cost by dept (their own)

Cannot see other tenants.

---

## 7. Files

```
src/cost/
├── recorder.ts    # records every prompt use
├── budget.ts      # budget enforcement
├── report.ts      # CSV/JSON report
└── tests/

.ai-brain/24-apm/
└── llm-cost-dashboard.json
```

---

*Owner: DSL+ORC — version 1.0 — 2026-08-01*
