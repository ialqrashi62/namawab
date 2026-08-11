---
name: nm-budget-tracking
description: Use when tracking token consumption, API costs, or project budget. Loads the canonical logging + dashboard pattern so every spend is visible. Saves ~70% tokens per tracking setup.
---

# Budget & Token Tracking — Token-Saver

## When to use

Tracking how much is being spent:
- Token consumption per session
- API cost per tenant
- Build time per phase
- Storage per env

## Log schema

```sql
CREATE TABLE ai_cost_log (
    id BIGSERIAL PRIMARY KEY,
    tenant_id BIGINT NOT NULL,
    user_id BIGINT,
    session_id TEXT,
    provider TEXT NOT NULL,                  -- openai|anthropic|google|ollama
    model TEXT NOT NULL,
    prompt_tokens INTEGER,
    completion_tokens INTEGER,
    cost_usd NUMERIC(10, 6),
    ts TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE ai_cost_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_cost_log FORCE  ROW LEVEL SECURITY;

CREATE POLICY ai_cost_log_tenant ON ai_cost_log
    USING (tenant_id::text = current_setting('app.tenant_id', true))
    WITH CHECK (tenant_id::text = current_setting('app.tenant_id', true));

CREATE INDEX idx_ai_cost_log_ts ON ai_cost_log (ts DESC);
CREATE INDEX idx_ai_cost_log_tenant_ts ON ai_cost_log (tenant_id, ts DESC);
```

## Per-call logging

```js
// namaweb/ai/budget_logger.js
const db = require('../db_postgres');

const PRICING = {
    'gpt-4o-mini':           { input: 0.15, output: 0.60 },
    'gpt-4o':                { input: 5.00, output: 15.00 },
    'claude-3-5-sonnet':     { input: 3.00, output: 15.00 },
    'claude-3-haiku':        { input: 0.25, output: 1.25 },
    'gemini-1.5-pro':        { input: 1.25, output: 5.00 },
    'gemini-1.5-flash':      { input: 0.075, output: 0.30 }
};

async function track({ tenantId, userId, sessionId, provider, model, promptTokens, completionTokens }) {
    const pricing = PRICING[model];
    if (!pricing) return;
    const cost = (promptTokens / 1e6) * pricing.input + (completionTokens / 1e6) * pricing.output;
    await db.query(`
        INSERT INTO ai_cost_log (tenant_id, user_id, session_id, provider, model,
            prompt_tokens, completion_tokens, cost_usd)
        VALUES ($1,$2,$3,$4,$5,$6,$7,$8)
    `, [tenantId, userId, sessionId, provider, model, promptTokens, completionTokens, cost]);
    return cost;
}

module.exports = { track };
```

## Usage in generate()

```js
const { track } = require('./budget_logger');

async function generate({ provider, model, system, user, tenantId, userId, sessionId, ... }) {
    const r = await callProvider(provider, model, system, user);
    await track({
        tenantId, userId, sessionId,
        provider, model,
        promptTokens: r.usage.prompt_tokens,
        completionTokens: r.usage.completion_tokens
    });
    return r;
}
```

## Tenant budget cap

```js
const CAPS = {
    free:    { monthlyUSD: 5.00,    perRequestUSD: 0.10 },
    starter: { monthlyUSD: 50.00,   perRequestUSD: 0.50 },
    pro:     { monthlyUSD: 500.00,  perRequestUSD: 5.00 },
    enterprise: { monthlyUSD: 5000.00, perRequestUSD: 50.00 }
};

async function checkBudget(tenantId, requestedUSD) {
    const { rows } = await db.query(`
        SELECT COALESCE(SUM(cost_usd), 0) AS month_total
        FROM ai_cost_log
        WHERE tenant_id = $1 AND ts >= date_trunc('month', now())
    `, [tenantId]);
    const total = Number(rows[0].month_total);
    const plan = await getTenantPlan(tenantId);
    const cap = CAPS[plan].monthlyUSD;
    if (total + requestedUSD > cap) {
        return { ok: false, total, cap, requested: requestedUSD, remaining: cap - total };
    }
    return { ok: true, total, cap, remaining: cap - total - requestedUSD };
}
```

## Dashboard (Prometheus + Grafana)

```js
// namaweb/middleware/ai_metrics.js
const client = require('prom-client');

const aiCostUSD = new client.Counter({
    name: 'ai_cost_usd_total',
    help: 'Total AI cost in USD',
    labelNames: ['tenant_id', 'provider', 'model']
});

const aiCalls = new client.Counter({
    name: 'ai_calls_total',
    help: 'Total AI calls',
    labelNames: ['tenant_id', 'provider', 'model']
});

const aiTokens = new client.Counter({
    name: 'ai_tokens_total',
    help: 'Total AI tokens',
    labelNames: ['tenant_id', 'provider', 'model', 'type']   // 'input' | 'output'
});

module.exports = { aiCostUSD, aiCalls, aiTokens };
```

## Daily summary report

```sql
-- Daily AI cost summary per tenant
SELECT
    tenant_id,
    date_trunc('day', ts) AS day,
    COUNT(*) AS calls,
    SUM(prompt_tokens) AS input_tokens,
    SUM(completion_tokens) AS output_tokens,
    SUM(cost_usd) AS daily_cost_usd
FROM ai_cost_log
WHERE ts >= now() - INTERVAL '30 days'
GROUP BY tenant_id, day
ORDER BY day DESC, daily_cost_usd DESC;
```

## Per-session tracking (for AI agents)

```yaml
# .ai-brain/00-orchestrator/COST.yaml
session_id: 2026-08-10-pcc-deploy
started: 2026-08-10T08:00:00Z
budget_cap_usd: 50.00
spent_usd: 12.45
calls_made: 247
tokens_in: 1,840,000
tokens_out: 720,000
models_used:
  gpt-4o-mini: 180
  claude-3-haiku: 67
phases_completed:
  - PCC_P3_01
  - PCC_P3_02
```

## Acceptance gate (per phase)

| Metric | Threshold | Action |
|---|---|---|
| tokens per dept | < 60K | OK |
| tokens per dept | 60-80K | WARNING; optimize |
| tokens per dept | > 80K | BLOCKING; split dept |
| cost per dept | < $5 | OK |
| cost per dept | > $20 | REVIEW with owner |

## Token saving

Each budget tracker from scratch = ~150 lines. With template = ~40 lines unique
(custom pricing, custom caps). ~70% reduction.