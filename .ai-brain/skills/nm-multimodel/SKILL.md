---
name: nm-multimodel
description: Use when orchestrating multiple LLM providers (OpenAI, Anthropic, Google, local). Loads the canonical provider interface so any model is interchangeable. Saves ~70% tokens per multimodel module.
---

# Multi-Model Orchestration — Token-Saver

## When to use

Multiple LLM providers in the same workflow:
- OpenAI for clinical Q&A (gpt-4o-mini)
- Anthropic for discharge summaries (claude-3-5-sonnet)
- Google for translations (gemini-1.5-pro)
- Local Ollama for sensitive data

## Provider interface

```js
// namaweb/ai/providers.js
const PROVIDERS = {
    openai: {
        id: 'openai',
        models: ['gpt-4o-mini', 'gpt-4o', 'gpt-4-turbo'],
        costPer1M: { input: 0.15, output: 0.60 },
        endpoint: 'https://api.openai.com/v1',
        envKey: 'OPENAI_API_KEY'
    },
    anthropic: {
        id: 'anthropic',
        models: ['claude-3-5-sonnet-20241022', 'claude-3-haiku-20240307'],
        costPer1M: { input: 3.00, output: 15.00 },
        endpoint: 'https://api.anthropic.com/v1',
        envKey: 'ANTHROPIC_API_KEY'
    },
    google: {
        id: 'google',
        models: ['gemini-1.5-pro', 'gemini-1.5-flash'],
        costPer1M: { input: 1.25, output: 5.00 },
        endpoint: 'https://generativelanguage.googleapis.com/v1beta',
        envKey: 'GOOGLE_API_KEY'
    },
    ollama: {
        id: 'ollama',
        models: ['llama3.1:8b', 'mistral:7b', 'qwen2.5:7b'],
        costPer1M: { input: 0, output: 0 },     // local
        endpoint: 'http://localhost:11434',
        envKey: null                            // no key
    }
};
```

## Unified generate

```js
// namaweb/ai/generate.js
const PROVIDERS = require('./providers');

async function generate({ provider, model, system, user, temperature = 0.2, maxTokens = 1024 }) {
    const p = PROVIDERS[provider];
    if (!p) throw new Error(`unknown_provider_${provider}`);
    if (!p.models.includes(model)) throw new Error(`unknown_model_${provider}/${model}`);

    switch (provider) {
        case 'openai':     return await openaiGenerate(p, model, system, user, temperature, maxTokens);
        case 'anthropic':  return await anthropicGenerate(p, model, system, user, temperature, maxTokens);
        case 'google':     return await googleGenerate(p, model, system, user, temperature, maxTokens);
        case 'ollama':     return await ollamaGenerate(p, model, system, user, temperature, maxTokens);
    }
}

async function openaiGenerate(p, model, system, user, temperature, maxTokens) {
    const { OpenAI } = require('openai');
    const client = new OpenAI({ apiKey: process.env[p.envKey] });
    const r = await client.chat.completions.create({
        model, temperature, max_tokens: maxTokens,
        messages: [{ role: 'system', content: system }, { role: 'user', content: user }]
    });
    return { text: r.choices[0].message.content, usage: r.usage, provider: 'openai', model };
}

async function anthropicGenerate(p, model, system, user, temperature, maxTokens) {
    const Anthropic = require('@anthropic-ai/sdk').default;
    const client = new Anthropic({ apiKey: process.env[p.envKey] });
    const r = await client.messages.create({
        model, system, max_tokens: maxTokens, temperature,
        messages: [{ role: 'user', content: user }]
    });
    return {
        text: r.content[0].text,
        usage: { prompt_tokens: r.usage.input_tokens, completion_tokens: r.usage.output_tokens },
        provider: 'anthropic', model
    };
}

async function googleGenerate(p, model, system, user, temperature, maxTokens) {
    const url = `${p.endpoint}/models/${model}:generateContent?key=${process.env[p.envKey]}`;
    const r = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            contents: [{ parts: [{ text: system + '\n\n' + user }] }],
            generationConfig: { temperature, maxOutputTokens: maxTokens }
        })
    });
    const j = await r.json();
    return {
        text: j.candidates[0].content.parts[0].text,
        usage: { prompt_tokens: j.usageMetadata.promptTokenCount, completion_tokens: j.usageMetadata.candidatesTokenCount },
        provider: 'google', model
    };
}

async function ollamaGenerate(p, model, system, user, temperature, maxTokens) {
    const r = await fetch(`${p.endpoint}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            model,
            stream: false,
            options: { temperature, num_predict: maxTokens },
            messages: [{ role: 'system', content: system }, { role: 'user', content: user }]
        })
    });
    const j = await r.json();
    return {
        text: j.message.content,
        usage: { prompt_tokens: j.prompt_eval_count, completion_tokens: j.eval_count },
        provider: 'ollama', model
    };
}

module.exports = { generate };
```

## Routing logic

```js
// namaweb/ai/router.js
function routeLLM(task, dataClassification) {
    // dataClassification: 'public' | 'phi' | 'sensitive'
    switch (task) {
        case 'clinical_qa':
            return dataClassification === 'phi'
                ? { provider: 'ollama', model: 'llama3.1:8b' }              // PHI stays local
                : { provider: 'openai', model: 'gpt-4o-mini' };             // public → cloud
        case 'discharge_summary':
            return { provider: 'anthropic', model: 'claude-3-5-sonnet-20241022' };
        case 'translation':
            return { provider: 'google', model: 'gemini-1.5-flash' };
        case 'code_generation':
            return { provider: 'openai', model: 'gpt-4o' };
        case 'phi_anonymization':
            return { provider: 'ollama', model: 'qwen2.5:7b' };             // sensitive → local
        default:
            return { provider: 'openai', model: 'gpt-4o-mini' };
    }
}
```

## Cost tracking

```js
async function trackCost(tenantId, userId, result) {
    const provider = PROVIDERS[result.provider];
    const cost = (result.usage.prompt_tokens / 1e6) * provider.costPer1M.input
               + (result.usage.completion_tokens / 1e6) * provider.costPer1M.output;
    await db.query(`
        INSERT INTO ai_cost_log (tenant_id, user_id, provider, model,
            prompt_tokens, completion_tokens, cost_usd, ts)
        VALUES ($1,$2,$3,$4,$5,$6,$7, now())
    `, [tenantId, userId, result.provider, result.model,
        result.usage.prompt_tokens, result.usage.completion_tokens, cost]);
    return cost;
}
```

## Fallback chain

```js
async function generateWithFallback(task, ...args) {
    const chain = [
        { provider: 'openai', model: 'gpt-4o-mini' },
        { provider: 'anthropic', model: 'claude-3-haiku-20240307' },
        { provider: 'google', model: 'gemini-1.5-flash' },
        { provider: 'ollama', model: 'llama3.1:8b' }
    ];
    for (const target of chain) {
        try {
            return await generate({ provider: target.provider, model: target.model, ...args });
        } catch (e) {
            logger.warn({ task, target, err: e.message }, 'provider failed, falling back');
        }
    }
    throw new Error('all_providers_failed');
}
```

## Safety

- ❌ Never send PHI to cloud providers unless consent explicitly captured
- ❌ Never log API keys
- ❌ Never log full prompts/responses (log usage + hash)
- ✅ Always track cost per tenant
- ✅ Always have a local fallback for PHI

## Token saving

Each multimodel module from scratch = ~300 lines. With template = ~80 lines unique
(custom routing logic, custom tasks). ~70% reduction.