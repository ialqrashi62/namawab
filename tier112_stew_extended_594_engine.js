// filepath: tier112_stew_extended_594_engine.js
class ValidationError extends Error { constructor(m, f) { super(m); this.field = f; } }
function ensureStr(v, f) { if (typeof v !== 'string' || !v) throw new ValidationError(`${f} required`, f); }
function ensureNum(v, f) { if (typeof v !== 'number' || isNaN(v)) throw new ValidationError(`${f} must be number`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }
function ensureEnum(v, f, list) { if (!list.includes(String(v))) throw new ValidationError(`${f} must be one of ${list.join('|')}`, f); }

function local_antibiogram(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.antibiogram_id, 'aid');
  ensureStr(req.facility, 'fac');
  ensureStr(req.organism, 'org');
  ensureNum(req.isolates_count, 'ic');
  ensureNum(req.sensitive_pct, 'sp');
  ensureNum(req.resistant_pct, 'rp');
  ensureEnum(req.period, 'pr', ['q1','q2','q3','q4','annual','other','unknown']);
  ensureStr(req.provider, 'pr');
  return { aid: req.antibiogram_id };
}
function antibiotic_d_drug_specific(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.therapy_id, 'tid');
  ensureStr(req.drug, 'drg');
  ensureStr(req.indication, 'ind');
  ensureNum(req.ddd_per_1000pd, 'ddd');
  ensureNum(req.days_of_therapy, 'dot');
  ensureNum(req.cost_dollars, 'cost');
  ensureEnum(req.compliance, 'comp', ['compliant','non_compliant','unknown','other']);
  ensureStr(req.provider, 'pr');
  return { tid: req.therapy_id };
}
function resistance_trend(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.trend_id, 'tid');
  ensureStr(req.organism, 'org');
  ensureNum(req.baseline_resistance_pct, 'brp');
  ensureNum(req.current_resistance_pct, 'crp');
  ensureNum(req.period_years, 'py');
  ensureNum(req.absolute_change, 'ac');
  ensureEnum(req.trend_direction, 'td', ['increasing','stable','decreasing','other','unknown']);
  ensureStr(req.provider, 'pr');
  return { tid: req.trend_id };
}
function intervention_metrics(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.intervention_id, 'iid');
  ensureNum(req.review_count, 'rc');
  ensureNum(req.interventions_count, 'ic');
  ensureNum(req.acceptance_rate, 'ar');
  ensureNum(req.cost_savings, 'cs');
  ensureNum(req.days_of_therapy_reduced, 'dotr');
  ensureNum(req.length_of_stay_reduction, 'losr');
  ensureStr(req.provider, 'pr');
  return { iid: req.intervention_id };
}
function antibiogram_alert(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.alert_id, 'aid');
  ensureStr(req.organism, 'org');
  ensureStr(req.drug, 'drg');
  ensureNum(req.resistance_pct, 'rp');
  ensureBool(req.alert_acknowledged, 'aa');
  ensureEnum(req.action, 'act', ['none','alternative_prescribed','escalated','culture_sent','other','unknown','none']);
  ensureBool(req.flag_alert, 'fa');
  ensureStr(req.provider, 'pr');
  return { aid: req.alert_id };
}

function funcs() { return { local_antibiogram, antibiotic_d_drug_specific, resistance_trend, intervention_metrics, antibiogram_alert }; }
module.exports = { funcs, ValidationError };