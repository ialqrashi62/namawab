// tier317_apm_1498_engine.js — APM, Logging & LLM Observability
class ValidationError extends Error { constructor(m, f) { super(m); this.field = f; } }
function ensureStr(v, f) { if (typeof v !== 'string' || !v.trim()) throw new ValidationError(`${f} must be string`, f); }
function ensureNum(v, f) { if (typeof v !== 'number' || isNaN(v)) throw new ValidationError(`${f} must be number`, f); }
function ensureEnum(v, f, list) { if (!list.includes(String(v))) throw new ValidationError(`${f} must be one of ${list.join('|')}`, f); }

function t317_e1_latency_record(req) {
  ensureStr(req.tenant_id, 'tid'); ensureStr(req.route, 'rt'); ensureNum(req.ms, 'ms');
  const band = req.ms < 200 ? 'fast' : req.ms < 800 ? 'normal' : req.ms < 2000 ? 'slow' : 'critical';
  return { route: req.route, ms: req.ms, band, alert: band === 'critical' };
}

function t317_e2_error_rate_window(req) {
  ensureStr(req.tenant_id, 'tid'); ensureNum(req.errors, 'er'); ensureNum(req.total, 'to');
  if (req.total <= 0) throw new ValidationError('total must be > 0', 'to');
  const pct = +(req.errors / req.total * 100).toFixed(2);
  return { error_rate_pct: pct, status: pct >= 5 ? 'page_oncall' : pct >= 1 ? 'investigate' : 'healthy' };
}

function t317_e3_llm_trace_log(req) {
  ensureStr(req.tenant_id, 'tid'); ensureStr(req.chain_name, 'ch');
  ensureNum(req.prompt_tokens, 'pt'); ensureNum(req.completion_tokens, 'ct');
  const citations_ok = typeof req.citations_count === 'number' && req.citations_count > 0;
  return { trace_id: `llm_${Date.now()}`, chain: req.chain_name, tokens_total: req.prompt_tokens + req.completion_tokens,
    est_cost_usd: +((req.prompt_tokens * 3e-6) + (req.completion_tokens * 6e-6)).toFixed(5),
    citation_gate: citations_ok ? 'pass' : 'FAIL_regenerate' };
}

function t317_e4_uptime_probe_summary(req) {
  ensureStr(req.tenant_id, 'tid'); ensureNum(req.up_checks, 'up'); ensureNum(req.down_checks, 'dn');
  const total = req.up_checks + req.down_checks;
  if (total <= 0) throw new ValidationError('no checks', 'up');
  const uptime_pct = +(req.up_checks / total * 100).toFixed(3);
  return { uptime_pct, slo_target: 99.9, meets_slo: uptime_pct >= 99.9 };
}

function t317_e5_slow_query_report(req) {
  ensureStr(req.tenant_id, 'tid');
  if (!Array.isArray(req.queries)) throw new ValidationError('queries[{sql,ms}] required', 'queries');
  const slow = req.queries.filter(q => q.ms > 500).sort((a, b) => b.ms - a.ms);
  return { slow_count: slow.length, worst: slow[0] || null, advice: slow.length ? 'add/verify indexes on filter columns' : 'none' };
}

function funcs() { return { t317_e1_latency_record, t317_e2_error_rate_window, t317_e3_llm_trace_log, t317_e4_uptime_probe_summary, t317_e5_slow_query_report }; }
module.exports = { funcs, ValidationError };
