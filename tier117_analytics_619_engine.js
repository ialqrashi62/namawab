// filepath: tier117_analytics_619_engine.js
class ValidationError extends Error { constructor(m, f) { super(m); this.field = f; } }
function ensureStr(v, f) { if (typeof v !== 'string' || !v) throw new ValidationError(`${f} required`, f); }
function ensureNum(v, f) { if (typeof v !== 'number' || isNaN(v)) throw new ValidationError(`${f} must be number`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }
function ensureEnum(v, f, list) { if (!list.includes(String(v))) throw new ValidationError(`${f} must be one of ${list.join('|')}`, f); }

function dashboard(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.dashboard_id, 'did');
  ensureStr(req.title, 'title');
  ensureNum(req.widgets_count, 'wc');
  ensureNum(req.refresh_interval_min, 'rim');
  ensureEnum(req.audience, 'aud', ['executive','clinical','operational','quality','other','unknown']);
  ensureStr(req.provider, 'pr');
  return { did: req.dashboard_id };
}
function report(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.report_id, 'rid');
  ensureStr(req.name, 'name');
  ensureEnum(req.format, 'fmt', ['pdf','excel','csv','json','web','other','unknown']);
  ensureNum(req.rows, 'rows');
  ensureNum(req.run_time_min, 'rtm');
  ensureEnum(req.status, 'st', ['pending','running','complete','failed','cancelled','other','unknown']);
  ensureStr(req.provider, 'pr');
  return { rid: req.report_id };
}
function cohort_analysis(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.cohort_id, 'cid');
  ensureStr(req.criteria, 'crit');
  ensureNum(req.patient_count, 'pc');
  ensureNum(req.outcome_value, 'ov');
  ensureNum(req.comparison_pct, 'cp');
  ensureEnum(req.significance, 'sig', ['significant','trending','not_significant','other','unknown']);
  ensureStr(req.provider, 'pr');
  return { cid: req.cohort_id };
}
function outcome_tracking(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.outcome_id, 'oid');
  ensureStr(req.outcome_name, 'on');
  ensureNum(req.baseline, 'bl');
  ensureNum(req.current, 'cu');
  ensureNum(req.improvement_pct, 'ip');
  ensureEnum(req.status, 'st', ['achieved','partially','not_achieved','worsened','other','unknown']);
  ensureStr(req.provider, 'pr');
  return { oid: req.outcome_id };
}
function kpi_monitoring(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.kpi_id, 'kid');
  ensureStr(req.metric, 'mtr');
  ensureNum(req.target, 'tg');
  ensureNum(req.actual, 'ac');
  ensureNum(req.variance_pct, 'var');
  ensureEnum(req.trend_direction, 'td', ['improving','stable','deteriorating','other','unknown']);
  ensureStr(req.provider, 'pr');
  return { kid: req.kpi_id };
}

function funcs() { return { dashboard, report, cohort_analysis, outcome_tracking, kpi_monitoring }; }
module.exports = { funcs, ValidationError };