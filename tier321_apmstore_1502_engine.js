// filepath: tier321_apmstore_1502_engine.js
// TIER321_APMSTORE-1502: APM METRICS STORE (pure, no db)
class ValidationError extends Error { constructor(message, field) { super(message); this.name = 'ValidationError'; this.field = field; this.kind = 'validation'; } }
function ensureStr(v, f) { if (typeof v !== 'string' || !v.length) throw new ValidationError(`${f} required`, f); }
function ensureMaxStr(v, f, max) { ensureStr(v, f); if (v.length > max) throw new ValidationError(`${f} must be <= ${max} chars`, f); }
function ensureNum(v, f) { if (typeof v !== 'number' || !Number.isFinite(v)) throw new ValidationError(`${f} must be a number`, f); }
function ensureNonNegNum(v, f) { ensureNum(v, f); if (v < 0) throw new ValidationError(`${f} must be >= 0`, f); }

const PROMPT_USD_PER_TOKEN = 3e-6;
const COMPLETION_USD_PER_TOKEN = 6e-6;

function band_for_ms(ms) {
  if (ms < 200) return 'fast';
  if (ms < 800) return 'normal';
  if (ms < 2000) return 'slow';
  return 'critical';
}

function validate_latency(req) {
  ensureStr(req.tenant_id, 'tenant_id');
  ensureMaxStr(req.route, 'route', 160);
  ensureNonNegNum(req.ms, 'ms');
  const band = band_for_ms(req.ms);
  return { kind: 'latency', tenant_id: req.tenant_id, route: req.route, value_num: req.ms, band };
}

function validate_llm_trace(req) {
  ensureStr(req.tenant_id, 'tenant_id');
  ensureStr(req.chain_name, 'chain_name');
  ensureNonNegNum(req.prompt_tokens, 'prompt_tokens');
  ensureNonNegNum(req.completion_tokens, 'completion_tokens');
  ensureNonNegNum(req.citations_count, 'citations_count');
  const est_cost_usd = Math.round((req.prompt_tokens * PROMPT_USD_PER_TOKEN + req.completion_tokens * COMPLETION_USD_PER_TOKEN) * 1e5) / 1e5;
  return {
    kind: 'llm_trace',
    tenant_id: req.tenant_id,
    value_num: req.prompt_tokens + req.completion_tokens,
    meta: { chain: req.chain_name, citations_ok: req.citations_count > 0, est_cost_usd }
  };
}

function funcs() { return { validate_latency, validate_llm_trace }; }
module.exports = { funcs, ValidationError };
