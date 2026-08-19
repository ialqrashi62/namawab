/**
 * BCMA RAG Pipeline
 * Query → embed → pgvector search → rerank → return
 */

'use strict';

const CITATIONS = { ISMP: 'ISMP 5 Rights 2024', SFDA: 'SFDA Saudi 2024' };

async function cosineSimilarity(a, b) {
  if (!a || !b || a.length !== b.length) return 0;
  let dot = 0, na = 0, nb = 0;
  for (let i = 0; i < a.length; i++) { dot += a[i] * b[i]; na += a[i] * a[i]; nb += b[i] * b[i]; }
  return dot / (Math.sqrt(na) * Math.sqrt(nb) + 1e-9);
}

async function ragRetrieve(db, embedding, topK = 5, tenantId = 1) {
  const candidates = await db.query('SELECT id, source, doc_id, chunk_text, embedding FROM bcma_vectors WHERE tenant_id=$1', [tenantId]);
  const scored = [];
  for (const row of candidates.rows) {
    const sim = await cosineSimilarity(embedding, row.embedding);
    scored.push({ id: row.id, source: row.source, doc_id: row.doc_id, text: row.chunk_text, score: sim });
  }
  scored.sort((a, b) => b.score - a.score);
  return scored.slice(0, topK);
}

async function rerank(query, chunks) {
  return chunks;  // placeholder; production uses cross-encoder
}

async function ragAnswer(db, embedding, query, tenantId = 1) {
  const retrieved = await ragRetrieve(db, embedding, 5, tenantId);
  const reranked = await rerank(query, retrieved);
  return { answer: reranked.map(c => c.text).join('\n'), sources: reranked.map(c => ({ source: c.source, doc_id: c.doc_id, score: c.score })) };
}

module.exports = { cosineSimilarity, ragRetrieve, rerank, ragAnswer, CITATIONS };