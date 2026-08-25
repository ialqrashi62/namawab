// filepath: namaweb/ai/vector_store.js
// Vector store -- REAL[] version (no pgvector required)
// Pattern: nm-vector-store (adapted for simplicity)
'use strict';

const db = require('../db_postgres');

/**
 * Upsert chunks with embeddings.
 * @param {number} tenantId
 * @param {Object} opts - { docId, docKind, chunks: [{text, metadata}], embeddings: [[float,...]] }
 */
async function upsert(tenantId, { docId, docKind, chunks, embeddings }) {
    for (let i = 0; i < chunks.length; i++) {
        const vec = embeddings[i];
        const norm = Math.sqrt(vec.reduce((s, x) => s + x * x, 0));

        await db.query(`
            INSERT INTO ai_document_chunks
              (tenant_id, doc_id, doc_kind, chunk_idx, text, embedding, embedding_norm, metadata)
            VALUES ($1,$2,$3,$4,$5,$6::real[],$7,$8)
            ON CONFLICT (doc_id, chunk_idx) DO UPDATE
            SET text = $5, embedding = $6::real[], embedding_norm = $7, metadata = $8, updated_at = now()
        `, [tenantId, docId, docKind, i, chunks[i].text, vec, norm, chunks[i].metadata || {}]);
    }
}

/**
 * Vector search using cosine similarity in JS.
 * similarity = (A.B) / (||A|| * ||B||)
 */
async function search(tenantId, queryEmbedding, { k = 8, docKind = null, minSim = 0.6 } = {}) {
    const qNorm = Math.sqrt(queryEmbedding.reduce((s, x) => s + x * x, 0));
    if (qNorm === 0) return [];

    let sql = `SELECT id, doc_id, doc_kind, chunk_idx, text, metadata, embedding, embedding_norm
               FROM ai_document_chunks
               WHERE tenant_id = $1 AND embedding_norm > 0`;
    const params = [tenantId];
    if (docKind) { sql += ` AND doc_kind = $2`; params.push(docKind); }

    const { rows } = await db.query(sql, params);

    const scored = rows.map(r => {
        let dot = 0;
        const e = r.embedding || [];
        const len = Math.min(e.length, queryEmbedding.length);
        for (let i = 0; i < len; i++) dot += e[i] * queryEmbedding[i];
        return {
            id: r.id, doc_id: r.doc_id, doc_kind: r.doc_kind,
            chunk_idx: r.chunk_idx, text: r.text, metadata: r.metadata,
            similarity: dot / (qNorm * (r.embedding_norm || 1))
        };
    });

    scored.sort((a, b) => b.similarity - a.similarity);
    return scored.slice(0, k).filter(r => r.similarity >= minSim);
}

/**
 * Hybrid search: vector + BM25 full-text
 */
async function hybridSearch(tenantId, queryText, queryEmbedding, { k = 8, bm25Weight = 0.3 } = {}) {
    const vectorResults = await search(tenantId, queryEmbedding, { k: k * 4, minSim: 0 });

    const { rows: bm25Results } = await db.query(`
        SELECT id, doc_id, doc_kind, chunk_idx, text, metadata,
               ts_rank(to_tsvector('simple', text), plainto_tsquery('simple', $2)) AS bscore
        FROM ai_document_chunks
        WHERE tenant_id = $1
          AND to_tsvector('simple', text) @@ plainto_tsquery('simple', $2)
    `, [tenantId, queryText]);

    const combined = new Map();

    for (const v of vectorResults) {
        combined.set(v.id, { ...v, combined: (v.similarity || 0) * (1 - bm25Weight) });
    }
    for (const b of bm25Results) {
        const existing = combined.get(b.id);
        const bScore = (b.bscore || 0) * bm25Weight;
        if (existing) {
            existing.combined += bScore;
        } else {
            combined.set(b.id, {
                id: b.id, doc_id: b.doc_id, doc_kind: b.doc_kind,
                chunk_idx: b.chunk_idx, text: b.text, metadata: b.metadata,
                combined: bScore
            });
        }
    }

    return [...combined.values()]
        .sort((a, b) => (b.combined || 0) - (a.combined || 0))
        .slice(0, k)
        .map(c => ({ ...c, similarity: c.combined || c.similarity || 0 }));
}

async function deleteDoc(tenantId, docId) {
    await db.query(`DELETE FROM ai_document_chunks WHERE tenant_id = $1 AND doc_id = $2`, [tenantId, docId]);
}

async function count(tenantId, docKind = null) {
    const params = [tenantId];
    let q = 'SELECT COUNT(*)::int AS n FROM ai_document_chunks WHERE tenant_id = $1';
    if (docKind) { q += ' AND doc_kind = $2'; params.push(docKind); }
    const { rows } = await db.query(q, params);
    return rows[0].n;
}

async function listDocs(tenantId) {
    const { rows } = await db.query(`
        SELECT doc_id, doc_kind, COUNT(*)::int AS chunk_count, MAX(updated_at) AS last_updated
        FROM ai_document_chunks
        WHERE tenant_id = $1
        GROUP BY doc_id, doc_kind
        ORDER BY last_updated DESC
    `, [tenantId]);
    return rows;
}

module.exports = { upsert, search, hybridSearch, deleteDoc, count, listDocs };