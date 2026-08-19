// filepath: tier117_quality_metrics_618_engine.js
class ValidationError extends Error { constructor(m, f) { super(m); this.field = f; } }
function ensureStr(v, f) { if (typeof v !== 'string' || !v) throw new ValidationError(`${f} required`, f); }
function ensureNum(v, f) { if (typeof v !== 'number' || isNaN(v)) throw new ValidationError(`${f} must be number`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }
function ensureEnum(v, f, list) { if (!list.includes(String(v))) throw new ValidationError(`${f} must be one of ${list.join('|')}`, f); }

function core_measure(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.measure_id, 'mid');
  ensureStr(req.measure_name, 'mn');
  ensureNum(req.observed_events, 'oe');
  ensureNum(req.expected_events, 'ee');
  ensureNum(req.performance_score, 'ps');
  ensureEnum(req.benchmark, 'bm', ['top_decile','median','bottom_decile','exceeds','meets','below','other','unknown']);
  ensureStr(req.provider, 'pr');
  return { mid: req.measure_id };
}
function ami_performance(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.measure_id, 'mid');
  ensureStr(req.measure_name, 'mn');
  ensureNum(req.compliance_pct, 'cp');
  ensureNum(req.target, 'tgt');
  ensureNum(req.exceptions_count, 'exc');
  ensureStr(req.provider, 'pr');
  return { mid: req.measure_id };
}
function stroke_performance(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.measure_id, 'mid');
  ensureStr(req.measure_name, 'mn');
  ensureNum(req.median_minutes, 'mm');
  ensureNum(req.target_minutes, 'tmin');
  ensureNum(req.patients_eligible, 'pe');
  ensureNum(req.patients_treated, 'pt');
  ensureStr(req.provider, 'pr');
  return { mid: req.measure_id };
}
function vte_performance(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.measure_id, 'mid');
  ensureStr(req.measure_name, 'mn');
  ensureNum(req.compliance_pct, 'cp');
  ensureNum(req.patients_assessed, 'pa');
  ensureNum(req.patients_received, 'prc');
  ensureStr(req.provider, 'pr');
  return { mid: req.measure_id };
}
function patient_satisfaction(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.measure_id, 'mid');
  ensureStr(req.measure_name, 'mn');
  ensureNum(req.top_box_pct, 'tbp');
  ensureNum(req.benchmark, 'bm');
  ensureNum(req.n_responses, 'nr');
  ensureNum(req.response_rate, 'rr');
  ensureStr(req.provider, 'pr');
  return { mid: req.measure_id };
}

function funcs() { return { core_measure, ami_performance, stroke_performance, vte_performance, patient_satisfaction }; }
module.exports = { funcs, ValidationError };