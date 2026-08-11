---
name: nm-rag-template
description: Use when building any RAG (Retrieval-Augmented Generation) pipeline. Loads the canonical chunk→embed→store→retrieve→rerank→compress→generate flow with PGVector. Saves ~75% tokens per RAG pipeline.
---

# RAG Template — PGVector + LangChain

## When to use

Any knowledge-base Q&A: clinical guidelines, ICD-10/CPT lookups, drug interactions,
lab reference ranges, hospital SOPs, patient education material.

## Pipeline (7 stages)

```
query → retrieve (vector) → rerank → compress → prompt → generate → cite
```

## Stage 1 — Chunking

```js
// namaweb/ai/chunker.js
const SPLITTERS = {
    'pdf':    (text) => text.split(/\n\n+/).filter(p => p.length > 50).slice(0, 200),
    'md':     (text) => text.split(/^##\s+/m).filter(s => s.length > 50).slice(0, 200),
    'cds':    (text) => text.split(/(?=\n\d+\.\s)/).filter(s => s.length > 30).slice(0, 200),
    'icd10':  (text) => text.split(/\n/).filter(l => /^[A-Z]\d{2}/.test(l)).slice(0, 500)
};

function chunkDocument(doc) {
    const splitter = SPLITTERS[doc.kind] || SPLITTERS.md;
    return splitter(doc.content).map((text, idx) => ({
        doc_id: doc.id, chunk_idx: idx, text,
        metadata: { ...doc.metadata, chunk_idx: idx }
    }));
}
```

## Stage 2 — Embedding

```js
// namaweb/ai/embedder.js
const { OpenAI } = require('openai');
const client = new OpenAI();

async function embedBatch(chunks) {
    const res = await client.embeddings.create({
        model: 'text-embedding-3-small',
        input: chunks.map(c => c.text),
        dimensions: 1536
    });
    return chunks.map((c, i) => ({ ...c, embedding: res.data[i].embedding }));
}
```

## Stage 3 — Storage (PGVector)

```js
// namaweb/ai/vector_store.js
const db = require('../db_postgres');

async function upsert(chunks) {
    for (const c of chunks) {
        const vec = `[${c.embedding.join(',')}]`;
        await db.query(`
            INSERT INTO ai_document_chunks (tenant_id, doc_id, chunk_idx, text, embedding, metadata)
            VALUES ($1,$2,$3,$4,$5::vector,$6)
            ON CONFLICT (doc_id, chunk_idx) DO UPDATE
            SET text = $4, embedding = $5::vector, metadata = $6
        `, [c.tenant_id || 1, c.doc_id, c.chunk_idx, c.text, vec, c.metadata]);
    }
}

async function search(tenantId, queryEmbedding, k = 8) {
    const vec = `[${queryEmbedding.join(',')}]`;
    const { rows } = await db.query(`
        SELECT chunk_idx, text, metadata,
               1 - (embedding <=> $2::vector) AS similarity
        FROM ai_document_chunks
        WHERE tenant_id = $1
        ORDER BY embedding <=> $2::vector
        LIMIT $3
    `, [tenantId, vec, k]);
    return rows;
}
```

## Stage 4 — Reranking (cross-encoder)

```js
// namaweb/ai/reranker.js
async function rerank(query, chunks, topK = 4) {
    // Cheap heuristic: BM25-style score
    const scored = chunks.map(c => ({
        ...c,
        rerank_score: score(query, c.text)
    })).sort((a,b) => b.rerank_score - a.rerank_score);
    return scored.slice(0, topK);
}
function score(q, t) {
    const qWords = new Set(q.toLowerCase().split(/\W+/).filter(w => w.length > 2));
    const tWords = t.toLowerCase().split(/\W+/);
    let s = 0; for (const w of tWords) if (qWords.has(w)) s++;
    return s / Math.sqrt(tWords.length + 1);
}
```

## Stage 5 — Compression

```js
async function compress(query, chunks, maxTokens = 1500) {
    let total = 0, out = [];
    for (const c of chunks) {
        total += c.text.length / 4; // rough token estimate
        if (total > maxTokens) break;
        out.push(c);
    }
    return out;
}
```

## Stage 6 — Prompt

```js
function buildPrompt(query, chunks) {
    return `You are a clinical decision support assistant for ${process.env.TENANT_NAME}.
Answer the question using ONLY the provided context. Cite each fact with [doc-N:chunk-M].
If unsure, say "I don't know based on provided documents."

Context:
${chunks.map((c, i) => `[doc-${i+1}:chunk-${c.chunk_idx}]\n${c.text}\n`).join('\n')}

Question: ${query}

Answer with citations:`;
}
```

## Stage 7 — Generate

```js
const { OpenAI } = require('openai');
const client = new OpenAI();
async function generate(prompt) {
    const r = await client.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.2,
        max_tokens: 800
    });
    return r.choices[0].message.content;
}
```

## End-to-end

```js
async function ask(tenantId, query) {
    const queryEmb = (await embedBatch([{ text: query }]))[0].embedding;
    const retrieved = await search(tenantId, queryEmb, 16);
    const reranked = await rerank(query, retrieved, 6);
    const compressed = await compress(query, reranked, 1500);
    const prompt = buildPrompt(query, compressed);
    const answer = await generate(prompt);
    return {
        answer,
        citations: compressed.map((c, i) => ({
            idx: i + 1,
            doc_id: c.metadata.doc_id,
            chunk_idx: c.chunk_idx,
            text: c.text.slice(0, 200)
        }))
    };
}
```

## Required migration

```sql
CREATE EXTENSION IF NOT EXISTS vector;

CREATE TABLE ai_document_chunks (
    id BIGSERIAL PRIMARY KEY,
    tenant_id BIGINT NOT NULL,
    doc_id TEXT NOT NULL,
    chunk_idx INT NOT NULL,
    text TEXT NOT NULL,
    embedding vector(1536) NOT NULL,
    metadata JSONB,
    created_at TIMESTAMPTZ DEFAULT now(),
    UNIQUE (doc_id, chunk_idx)
);

ALTER TABLE ai_document_chunks ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_document_chunks FORCE  ROW LEVEL SECURITY;

CREATE POLICY ai_chunks_tenant_isolation ON ai_document_chunks
    USING (tenant_id::text = current_setting('app.tenant_id', true))
    WITH CHECK (tenant_id::text = current_setting('app.tenant_id', true));
```

## Token saving

Each RAG pipeline from scratch = ~400 lines. With this template = ~100 lines of
unique data (which model, which docs, which splitter). ~75% reduction.