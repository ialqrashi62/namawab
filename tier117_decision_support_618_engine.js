// filepath: tier117_decision_support_618_engine.js
class ValidationError extends Error { constructor(m, f) { super(m); this.field = f; } }
function ensureStr(v, f) { if (typeof v !== 'string' || !v) throw new ValidationError(`${f} required`, f); }
function ensureNum(v, f) { if (typeof v !== 'number' || isNaN(v)) throw new ValidationError(`${f} must be number`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }
function ensureEnum(v, f, list) { if (!list.includes(String(v))) throw new ValidationError(`${f} must be one of ${list.join('|')}`, f); }

function clinical_alert(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.alert_id, 'aid');
  ensureEnum(req.type, 'tp', ['lab_critical','vital_sign','drug_allergy','drug_dose','preventive','other','unknown']);
  ensureEnum(req.severity, 'sev', ['info','warning','critical','life_threatening','other','unknown']);
  ensureBool(req.acknowledged, 'ack');
  ensureNum(req.time_to_acknowledge, 'tta');
  ensureEnum(req.action, 'act', ['acknowledged','escalated','intervention','override','other','unknown','none']);
  ensureStr(req.provider, 'pr');
  return { aid: req.alert_id };
}
function drug_interaction(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.interaction_id, 'iid');
  ensureStr(req.drug_1, 'd1');
  ensureStr(req.drug_2, 'd2');
  ensureEnum(req.severity, 'sev', ['minor','moderate','major','contraindicated','other','unknown']);
  ensureBool(req.action_taken, 'at');
  ensureNum(req.time_to_action, 'tta');
  ensureStr(req.provider, 'pr');
  return { iid: req.interaction_id };
}
function preventive_care_alert(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.alert_id, 'aid');
  ensureStr(req.recommendation, 'rec');
  ensureNum(req.days_overdue, 'do');
  ensureBool(req.completed, 'comp');
  ensureEnum(req.recommendation_type, 'rt', ['vaccine','screening','medication','lifestyle','other','unknown']);
  ensureStr(req.provider, 'pr');
  return { aid: req.alert_id };
}
function best_practice_alert(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.alert_id, 'aid');
  ensureStr(req.guideline, 'gl');
  ensureNum(req.deviations_count, 'dc');
  ensureNum(req.recommended_actions_count, 'rac');
  ensureBool(req.compliance, 'comp');
  ensureEnum(req.recommendation_accepted, 'ra', ['accepted','modified','declined','other','unknown']);
  ensureStr(req.provider, 'pr');
  return { aid: req.alert_id };
}
function risk_score(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.score_id, 'sid');
  ensureStr(req.model, 'mdl');
  ensureNum(req.score, 'sc');
  ensureNum(req.threshold, 'th');
  ensureEnum(req.category, 'cat', ['low','medium','high','critical','other','unknown']);
  ensureNum(req.factors_count, 'fc');
  ensureStr(req.provider, 'pr');
  return { sid: req.score_id };
}

function funcs() { return { clinical_alert, drug_interaction, preventive_care_alert, best_practice_alert, risk_score }; }
module.exports = { funcs, ValidationError };