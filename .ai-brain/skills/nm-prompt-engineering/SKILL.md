---
name: nm-prompt-engineering
description: Use when managing LLM prompts at scale. Loads the system prompt registry, context window budget, prompt versioning, A/B test patterns. Saves ~70% tokens per prompt management module.
---

# Prompt Engineering — Token-Saver

## When to use

Any LLM prompt needs management:
- System prompts for clinical engines
- Few-shot examples
- Prompt versioning / A/B testing
- Context window budget
- Prompt registry / catalog

## System prompt registry

```js
// namaweb/ai/prompts.js
const PROMPTS = {
    clinical_qa: {
        version: '1.2.0',
        author: 'cmo-team',
        ar: `أنت مساعد دعم القرار السريري لـ NamaMedical.
أجب باستخدام السياق فقط. استشهد بـ [doc-N:chunk-M] لكل حقيقة.
إذا لم تكن متأكداً، قل "لا أعرف بناءً على المستندات المقدمة."
لا تقدم تشخيصات أو توصيات علاجية نهائية - هذه مسؤولية الطبيب.
`,
        en: `You are a clinical decision support assistant for NamaMedical.
Answer using ONLY the context. Cite each fact with [doc-N:chunk-M].
If unsure, say "I don't know based on provided documents."
Do not provide final diagnoses or treatment recommendations - that is the physician's responsibility.
`
    },
    drug_interaction: {
        version: '1.0.1',
        author: 'pharmacy-team',
        ar: `أنت صيدلي خبير في التفاعلات الدوائية.
حلل الأدوية: {drugs}.
اذكر: 1) آلية التفاعل، 2) الخطورة، 3) التوصية.
استشهد بـ Lexicomp أو Micromedex.
`,
        en: `You are an expert pharmacist for drug-drug interactions.
Analyze: {drugs}.
State: 1) mechanism, 2) severity, 3) recommendation.
Cite Lexicomp or Micromedex.
`
    },
    icd10_suggest: {
        version: '2.0.0',
        author: 'coding-team',
        ar: `أنت مرمز طبي خبير (CCS, CIC).
اقترح أفضل 5 رموز ICD-10-CM للنص التالي:
{clinical_text}
المخرج: JSON array مع [code, name, confidence, rationale].
`,
        en: `You are an expert medical coder (CCS, CIC).
Suggest top 5 ICD-10-CM codes for: {clinical_text}.
Output: JSON array with [code, name, confidence, rationale].
`
    }
};

function getPrompt(key, locale = 'ar', vars = {}) {
    let p = PROMPTS[key][locale];
    for (const [k, v] of Object.entries(vars)) {
        p = p.replaceAll(`{${k}}`, v);
    }
    return p;
}

module.exports = { getPrompt, PROMPTS };
```

## Few-shot examples

```js
const FEW_SHOT = {
    grace_scoring: [
        { input: 'Patient 50 yo, SBP 130, HR 75, Killip 1, Cr 1.0',
          output: 'GRACE score 88, risk: low, recommend medical management' },
        { input: 'Patient 75 yo, SBP 95, HR 110, Killip 3, Cr 2.0',
          output: 'GRACE score 187, risk: very_high, recommend early invasive' }
    ]
};

function withFewShot(prompt, examples = FEW_SHOT.grace_scoring) {
    const shots = examples.map(e => `Example:\nInput: ${e.input}\nOutput: ${e.output}`).join('\n\n');
    return `${prompt}\n\n${shots}\n\nNow answer:\n`;
}
```

## Context window budget

```js
// namaweb/ai/budget.js
const BUDGETS = {
    'gpt-4o-mini':           { context: 128000, output: 16384, reserved: 5000 },
    'gpt-4o':                { context: 128000, output: 4096,  reserved: 5000 },
    'claude-3-5-sonnet':     { context: 200000, output: 8192,  reserved: 5000 },
    'claude-3-haiku':        { context: 200000, output: 4096,  reserved: 5000 }
};

function estimateTokens(text) {
    // ~4 chars per token for English; ~2 chars per token for Arabic (varies)
    const arabicChars = (text.match(/[\u0600-\u06FF]/g) || []).length;
    const otherChars  = text.length - arabicChars;
    return Math.ceil(arabicChars / 2 + otherChars / 4);
}

function budgetPlan(model, systemPrompt, history, context, userQuestion) {
    const sys = estimateTokens(systemPrompt);
    const hist = history.reduce((a, m) => a + estimateTokens(m.content), 0);
    const ctx = estimateTokens(context);
    const q   = estimateTokens(userQuestion);
    const total = sys + hist + ctx + q;
    const cap = BUDGETS[model].context - BUDGETS[model].output - BUDGETS[model].reserved;
    if (total > cap) {
        // Truncate context first, then history
        const overBy = total - cap;
        const ctxTrim = Math.max(0, ctx - overBy);
        return { ok: false, trimmedContext: ctxTrim, error: 'context_overflow' };
    }
    return { ok: true, totalTokens: total, remaining: cap - total };
}
```

## Prompt versioning & A/B test

```js
// namaweb/ai/ab_test.js
const { getPrompt } = require('./prompts');

const EXPERIMENTS = {
    clinical_qa_v2_vs_v1: {
        variants: { v1: 'clinical_qa@v1.0.0', v2: 'clinical_qa@v2.0.0' },
        splitBy: 'tenant_id',
        weights: { v1: 0.5, v2: 0.5 },
        metrics: ['latency', 'token_count', 'citation_rate', 'user_thumb_up']
    }
};

function pickVariant(experimentKey, userId) {
    const exp = EXPERIMENTS[experimentKey];
    const hash = crypto.createHash('md5').update(userId + experimentKey).digest('hex');
    const bucket = parseInt(hash.slice(0, 8), 16) / 0xffffffff;
    let acc = 0;
    for (const [variant, weight] of Object.entries(exp.weights)) {
        acc += weight;
        if (bucket <= acc) return variant;
    }
    return Object.keys(exp.weights)[0];
}

async function askWithExperiment(experimentKey, userId, locale, vars, question) {
    const variant = pickVariant(experimentKey, userId);
    const promptKey = EXPERIMENTS[experimentKey].variants[variant];
    const systemPrompt = getPrompt(promptKey, locale, vars);
    // ... call LLM ...
    // Track metrics: latency, tokens, citation_count, user_feedback
    return { response, variant };
}
```

## Prompt audit log

```js
async function logPrompt({ userId, tenantId, promptKey, version, inputHash, outputHash,
                            latencyMs, tokenCount, model, feedback }) {
    await db.query(`
        INSERT INTO ai_prompt_log (tenant_id, user_id, prompt_key, version,
            input_hash, output_hash, latency_ms, token_count, model, feedback)
        VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)
    `, [tenantId, userId, promptKey, version, inputHash, outputHash,
        latencyMs, tokenCount, model, feedback]);
}
```

## Required env

```bash
OPENAI_API_KEY=sk-...
ANTHROPIC_API_KEY=sk-ant-...
LANGCHAIN_PROJECT=nama-medical
PROMPT_LOG_ENABLED=true
```

## Safety

- ❌ Never include real PHI in prompts (anonymize first)
- ❌ Never log full prompts (log input_hash only)
- ❌ Never trust LLM output for clinical decisions (always human review)
- ❌ Never bypass `validateBody` even with "smart" prompts

## Token saving

Each prompt module from scratch = ~200 lines. With template = ~60 lines unique
(prompt text, variables). ~70% reduction.