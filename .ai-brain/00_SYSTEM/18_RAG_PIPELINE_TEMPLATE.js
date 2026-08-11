/**
 * RAG Pipeline Template
 * NamaMedical
 *
 * Pipeline: chunk → embed → upsert (ingest) | query → retrieve → rerank → answer
 *
 * @module core/rag
 */

'use strict';

const crypto = require('node:crypto');

/**
 * Chunking strategies
 */
const ChunkingStrategy = {
  FIXED: 'fixed',         // 512 chars, 50 overlap
  SEMANTIC: 'semantic',   // split on \n\n or headers
  RECURSIVE: 'recursive', // split on sentences
  TOKEN: 'token',         // 256 tokens, 32 overlap
};

/**
 * Simple fixed-size chunker with overlap
 */
function chunkFixed(text, opts = {}) {
  const size = opts.size || 512;
  const overlap = opts.overlap || 50;
  const chunks = [];
  let i = 0;
  while (i < text.length) {
    const end = Math.min(i + size, text.length);
    const chunk = text.slice(i, end).trim();
    if (chunk.length > 0) {
      chunks.push({
        text: chunk,
        index: chunks.length,
        start: i,
        end,
      });
    }
    i += size - overlap;
  }
  return chunks;
}

/**
 * Semantic chunker (split on \n\n or paragraph breaks)
 */
function chunkSemantic(text, opts = {}) {
  const minSize = opts.minSize || 100;
  const maxSize = opts.maxSize || 1500;
  const chunks = [];
  const paragraphs = text.split(/\n\s*\n/);
  let buffer = '';
  for (const p of paragraphs) {
    if ((buffer + p).length > maxSize && buffer.length >= minSize) {
      chunks.push({ text: buffer.trim(), index: chunks.length });
      buffer = '';
    }
    buffer += (buffer ? '\n\n' : '') + p;
  }
  if (buffer.trim().length >= minSize) {
    chunks.push({ text: buffer.trim(), index: chunks.length });
  } else if (buffer.trim().length > 0 && chunks.length > 0) {
    chunks[chunks.length - 1].text += '\n\n' + buffer.trim();
  }
  return chunks;
}

/**
 * Hash a chunk for stable ID
 */
function chunkId(text, source) {
  const hash = crypto.createHash('sha256').update(text + '|' + (source || '')).digest('hex');
  return hash.slice(0, 32);
}

/**
 * Ingest pipeline
 * @param {Object} opts
 * @param {string} opts.text - source text
 * @param {string} opts.source - source identifier
 * @param {Function} opts.embedFn - async (text) => number[]
 * @param {Object} opts.db - DB client (pg)
 * @param {string} opts.table - vector table name
 * @param {string} opts.strategy - chunking strategy
 * @param {Object} opts.metadata - extra metadata
 */
async function ingest(opts) {
  const { text, source, embedFn, db, table, strategy = ChunkingStrategy.SEMANTIC, metadata = {} } = opts;

  // 1. Chunk
  let chunks;
  if (strategy === ChunkingStrategy.FIXED) chunks = chunkFixed(text);
  else chunks = chunkSemantic(text);

  // 2. Embed (batched for efficiency)
  const batchSize = 32;
  const embedded = [];
  for (let i = 0; i < chunks.length; i += batchSize) {
    const batch = chunks.slice(i, i + batchSize);
    const vectors = await Promise.all(batch.map((c) => embedFn(c.text)));
    batch.forEach((c, j) => embedded.push({ ...c, embedding: vectors[j] }));
  }

  // 3. Upsert (delete-by-source-then-insert, idempotent)
  await db.query(`DELETE FROM ${table} WHERE source = $1`, [source]);
  for (const c of embedded) {
    const id = chunkId(c.text, source);
    await db.query(
      `INSERT INTO ${table} (id, source, chunk_index, text, embedding, metadata, tenant_id, created_at)
       VALUES ($1, $2, $3, $4, $5::vector, $6, $7, now())
       ON CONFLICT (id) DO UPDATE SET text = $4, embedding = $5::vector, metadata = $6`,
      [
        id,
        source,
        c.index,
        c.text,
        JSON.stringify(c.embedding),
        JSON.stringify(metadata),
        metadata.tenant_id,
      ]
    );
  }

  return { source, chunks: embedded.length, strategy };
}

/**
 * Retrieve pipeline
 * @param {Object} opts
 * @param {string} opts.query - search query
 * @param {Function} opts.embedFn - async (text) => number[]
 * @param {Object} opts.db - DB client
 * @param {string} opts.table - vector table
 * @param {number} opts.topK - number of results (default 5)
 * @param {string} opts.tenantId - tenant filter
 * @param {number} opts.threshold - minimum similarity (default 0.7)
 */
async function retrieve(opts) {
  const { query, embedFn, db, table, topK = 5, tenantId, threshold = 0.7 } = opts;

  // 1. Embed query
  const queryEmbedding = await embedFn(query);

  // 2. Vector search
  const sql = `
    SELECT id, source, text, metadata, chunk_index,
           1 - (embedding <=> $1::vector) AS similarity
    FROM ${table}
    WHERE tenant_id = $2
      AND 1 - (embedding <=> $1::vector) > $3
    ORDER BY embedding <=> $1::vector
    LIMIT $4
  `;
  const result = await db.query(sql, [
    JSON.stringify(queryEmbedding),
    tenantId,
    threshold,
    topK,
  ]);

  return result.rows.map((row) => ({
    id: row.id,
    source: row.source,
    text: row.text,
    metadata: row.metadata,
    chunkIndex: row.chunk_index,
    similarity: parseFloat(row.similarity),
  }));
}

/**
 * Rerank results (cross-encoder style, simple keyword overlap)
 */
function rerank(query, results, opts = {}) {
  const queryTerms = new Set(query.toLowerCase().split(/\W+/).filter(Boolean));
  return results
    .map((r) => {
      const textTerms = new Set(r.text.toLowerCase().split(/\W+/).filter(Boolean));
      const overlap = [...queryTerms].filter((t) => textTerms.has(t)).length;
      const overlapScore = overlap / Math.max(queryTerms.size, 1);
      const combined = (1 - opts.alpha) * r.similarity + opts.alpha * overlapScore;
      return { ...r, combinedScore: combined };
    })
    .sort((a, b) => b.combinedScore - a.combinedScore);
}

/**
 * Build a context string from retrieved chunks
 */
function buildContext(chunks, opts = {}) {
  const maxLength = opts.maxLength || 4000;
  let ctx = '';
  for (const c of chunks) {
    const block = `[${c.source}#${c.chunkIndex}, sim=${c.similarity.toFixed(3)}]\n${c.text}\n\n`;
    if ((ctx + block).length > maxLength) break;
    ctx += block;
  }
  return ctx.trim();
}

module.exports = {
  ChunkingStrategy,
  chunkFixed,
  chunkSemantic,
  chunkId,
  ingest,
  retrieve,
  rerank,
  buildContext,
};
