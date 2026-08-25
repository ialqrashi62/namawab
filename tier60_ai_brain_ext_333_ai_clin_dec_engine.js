// filepath: tier60_ai_brain_ext_333_ai_clin_dec_engine.js
class ValidationError extends Error { constructor(m, f) { super(m); this.field = f; } }
function ensureStr(v, f) { if (typeof v !== 'string' || !v) throw new ValidationError(`${f} required`, f); }
function ensureNum(v, f) { if (typeof v !== 'number' || isNaN(v)) throw new ValidationError(`${f} must be number`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }
function ensureEnum(v, f, list) { if (!list.includes(String(v))) throw new ValidationError(`${f} must be one of ${list.join('|')}`, f); }

function clinical_decision_support(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.model_version, 'mv');
  ensureStr(req.chief_complaint, 'cc');
  ensureStr(req.vitals_map, 'vm');
  ensureStr(req.labs_input, 'li');
  ensureStr(req.recommendation, 'rec');
  ensureNum(req.confidence, 'conf');
  ensureBool(req.clinician_acknowledged, 'ca');
  return { model: req.model_version };
}
function risk_stratification(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.risk_model, 'rm');
  ensureStr(req.inputs, 'inp');
  ensureNum(req.score, 'score');
  ensureEnum(req.risk_level, 'rl', ['low','moderate','high','very_high']);
  ensureStr(req.recommendation, 'rec');
  ensureNum(req['follow_up'], 'fu');
  return { risk: req.risk_level };
}
function differential_diagnosis(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.symptoms, 'sym');
  ensureStr(req.top_diagnosis, 'td');
  ensureStr(req.alternatives, 'alt');
  ensureNum(req.confidence, 'conf');
  ensureBool(req.imaging_recommended, 'ir');
  return { top: req.top_diagnosis };
}
function drug_interaction_ai(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.drug_a, 'da');
  ensureStr(req.drug_b, 'db');
  ensureEnum(req.severity, 'sev', ['minor','moderate','major','contraindicated','unknown']);
  ensureStr(req.mechanism, 'mech');
  ensureStr(req.recommendation, 'rec');
  ensureBool(req.clinician_documented, 'cd');
  return { severity: req.severity };
}
function sepsis_alert_ai(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureNum(req.sirs_score, 'sirs');
  ensureNum(req.qsofa_score, 'qsofa');
  ensureNum(req.lactate, 'lac');
  ensureEnum(req.alert_level, 'al', ['none','possible_sepsis','probable_sepsis','severe_sepsis','septic_shock']);
  ensureNum(req.time_to_antibiotics_target, 'tta');
  ensureStr(req.intervention, 'int');
  return { alert: req.alert_level };
}

function funcs() { return { clinical_decision_support, risk_stratification, differential_diagnosis, drug_interaction_ai, sepsis_alert_ai }; }
module.exports = { funcs, ValidationError };