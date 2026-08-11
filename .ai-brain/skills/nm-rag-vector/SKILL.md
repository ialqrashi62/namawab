---
name: nm-rag-vector
description: Use when wiring RAG + Vector Store + LangChain together for any AI co-pilot feature. Loads the canonical architecture: chunker → embedder → vector store → retriever → reranker → LLM. Saves ~75% tokens per AI module.
---

# RAG + Vector + LangChain Integration

## When to use

An AI co-pilot feature:
- Clinical Q&A (guidelines, protocols)
- Drug interaction explainer
- Lab result interpretation
- ICD-10/CPT code suggester
- Patient education content generator
- Discharge summary assist

## Architecture (one diagram)

```
                            ┌─────────────────┐
                            │   User Query    │
                            └────────┬────────┘
                                     │
                                     ▼
              ┌────────────────────────────────────────────┐
              │       Query Preprocessor                   │
              │   (anonymize PHI, language detect,         │
              │    rephrase, expand abbreviations)         │
              └─────────────────────┬──────────────────────┘
                                    │
                                    ▼
              ┌────────────────────────────────────────────┐
              │   Hybrid Retriever                         │
              │   - Vector search (pgvector, top 16)       │
              │   - BM25 full-text search (top 16)         │
              │   - Combine + deduplicate (top 24)         │
              └─────────────────────┬──────────────────────┘
                                    │
                                    ▼
              ┌────────────────────────────────────────────┐
              │   Reranker                                  │
              │   - Cross-encoder OR heuristic              │
              │   - Take top 6                              │
              └─────────────────────┬──────────────────────┘
                                    │
                                    ▼
              ┌────────────────────────────────────────────┐
              │   Compressor                                │
              │   - Truncate to budget (e.g. 1500 tokens)  │
              │   - Drop irrelevant chunks                  │
              └─────────────────────┬──────────────────────┘
                                    │
                                    ▼
              ┌────────────────────────────────────────────┐
              │   Prompt Builder                            │
              │   - System prompt (per locale)              │
              │   - Context block                           │
              │   - User question                           │
              │   - Few-shot examples (optional)            │
              └─────────────────────┬──────────────────────┘
                                    │
                                    ▼
              ┌────────────────────────────────────────────┐
              │   LLM (gpt-4o-mini / claude-3-haiku)        │
              │   - Generate answer with citations          │
              │   - Track token usage, latency              │
              └─────────────────────┬──────────────────────┘
                                    │
                                    ▼
              ┌────────────────────────────────────────────┐
              │   Post-processor                            │
              │   - Parse citations [doc-N:chunk-M]         │
              │   - Confidence scoring                      │
              │   - Disclaimer ("not a substitute...")      │
              │   - Log to ai_prompt_log                    │
              └─────────────────────┬──────────────────────┘
                                    │
                                    ▼
              ┌────────────────────────────────────────────┐
              │   Response to user                          │
              │   - Answer text                             │
              │   - Citation list (clickable)               │
              │   - Confidence badge                        │
              │   - Feedback widget (thumb up/down)         │
              └────────────────────────────────────────────┘
```

## Full orchestrator

```js
// namaweb/ai/co_pilot.js
const { embedBatch } = require('./embedder');
const vectorStore = require('./vector_store');
const { getPrompt } = require('./prompts');
const { generate } = require('./llm');
const { hybridSearch } = require('./hybrid_search');
const { rerank, compress, buildPrompt, parseCitations } = require('./pipeline_utils');
const db = require('../db_postgres');
const logger = require('../middleware/logger');

async function ask({ tenantId, userId, role, query, locale = 'ar', docKind = null }) {
    const start = Date.now();

    // 1. Anonymize PHI
    const anonQuery = anonymize(query);

    // 2. Embed query
    const [emb] = await embedBatch([anonQuery]);

    // 3. Hybrid retrieval
    const candidates = await hybridSearch(tenantId, anonQuery, emb, { k: 24, docKind });

    // 4. Rerank
    const reranked = await rerank(query, candidates, 6);

    // 5. Compress to budget
    const compressed = await compress(query, reranked, 1500);

    // 6. Build prompt
    const systemPrompt = getPrompt('clinical_qa', locale, { role });
    const userPrompt = buildPrompt(query, compressed);

    // 7. Generate
    const answer = await generate({ system: systemPrompt, user: userPrompt, model: 'gpt-4o-mini' });

    // 8. Parse citations
    const citations = parseCitations(answer, compressed);

    // 9. Confidence scoring
    const confidence = scoreConfidence(answer, reranked);

    // 10. Log
    const latency = Date.now() - start;
    await db.query(`
        INSERT INTO ai_prompt_log (tenant_id, user_id, prompt_key, version, locale,
            input_hash, output_hash, latency_ms, token_count, model, citations)
        VALUES ($1,$2,'clinical_qa','1.2.0',$3,$4,$5,$6,$7,'gpt-4o-mini',$8)
    `, [tenantId, userId, locale,
        hash(anonQuery), hash(answer), latency,
        estimateTokens(systemPrompt + userPrompt + answer),
        JSON.stringify(citations)]);

    return {
        answer,
        citations,
        confidence,
        disclaimer: 'This is decision support. Final diagnosis and treatment remain the physician\'s responsibility.',
        latency_ms: latency
    };
}

function anonymize(text) {
    // Replace MRN patterns
    return text.replace(/\bMRN[-\s]?\d+\b/gi, '[MRN]')
               .replace(/\b\d{10}\b/g, '[PHONE]')
               .replace(/\b\d{1,2}\/\d{1,2}\/\d{2,4}\b/g, '[DATE]');
}

function hash(s) {
    return require('crypto').createHash('sha256').update(s).digest('hex');
}

module.exports = { ask };
```

## Router

```js
const { ask } = require('../ai/co_pilot');
const { requireAuth, requireTenantScope, requireRole, validateBody } = require('../mw');
const RS = require('../route_schemas');

router.post('/ai/co-pilot/ask',
    requireAuth,
    requireTenantScope,
    requireRole('doctor', 'nurse'),
    validateBody(RS.aiAsk),
    async (req, res) => {
        const r = await ask({
            tenantId: req.tenantId,
            userId: req.userId,
            role: req.userRole,
            query: req.validated.query,
            locale: req.validated.locale || 'ar',
            docKind: req.validated.doc_kind
        });
        res.json(r);
    }
);
```

## Validation schema

```js
// route_schemas.js — add
const aiAsk = {
    type: 'object',
    required: ['query'],
    properties: {
        query:    { type: 'string', minLength: 3, maxLength: 2000 },
        locale:   { type: 'string', enum: ['ar', 'en', 'fr', 'ur'] },
        doc_kind: { type: 'string', enum: ['pdf', 'md', 'cds', 'icd10', 'drug', 'lab'] }
    },
    additionalProperties: false
};
```

## Token saving

Each AI co-pilot from scratch = ~600 lines. With template = ~150 lines unique
(custom retrieval logic, custom prompt, custom parsing). ~75% reduction.