// filepath: tier137_cds_667_engine.js
class ValidationError extends Error { constructor(m, f) { super(m); this.field = f; } }
function ensureStr(v, f) { if (typeof v !== 'string' || !v) throw new ValidationError(`${f} required`, f); }
function ensureNum(v, f) { if (typeof v !== 'number' || isNaN(v)) throw new ValidationError(`${f} must be number`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }
function ensureEnum(v, f, list) { if (!list.includes(String(v))) throw new ValidationError(`${f} must be one of ${list.join('|')}`, f); }

function differential_dx(req) {
  ensureStr(req.tenant_id, 'tid');
  ensureStr(req.patient_id, 'pid');
  ensureStr(req.symptoms, 'sx');
  ensureNum(req.age, 'ag');
  ensureEnum(req.sex, 'sx2', ['M','F','other']);
  ensureStr(req.duration, 'du');
  ensureStr(req.comorbidities, 'cb');
  const differentials = ['diagnosis_a','diagnosis_b','diagnosis_c'];
  return { dx_id: `dfx_${Date.now()}`, patient_id: req.patient_id, differentials, confidence: 0.85, symptoms: req.symptoms, age: req.age };
}
function risk_score(req) {
  ensureStr(req.tenant_id, 'tid');
  ensureStr(req.patient_id, 'pid');
  ensureStr(req.score_name, 'sn');
  ensureNum(req.value, 'vl');
  ensureEnum(req.risk_tier, 'rt', ['low','intermediate','high','very_high']);
  ensureStr(req.recommendation, 'rec');
  ensureStr(req.model_version, 'mv');
  return { score_id: `sk_${Date.now()}`, patient_id: req.patient_id, score: req.score_name, value: req.value, tier: req.risk_tier };
}
function drug_interaction(req) {
  ensureStr(req.tenant_id, 'tid');
  ensureStr(req.patient_id, 'pid');
  ensureStr(req.drug_a, 'da');
  ensureStr(req.drug_b, 'db');
  ensureEnum(req.severity, 'sv', ['none','minor','moderate','major','contraindicated']);
  ensureStr(req.mechanism, 'mn');
  ensureStr(req.recommendation, 'rec');
  return { int_id: `int_${Date.now()}`, patient_id: req.patient_id, drug_a: req.drug_a, drug_b: req.drug_b, severity: req.severity };
}
function sepsis_alert(req) {
  ensureStr(req.tenant_id, 'tid');
  ensureStr(req.patient_id, 'pid');
  ensureNum(req.qsofa_score, 'qs');
  ensureNum(req.sirs_criteria, 'si');
  ensureNum(req.lactate, 'la');
  ensureBool(req.suspected_infection, 'sf');
  ensureBool(req.severe_sepsis, 'ss');
  ensureNum(req.sofa_score, 'so');
  return { alert_id: `ssp_${Date.now()}`, patient_id: req.patient_id, qsofa: req.qsofa_score, sofa: req.sofa_score, severe: req.severe_sepsis };
}
function alert_fatigue(req) {
  ensureStr(req.tenant_id, 'tid');
  ensureStr(req.provider_id, 'pid');
  ensureNum(req.total_alerts, 'ta');
  ensureNum(req.actionable, 'ac');
  ensureNum(req.overridden, 'ov');
  ensureNum(req.overridden_pct, 'op');
  ensureStr(req.recommendation, 'rec');
  return { fat_id: `afo_${Date.now()}`, provider_id: req.provider_id, total: req.total_alerts, overriden_pct: req.overridden_pct };
}

function funcs() { return { differential_dx, risk_score, drug_interaction, sepsis_alert, alert_fatigue }; }
module.exports = { funcs, ValidationError };
