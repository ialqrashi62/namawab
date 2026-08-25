// tier322_know_1503_router.js â€” knowledge ingest + semantic search (JSONB embeddings)
const express = require('express');
const { query } = require('./db_postgres');
const { embed, chunkText } = require('./lib/embeddings');
const eng = require('./tier322_know_1503_engine.js');
const { ValidationError } = eng;
const r = express.Router();

function wrap(h) { return (req, res) => Promise.resolve(h(req, res)).catch(e => res.status(e instanceof ValidationError ? 400 : 500).json({ ok: false, error: e.message })); }

r.post('/ingest', wrap(async (req, res) => {
  const v = eng.validate_ingest(req.body || {});
  let inserted = 0;
  for (const doc of v.docs) {
    const chunks = chunkText(doc.text);
    for (let i = 0; i < chunks.length; i++) {
      const { vec, provider } = await embed(chunks[i]);
      await query(
        'INSERT INTO knowledge_chunks_fb (tenant_id, source_dept, source_doc, chunk_index, chunk, embedding, provider) VALUES ($1,$2,$3,$4,$5,$6,$7)',
        [v.tenant_id, v.source_dept, doc.source, i, chunks[i], JSON.stringify(vec), provider]
      );
      inserted++;
    }
  }
  res.json({ ok: true, result: { inserted, provider_note: 'fallback256 unless OPENAI_API_KEY set' } });
}));

r.post('/search', wrap(async (req, res) => {
  const v = eng.validate_search(req.body || {});
  const { vec } = await embed(v.query);
  let rows = (await query(
    "SELECT source_doc, chunk_index, chunk, embedding FROM knowledge_chunks_fb WHERE tenant_id::text = current_setting('app.tenant_id', true)",
    []
  )).rows;
  if (rows.length === 0 && v.tenant_id) {
    // Fallback for non-session callers (service-to-service/tests): explicit scoped read
    rows = (await query(
      'SELECT source_doc, chunk_index, chunk, embedding FROM knowledge_chunks_fb WHERE tenant_id::text = $1',
      [v.tenant_id]
    )).rows;
  }
  rows = rows.map(x => ({ ...x, embedding: typeof x.embedding === 'string' ? JSON.parse(x.embedding) : x.embedding }));
  const ranked = eng.rank_chunks(vec, rows).slice(0, v.topK);
  res.json({ ok: true, result: { query: v.query, topK: v.topK, citations: ranked } });
}));

module.exports = r;
