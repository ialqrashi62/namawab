// filepath: tier131_decision_support_675_engine.js
class ValidationError extends Error { constructor(m, f) { super(m); this.field = f; } }
function ensureStr(v, f) { if (typeof v !== 'string' || !v) throw new ValidationError(`${f} required`, f); }
function ensureNum(v, f) { if (typeof v !== 'number' || isNaN(v)) throw new ValidationError(`${f} must be number`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }
function ensureEnum(v, f, list) { if (!list.includes(String(v))) throw new ValidationError(`${f} must be one of ${list.join('|')}`, f); }

function alert_drug(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.alert_id, 'aid');
  ensureStr(req.drug_a, 'da');
  ensureStr(req.drug_b, 'db');
  ensureEnum(req.severity, 'sev', ['contraindicated','major','moderate','minor','other','unknown']);
  ensureStr(req.recommendation, 'rec');
  ensureStr(req.provider, 'pr');
  return { aid: req.alert_id };
}
function alert_allergy(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.alert_id, 'aid');
  ensureStr(req.allergen, 'alg');
  ensureEnum(req.reaction_type, 'rt', ['anaphylaxis','rash','gi','respiratory','other','unknown']);
  ensureNum(req.severity_grade, 'sg');
  ensureStr(req.provider, 'pr');
  return { aid: req.alert_id };
}
function alert_renal(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.alert_id, 'aid');
  ensureStr(req.drug, 'drug');
  ensureNum(req.egfr, 'egfr');
  ensureStr(req.recommended_dose, 'rd');
  ensureStr(req.provider, 'pr');
  return { aid: req.alert_id };
}
function alert_sepsis(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.alert_id, 'aid');
  ensureNum(req.qsofa, 'qs');
  ensureNum(req.lactate, 'lact');
  ensureNum(req.sirs, 'sirs');
  ensureStr(req.provider, 'pr');
  return { aid: req.alert_id };
}
function alert_falls(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.alert_id, 'aid');
  ensureNum(req.morse_score, 'ms');
  ensureBool(req.history_of_falls, 'hof');
  ensureBool(req.interventions_in_place, 'iip');
  ensureStr(req.provider, 'pr');
  return { aid: req.alert_id };
}

function funcs() { return { alert_drug, alert_allergy, alert_renal, alert_sepsis, alert_falls }; }
module.exports = { funcs, ValidationError };