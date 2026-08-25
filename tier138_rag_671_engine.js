// filepath: tier138_rag_671_engine.js
class ValidationError extends Error { constructor(m, f) { super(m); this.field = f; } }
function ensureStr(v, f) { if (typeof v !== 'string' || !v) throw new ValidationError(`${f} required`, f); }
function ensureNum(v, f) { if (typeof v !== 'number' || isNaN(v)) throw new ValidationError(`${f} must be number`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }
function ensureEnum(v, f, list) { if (!list.includes(String(v))) throw new ValidationError(`${f} must be one of ${list.join('|')}`, f); }

function chunk_embed(req) {
  ensureStr(req.tenant_id, 'tid');
  ensureStr(req.document_id, 'did');
  ensureStr(req.text, 'tx');
  ensureEnum(req.chunker, 'ch', ['fixed_size','sentence','paragraph','heading','recursive','semantic','sliding_window','passage','tabular','code']);
  ensureNum(req.chunk_size, 'cs');
  ensureNum(req.overlap, 'ov');
  ensureStr(req.embedding_model, 'em');
  return { chunk_id: `ch_${Date.now()}`, document_id: req.document_id, chunker: req.chunker, size: req.chunk_size, embedding_model: req.embedding_model };
}
function vector_search(req) {
  ensureStr(req.tenant_id, 'tid');
  ensureStr(req.query, 'qu');
  ensureEnum(req.space, 'sp', ['cosine','l2','dot','manhattan','jaccard','hamming']);
  ensureNum(req.top_k, 'tk');
  ensureNum(req.min_score, 'ms');
  ensureEnum(req.filter, 'fl', ['none','tenant','document_type','specialty','date_range','author','language']);
  return { sr_id: `vs_${Date.now()}`, query: req.query, space: req.space, top_k: req.top_k, filter: req.filter };
}
function rerank(req) {
  ensureStr(req.tenant_id, 'tid');
  ensureStr(req.query, 'qu');
  ensureNum(req.candidate_count, 'cc');
  ensureNum(req.return_count, 'rc');
  ensureEnum(req.model, 'md', ['none','cross_encoder','colbert','BM25','TF_IDF','monot5','bge_reranker','llm_reranker']);
  ensureNum(req.score_threshold, 'st');
  ensureStr(req.model_version, 'mv');
  return { rr_id: `rr_${Date.now()}`, query: req.query, model: req.model, returned: req.return_count };
}
function rag_query(req) {
  ensureStr(req.tenant_id, 'tid');
  ensureStr(req.user_id, 'uid');
  ensureStr(req.query, 'qu');
  ensureStr(req.context, 'cx');
  ensureStr(req.answer, 'an');
  ensureNum(req.confidence, 'cf');
  ensureStr(req.citations, 'ci');
  ensureStr(req.model, 'md');
  return { rq_id: `rq_${Date.now()}`, user_id: req.user_id, query: req.query, answer: req.answer, confidence: req.confidence };
}
function hallucination_check(req) {
  ensureStr(req.tenant_id, 'tid');
  ensureStr(req.rq_id, 'ri');
  ensureNum(req.faithfulness, 'ft');
  ensureNum(req.relevance, 'rl');
  ensureNum(req.coverage, 'cv');
  ensureEnum(req.verdict, 'vd', ['grounded','partial','hallucinated','unsupported','unknown']);
  ensureStr(req.feedback, 'fb');
  return { hc_id: `hc_${Date.now()}`, rq_id: req.rq_id, faithfulness: req.faithfulness, verdict: req.verdict };
}

function funcs() { return { chunk_embed, vector_search, rerank, rag_query, hallucination_check }; }
module.exports = { funcs, ValidationError };
