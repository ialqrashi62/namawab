// filepath: tier137_pred_670_engine.js
class ValidationError extends Error { constructor(m, f) { super(m); this.field = f; } }
function ensureStr(v, f) { if (typeof v !== 'string' || !v) throw new ValidationError(`${f} required`, f); }
function ensureNum(v, f) { if (typeof v !== 'number' || isNaN(v)) throw new ValidationError(`${f} must be number`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }
function ensureEnum(v, f, list) { if (!list.includes(String(v))) throw new ValidationError(`${f} must be one of ${list.join('|')}`, f); }

function readmission(req) {
  ensureStr(req.tenant_id, 'tid');
  ensureStr(req.patient_id, 'pid');
  ensureNum(req.days_since_dc, 'ds');
  ensureNum(req.risk_score, 'rs');
  ensureEnum(req.risk_tier, 'rt', ['low','moderate','high','very_high']);
  ensureNum(req.lace_score, 'la');
  ensureStr(req.contributing_factors, 'cf');
  ensureStr(req.recommendation, 'rec');
  return { rm_id: `rmd_${Date.now()}`, patient_id: req.patient_id, score: req.risk_score, tier: req.risk_tier };
}
function mortality(req) {
  ensureStr(req.tenant_id, 'tid');
  ensureStr(req.patient_id, 'pid');
  ensureNum(req.mortality_pct, 'mp');
  ensureEnum(req.timeframe, 'tf', ['24h','7d','30d','90d','1y']);
  ensureStr(req.model_used, 'mu');
  ensureNum(req.saps_score, 'ss');
  ensureNum(req.apache_score, 'ap');
  return { mort_id: `mrt_${Date.now()}`, patient_id: req.patient_id, mortality: req.mortality_pct, timeframe: req.timeframe };
}
function los_predict(req) {
  ensureStr(req.tenant_id, 'tid');
  ensureStr(req.patient_id, 'pid');
  ensureNum(req.predicted_los_days, 'pl');
  ensureNum(req.actual_los_days, 'al');
  ensureNum(req.deviation, 'dv');
  ensureStr(req.admission_type, 'at');
  ensureNum(req.comorbidity_score, 'cs');
  ensureStr(req.model, 'md');
  return { los_id: `los_${Date.now()}`, patient_id: req.patient_id, predicted: req.predicted_los_days, deviation: req.deviation };
}
function fall_risk(req) {
  ensureStr(req.tenant_id, 'tid');
  ensureStr(req.patient_id, 'pid');
  ensureNum(req.morse_score, 'ms');
  ensureEnum(req.risk_tier, 'rt', ['low','moderate','high']);
  ensureStr(req.contributing_factors, 'cf');
  ensureStr(req.interventions, 'iv');
  ensureNum(req.risk_score, 'rs');
  ensureStr(req.provider, 'pr');
  return { fr_id: `flr_${Date.now()}`, patient_id: req.patient_id, score: req.morse_score, tier: req.risk_tier };
}
function deterioration(req) {
  ensureStr(req.tenant_id, 'tid');
  ensureStr(req.patient_id, 'pid');
  ensureNum(req.ews_score, 'ew');
  ensureNum(req.mews_score, 'mw');
  ensureBool(req.critical_event, 'ce');
  ensureStr(req.recommendation, 'rec');
  ensureStr(req.notification_target, 'nt');
  ensureEnum(req.tier, 'tr', ['green','yellow','orange','red']);
  ensureStr(req.provider, 'pr');
  return { det_id: `dtn_${Date.now()}`, patient_id: req.patient_id, ews: req.ews_score, moews: req.mews_score, tier: req.tier };
}

function funcs() { return { readmission, mortality, los_predict, fall_risk, deterioration }; }
module.exports = { funcs, ValidationError };
