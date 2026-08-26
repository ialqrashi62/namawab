// tier322_know_1503_router.js — knowledge ingest + semantic search
// DUAL-MODE: uses pgvector (<=> ANN) when extension present; else JSONB+JS-cosine fallback.
const express = require('express');
const { query } = require('./db_postgres');
const { embed, chunkText } = require('./lib/embeddings');
const eng = require('./tier322_know_1503_engine.js');
const { ValidationError } = eng;
const r = express.Router();

function wrap(h) { return (req, res) => Promise.resolve(h(req, res)).catch(e => res.status(e instanceof ValidationError ? 400 : 500).json({ ok: false, error: e.message })); }

let MODE = null; // 'pgvector' | 'fallback'
async function detectMode() {
  if (MODE) return MODE;
  try {
    const x = await query("SELECT 1 FROM pg_extension WHERE extname='vector'");
    MODE = x.rows.length ? 'pgvector' : 'fallback';
  } catch { MODE = 'fallback'; }
  return MODE;
}
const toVecLiteral = v => '[' + v.join(',') + ']';

r.post('/ingest', wrap(async (req, res) => {
  const v = eng.validate_ingest(req.body || {});
  const mode = await detectMode();
  let inserted = 0, provider = '';
  for (const doc of v.docs) {
    const chunks = chunkText(doc.text);
    for (let i = 0; i < chunks.length; i++) {
      const { vec, provider: prov } = await embed(chunks[i]); provider = prov;
      if (mode === 'pgvector') {
        await query(
          'INSERT INTO knowledge_chunks (tenant_id, source_dept, source_doc, chunk_index, chunk, embedding) VALUES ($1,$2,$3,$4,$5,$6::vector)',
          [v.tenant_id, v.source_dept, doc.source, i, chunks[i], toVecLiteral(vec)]
        );
      } else {
        await query(
          'INSERT INTO knowledge_chunks_fb (tenant_id, source_dept, source_doc, chunk_index, chunk, embedding, provider) VALUES ($1,$2,$3,$4,$5,$6,$7)',
          [v.tenant_id, v.source_dept, doc.source, i, chunks[i], JSON.stringify(vec), prov]
        );
      }
      inserted++;
    }
  }
  res.json({ ok: true, result: { inserted, mode, provider } });
}));

r.post('/search', wrap(async (req, res) => {
  const v = eng.validate_search(req.body || {});
  const mode = await detectMode();
  const { vec } = await embed(v.query);
  let citations = [];
  if (mode === 'pgvector') {
    const lit = toVecLiteral(vec);
    const rows = (await query(
      `SELECT source_doc, chunk_index, chunk, 1 - (embedding <=> $1::vector) AS score
       FROM knowledge_chunks WHERE tenant_id::text = current_setting('app.tenant_id', true)
       ORDER BY embedding <=> $1::vector LIMIT $2`, [lit, v.topK])).rows;
    if (rows.length === 0 && v.tenant_id) {
      const alt = await query(
        `SELECT source_doc, chunk_index, chunk, 1 - (embedding <=> $1::vector) AS score
         FROM knowledge_chunks WHERE tenant_id::text = $3 ORDER BY embedding <=> $1::vector LIMIT $2`,
        [lit, v.topK, v.tenant_id]);
      rows.push(...alt.rows);
    }
    citations = rows.map(x => ({ source_doc: x.source_doc, chunk_index: x.chunk_index, chunk: String(x.chunk).slice(0, 400), score: +Number(x.score).toFixed(4) }));
  } else {
    let rows = (await query(
      "SELECT source_doc, chunk_index, chunk, embedding FROM knowledge_chunks_fb WHERE tenant_id::text = current_setting('app.tenant_id', true)", [])).rows;
    if (rows.length === 0 && v.tenant_id) {
      rows = (await query('SELECT source_doc, chunk_index, chunk, embedding FROM knowledge_chunks_fb WHERE tenant_id::text = $1', [v.tenant_id])).rows;
    }
    rows = rows.map(x => ({ ...x, embedding: typeof x.embedding === 'string' ? JSON.parse(x.embedding) : x.embedding }));
    citations = eng.rank_chunks(vec, rows).slice(0, v.topK);
  }
  res.json({ ok: true, result: { query: v.query, topK: v.topK, mode, citations } });
}));

module.exports = r;
