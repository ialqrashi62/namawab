// tier318_analytics_1499_engine.js — User Analytics & BI Events
class ValidationError extends Error { constructor(m, f) { super(m); this.field = f; } }
function ensureStr(v, f) { if (typeof v !== 'string' || !v.trim()) throw new ValidationError(`${f} must be string`, f); }
function ensureNum(v, f) { if (typeof v !== 'number' || isNaN(v)) throw new ValidationError(`${f} must be number`, f); }
function ensureEnum(v, f, list) { if (!list.includes(String(v))) throw new ValidationError(`${f} must be one of ${list.join('|')}`, f); }

const FUNNEL_STEPS = ['login', 'open_dept', 'create_entry', 'save', 'print'];

function t318_e1_event_track(req) {
  ensureStr(req.tenant_id, 'tid'); ensureStr(req.user_role, 'role');
  ensureEnum(req.event, 'ev', FUNNEL_STEPS.concat(['search', 'export']));
  return { event_id: `ev_${Date.now()}`, event: req.event, role: req.user_role, tracked_at: new Date().toISOString(), pii: false };
}

function t318_e2_funnel_conversion(req) {
  ensureStr(req.tenant_id, 'tid');
  if (!Array.isArray(req.counts) || req.counts.length !== FUNNEL_STEPS.length) throw new ValidationError(`counts[] of ${FUNNEL_STEPS.length}`, 'counts');
  const conv = req.counts.map((c, i) => i === 0 ? 100 : Math.round(c / (req.counts[0] || 1) * 100));
  const worstDrop = conv.slice(1).reduce((mi, v, i) => (conv[i] - v) > (conv[mi] - conv[mi + 1]) ? mi + 1 : mi, 0);
  return { steps: FUNNEL_STEPS, conversion_pct: conv, biggest_drop_step: FUNNEL_STEPS[worstDrop] };
}

function t318_e3_dept_usage_rank(req) {
  ensureStr(req.tenant_id, 'tid');
  if (!Array.isArray(req.usage) || req.usage.length === 0) throw new ValidationError('usage[{dept,count}] required', 'usage');
  const sorted = [...req.usage].sort((a, b) => b.count - a.count).slice(0, 10);
  return { top10: sorted, total_events: req.usage.reduce((a, x) => a + x.count, 0) };
}

function t318_e4_retention_cohort(req) {
  ensureStr(req.tenant_id, 'tid'); ensureNum(req.returned_users, 'ret'); ensureNum(req.cohort_size, 'coh');
  if (req.cohort_size <= 0) throw new ValidationError('cohort_size must be > 0', 'coh');
  const pct = Math.round(req.returned_users / req.cohort_size * 100);
  return { retention_pct: pct, band: pct >= 60 ? 'healthy' : pct >= 40 ? 'watch' : 'churn_risk' };
}

function t318_e5_export_bi_snapshot(req) {
  ensureStr(req.tenant_id, 'tid'); ensureStr(req.metric_set, 'mx');
  return { snapshot_id: `bi_${Date.now()}`, metric_set: req.metric_set, format: 'parquet-compatible-json', ready_for: 'BI dashboards' };
}

function funcs() { return { t318_e1_event_track, t318_e2_funnel_conversion, t318_e3_dept_usage_rank, t318_e4_retention_cohort, t318_e5_export_bi_snapshot }; }
module.exports = { funcs, ValidationError };
