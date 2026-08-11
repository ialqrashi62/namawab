---
name: nm-vector-store
description: Use when storing or querying vector embeddings (RAG, semantic search, AI co-pilot). Loads the canonical PGVector schema, HNSW index, search query, and metadata filters. Saves ~75% tokens per vector module.
---

# Vector Store — PGVector (PostgreSQL)

## When to use

Any place you need semantic search:
- Clinical guidelines RAG
- Drug interaction lookups (semantic)
- ICD-10 / CPT code search
- Lab reference range lookup
- Patient education content retrieval
- Discharge summary similarity (readmission risk)

## Required schema

```sql
-- migrations/eNN_ai_vector_up.sql
CREATE EXTENSION IF NOT EXISTS vector;

CREATE TABLE IF NOT EXISTS ai_document_chunks (
    id BIGSERIAL PRIMARY KEY,
    tenant_id BIGINT NOT NULL,
    doc_id TEXT NOT NULL,
    doc_kind TEXT NOT NULL,           -- 'pdf'|'md'|'cds'|'icd10'|'drug'|'lab'
    chunk_idx INT NOT NULL,
    text TEXT NOT NULL,
    embedding vector(1536) NOT NULL,
    metadata JSONB,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now(),
    UNIQUE (doc_id, chunk_idx)
);

-- HNSW index for fast ANN search
CREATE INDEX IF NOT EXISTS idx_ai_chunks_embedding
    ON ai_document_chunks USING hnsw (embedding vector_cosine_ops)
    WITH (m = 16, ef_construction = 64);

CREATE INDEX IF NOT EXISTS idx_ai_chunks_tenant_doc
    ON ai_document_chunks (tenant_id, doc_kind, doc_id);

ALTER TABLE ai_document_chunks ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_document_chunks FORCE  ROW LEVEL SECURITY;

CREATE POLICY ai_chunks_tenant_isolation ON ai_document_chunks
    USING (tenant_id::text = current_setting('app.tenant_id', true))
    WITH CHECK (tenant_id::text = current_setting('app.tenant_id', true));
```

## Core operations

```js
// namaweb/ai/vector_store.js
const db = require('../db_postgres');

async function upsert(tenantId, { docId, docKind, chunks, embeddings }) {
    for (let i = 0; i < chunks.length; i++) {
        const vec = `[${embeddings[i].join(',')}]`;
        await db.query(`
            INSERT INTO ai_document_chunks
              (tenant_id, doc_id, doc_kind, chunk_idx, text, embedding, metadata)
            VALUES ($1,$2,$3,$4,$5,$6::vector,$7)
            ON CONFLICT (doc_id, chunk_idx) DO UPDATE
            SET text = $5, embedding = $6::vector, metadata = $7, updated_at = now()
        `, [tenantId, docId, docKind, i, chunks[i].text, vec, chunks[i].metadata || {}]);
    }
}

async function search(tenantId, queryEmbedding, { k = 8, docKind = null, minSim = 0.7 } = {}) {
    const vec = `[${queryEmbedding.join(',')}]`;
    const params = [tenantId, vec, k, minSim];
    let where = `tenant_id = $1`;
    if (docKind) { where += ` AND doc_kind = $5`; params.push(docKind); }
    const { rows } = await db.query(`
        SELECT id, doc_id, doc_kind, chunk_idx, text, metadata,
               1 - (embedding <=> $2::vector) AS similarity
        FROM ai_document_chunks
        WHERE ${where} AND 1 - (embedding <=> $2::vector) >= $4
        ORDER BY embedding <=> $2::vector
        LIMIT $3
    `, params);
    return rows;
}

async function hybridSearch(tenantId, queryText, queryEmbedding, { k = 8, bm25Weight = 0.3 } = {}) {
    // Vector + BM25 hybrid (Postgres full-text + vector)
    const vec = `[${queryEmbedding.join(',')}]`;
    const { rows } = await db.query(`
        WITH vec AS (
            SELECT id, text, metadata, 1 - (embedding <=> $2::vector) AS vscore
            FROM ai_document_chunks
            WHERE tenant_id = $1
            ORDER BY embedding <=> $2::vector LIMIT $3 * 4
        ),
        ft AS (
            SELECT id, text, metadata,
                   ts_rank(to_tsvector('simple', text), plainto_tsquery('simple', $4)) AS bscore
            FROM ai_document_chunks
            WHERE tenant_id = $1 AND to_tsvector('simple', text) @@ plainto_tsquery('simple', $4)
        )
        SELECT
            COALESCE(v.id, f.id) AS id,
            COALESCE(v.text, f.text) AS text,
            COALESCE(v.metadata, f.metadata) AS metadata,
            COALESCE(v.vscore, 0) * (1 - $5) + COALESCE(f.bscore, 0) * $5 AS combined_score
        FROM vec v FULL OUTER JOIN ft f USING (id)
        ORDER BY combined_score DESC LIMIT $3
    `, [tenantId, vec, k, queryText, bm25Weight]);
    return rows;
}

async function delete(tenantId, docId) {
    await db.query(`DELETE FROM ai_document_chunks WHERE tenant_id = $1 AND doc_id = $2`, [tenantId, docId]);
}

async function count(tenantId, docKind = null) {
    const params = [tenantId];
    let q = 'SELECT COUNT(*)::int AS n FROM ai_document_chunks WHERE tenant_id = $1';
    if (docKind) { q += ' AND doc_kind = $2'; params.push(docKind); }
    const { rows } = await db.query(q, params);
    return rows[0].n;
}

module.exports = { upsert, search, hybridSearch, delete, count };
```

## Embedding model interface

```js
// namaweb/ai/embedder.js
const { OpenAI } = require('openai');
const client = new OpenAI();

async function embedBatch(texts) {
    const res = await client.embeddings.create({
        model: 'text-embedding-3-small',
        input: texts,
        dimensions: 1536
    });
    return res.data.map(d => d.embedding);
}

module.exports = { embedBatch };
```

## Use in router

```js
const vectorStore = require('./ai/vector_store');
const { embedBatch } = require('./ai/embedder');

router.post('/semantic-search',
    requireAuth,
    requireTenantScope,
    requireRole('doctor', 'nurse'),
    async (req, res) => {
        const { query, docKind, k = 8 } = req.body;
        const [emb] = await embedBatch([query]);
        const hits = await vectorStore.search(req.tenantId, emb, { k, docKind });
        res.json({ query, hits });
    }
);
```

## HNSW tuning

| Workload | m | ef_construction |
|---|---|---|
| Small (< 100K chunks) | 16 | 64 |
| Medium (100K-1M) | 32 | 128 |
| Large (> 1M) | 48 | 256 |

## Token saving

Each vector module = ~250 lines from scratch → ~80 lines with template. ~70% reduction.