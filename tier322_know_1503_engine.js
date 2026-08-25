// tier322_know_1503_engine.js — knowledge ingestion & semantic search (pure validation/scoring)
class ValidationError extends Error { constructor(m, f) { super(m); this.field = f; } }
function ensureStr(v, f) { if (typeof v !== 'string' || !v.trim()) throw new ValidationError(`${f} must be string`, f); }
function ensureNum(v, f) { if (typeof v !== 'number' || isNaN(v)) throw new ValidationError(`${f} must be number`, f); }
function ensureEnum(v, f, list) { if (!list.includes(String(v))) throw new ValidationError(`${f} must be one of ${list.join('|')}`, f); }

function validate_ingest(req) {
  ensureStr(req.tenant_id, 'tid'); ensureStr(req.source_dept, 'dept');
  if (!Array.isArray(req.docs) || req.docs.length === 0) throw new ValidationError('docs[] required', 'docs');
  for (const d of req.docs) {
    if (!d || typeof d.source !== 'string' || typeof d.text !== 'string') throw new ValidationError('each doc needs source+text', 'docs');
  }
  return { tenant_id: req.tenant_id, source_dept: req.source_dept, docs: req.docs };
}

function validate_search(req) {
  ensureStr(req.tenant_id, 'tid'); ensureStr(req.query, 'q');
  const topK = req.topK && req.topK > 0 && req.topK <= 20 ? req.topK : 5;
  return { tenant_id: req.tenant_id, query: req.query, topK };
}

function rank_chunks(queryVec, rows) {
  // rows: [{chunk, embedding(array), source_doc, chunk_index}]
  const scored = rows.map(r => {
    let sim = 0;
    try { sim = cosineSim(queryVec, r.embedding); } catch (_) { sim = -1; }
    return { source_doc: r.source_doc, chunk_index: r.chunk_index, chunk: String(r.chunk).slice(0, 400), score: +sim.toFixed(4) };
  });
  return scored.sort((a, b) => b.score - a.score);
}

function cosineSim(a, b) {
  const n = Math.min(a.length, b.length);
  let dot = 0, na = 0, nb = 0;
  for (let i = 0; i < n; i++) { dot += a[i] * b[i]; na += a[i] * a[i]; nb += b[i] * b[i]; }
  return dot / (Math.sqrt(na) * Math.sqrt(nb) || 1);
}

module.exports = { ValidationError, validate_ingest, validate_search, rank_chunks, cosineSim };
