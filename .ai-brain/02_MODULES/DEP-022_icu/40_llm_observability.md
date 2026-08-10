# LLM Observability — Icu (DEP-022)
**Last updated:** 2026-08-10

## LLM usage for Icu

### Orchestrators

| Orchestrator | Model | Calls/day | Cost/day |
|---|---|---|---|
| Icu AI orchestrator | gpt-4o | ? | ? |
| Icu summary | gpt-4o-mini | ? | ? |
| Icu RAG | gpt-4o | ? | ? |

### Tracking (per LLM call)

| Field | Example |
|---|---|
| trace_id | trace_abc123 |
| tenant_id | tnt_456 |
| user_id | usr_789 |
| orchestrator | DEP-022_ai |
| model | gpt-4o |
| prompt_tokens | 1234 |
| completion_tokens | 567 |
| total_tokens | 1801 |
| latency_ms | 2100 |
| cost_usd | 0.0540 |
| cache_hit | false |
| error | null |

### Tracked per orchestrator

- Calls per day / week / month
- Tokens per day / week / month
- Cost per day / week / month
- p50 / p95 / p99 latency
- Error rate by error_type
- Cache hit rate

### Cost controls

- Per-tenant monthly budget: TBD
- Per-user daily budget: TBD
- Per-orchestrator monthly budget: TBD
- Fallback to smaller model (gpt-4o-mini) when budget exceeded
- Prompt caching for common queries (24h TTL)

### Alerts

- Daily cost > 80% of cap → notify admin
- Daily cost > 100% of cap → block + notify
- Latency p99 > 10s → notify
- Error rate > 5% → notify + fallback

### Tool

- LangSmith (preferred)
- OpenLLMetry (alternative)
