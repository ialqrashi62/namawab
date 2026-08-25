// filepath: tier117_clinical_decision_617_engine.js
class ValidationError extends Error { constructor(m, f) { super(m); this.field = f; } }
function ensureStr(v, f) { if (typeof v !== 'string' || !v) throw new ValidationError(`${f} required`, f); }
function ensureNum(v, f) { if (typeof v !== 'number' || isNaN(v)) throw new ValidationError(`${f} must be number`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }
function ensureEnum(v, f, list) { if (!list.includes(String(v))) throw new ValidationError(`${f} must be one of ${list.join('|')}`, f); }

function drug_interaction(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.alert_id, 'aid');
  ensureStr(req.drug_1, 'd1');
  ensureStr(req.drug_2, 'd2');
  ensureEnum(req.interaction_severity, 'is', ['contraindicated','major','moderate','minor','none','unknown']);
  ensureStr(req.clinical_significance, 'cs');
  ensureStr(req.recommendation, 'rec');
  ensureStr(req.override_reason, 'ovr');
  ensureStr(req.provider, 'pr');
  return { aid: req.alert_id };
}
function renal_dose_alert(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.alert_id, 'aid');
  ensureStr(req.drug, 'drg');
  ensureNum(req.creatinine_clearance, 'crcl');
  ensureStr(req.recommended_dose, 'rd');
  ensureStr(req.actual_dose, 'ad');
  ensureStr(req.override_reason, 'ovr');
  ensureStr(req.provider, 'pr');
  return { aid: req.alert_id };
}
function sepsis_alert(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.alert_id, 'aid');
  ensureNum(req.qsofa_score, 'qs');
  ensureNum(req.lactate, 'lact');
  ensureNum(req.sirs_criteria, 'sc');
  ensureNum(req.blood_pressure, 'bp');
  ensureStr(req.alert_time, 'at');
  ensureBool(req.acknowledged, 'ack');
  ensureStr(req.provider, 'pr');
  return { aid: req.alert_id };
}
function pressure_ulcer_alert(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.alert_id, 'aid');
  ensureNum(req.braden_score, 'bs');
  ensureEnum(req.risk_level, 'rl', ['low','moderate','high','severe','no_risk','other','unknown']);
  ensureNum(req.interventions_recommended, 'ir');
  ensureNum(req.interventions_implemented, 'ii');
  ensureStr(req.provider, 'pr');
  return { aid: req.alert_id };
}
function fall_alert(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.alert_id, 'aid');
  ensureNum(req.morse_score, 'ms');
  ensureEnum(req.risk_level, 'rl', ['low','moderate','high','other','unknown']);
  ensureBool(req.prevention_protocol, 'pp');
  ensureNum(req.last_fall, 'lf');
  ensureStr(req.provider, 'pr');
  return { aid: req.alert_id };
}

function funcs() { return { drug_interaction, renal_dose_alert, sepsis_alert, pressure_ulcer_alert, fall_alert }; }
module.exports = { funcs, ValidationError };