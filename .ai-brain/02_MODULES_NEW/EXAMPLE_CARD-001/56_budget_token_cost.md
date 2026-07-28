# 56 — Budget / Token Cost (CARD-001)

> Owner: ORC · Tier 1

## Department budget (annual)

| Item | Cost (SAR/year) | Notes |
|------|-----------------|-------|
| LLM (OpenAI GPT-4o) | 36,000 | $100/tenant/month × 30 tenants = $36,000/yr |
| LLM (Anthropic Claude-3.5) | 18,000 | fallback, $50/tenant/month |
| Langfuse (self-host) | 6,000 | hosting + storage |
| Vector DB (PGVector) | 0 | existing infra |
| Embedding (multilingual-e5-large) | 9,000 | $25/tenant/month × 30 |
| NPHIES API | 12,000 | per-tenant fees |
| SFDA API | 6,000 | drug + device |
| Cardiac rehab equipment | 60,000 | capex |
| Cath lab supplies | 600,000 | per-cath cost |
| Device inventory (PM/ICD/CRT) | 1,200,000 | per-implant cost |
| **Total annual** | **~2,000,000** | cardiology dept ops |

## LLM token cost (per call)

| Chain | Input tokens | Output tokens | Cost per call (USD) | Calls/day (est) | Cost/day |
|-------|--------------|---------------|---------------------|------------------|----------|
| cardio_qa_v1 | 4,000 | 1,000 | $0.025 | 200 | $5.00 |
| ecg_interpret_v1 | 2,000 | 800 | $0.012 | 100 | $1.20 |
| hf_gdmt_v1 | 3,000 | 1,200 | $0.018 | 50 | $0.90 |
| preop_cardiac_v1 | 3,000 | 1,200 | $0.018 | 30 | $0.54 |
| af_anticoag_v1 | 2,500 | 1,000 | $0.015 | 30 | $0.45 |
| chest_pain_triage_v1 | 2,000 | 800 | $0.012 | 80 | $0.96 |
| echo_interpret_v1 | 2,500 | 1,000 | $0.015 | 60 | $0.90 |
| **Total** | | | | **550 calls/day** | **~$10/day/tenant** |

## Per-tenant monthly cap

- LLM: $100/month (~$3.30/day)
- Embedding: $25/month (~$0.80/day)
- **Total: $125/tenant/month**

## Cap enforcement

```python
# Pseudocode
def check_cost_guard(tenant_id, cost_usd):
    month_cost = get_tenant_month_cost(tenant_id)
    month_cap = 100.0
    if month_cost + cost_usd > month_cap * 0.8 and month_cost + cost_usd < month_cap:
        notify_owner(tenant_id, f"80% of monthly cap reached: ${month_cost:.2f}")
    if month_cost + cost_usd >= month_cap:
        if month_cost + cost_usd > month_cap * 1.0:
            throttle(tenant_id, "monthly cap reached")
            return False
    return True
```

## Alerts

- 80% of cap: Slack notify
- 100% of cap: Slack + throttle
- 120% of cap: PagerDuty (SEV-2)

## Cost optimization

- Cache common queries (e.g. guideline chunks)
- Use smaller model for triage, large for generation
- Compress retrieval context
- Reuse prompt prefixes (caching)
- Use local fallback for non-critical

## Monthly review

- Per-tenant cost
- Per-dept cost
- Per-chain cost
- Cost per call (P50, P95, P99)
- Cost per outcome (e.g. cost per HF GDMT optimization)

## Token budget per generation

```yaml
token_budget:
  per_call_input: 4000
  per_call_output: 1000
  monthly_per_tenant_cap_usd: 100
  embedding_budget:
    monthly_per_tenant_cap_usd: 25
  alert_thresholds:
    notify: 0.8
    throttle: 1.0
    page: 1.2
```

## Engineering budget

| Item | Hours/year | Cost (SAR) |
|------|------------|------------|
| Cardiology engine dev | 500 | 150,000 |
| Cardiology UI/station | 300 | 90,000 |
| NPHIES integration | 200 | 60,000 |
| LLM prompt engineering | 200 | 60,000 |
| Testing + QA | 200 | 60,000 |
| Compliance + audit | 100 | 30,000 |
| Training + docs | 100 | 30,000 |
| **Total engineering** | **1,600** | **480,000** |
