// filepath: tier55_triage_ext_309_triage_intake_engine.js
class ValidationError extends Error { constructor(m, f) { super(m); this.field = f; } }
function ensureStr(v, f) { if (typeof v !== 'string' || !v) throw new ValidationError(`${f} required`, f); }
function ensureNum(v, f) { if (typeof v !== 'number' || isNaN(v)) throw new ValidationError(`${f} must be number`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }
function ensureEnum(v, f, list) { if (!list.includes(String(v))) throw new ValidationError(`${f} must be one of ${list.join('|')}`, f); }

function chief_complaint_evaluation(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.chief_complaint, 'cc');
  ensureStr(req.duration, 'dur');
  ensureStr(req.associated_symptoms, 'as');
  ensureNum(req.severity_self_reported, 'sev');
  ensureStr(req.onset, 'onset');
  ensureEnum(req.relevance, 'rel', ['emergent','urgent','semi_urgent','non_urgent']);
  return { chief: req.chief_complaint, severity: req.severity_self_reported };
}
function vital_signs_triage(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureNum(req.temp, 'temp');
  ensureNum(req.heart_rate, 'hr');
  ensureNum(req.resp_rate, 'rr');
  ensureNum(req.bp_systolic, 'sbp');
  ensureNum(req.bp_diastolic, 'dbp');
  ensureNum(req.oxygen_sat, 'spo2');
  ensureNum(req.pain_score, 'pain');
  ensureStr(req.interpretation, 'intp');
  return { spo2: req.oxygen_sat, pain: req.pain_score };
}
function presenting_symptoms(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.symptoms_list, 'sl');
  ensureNum(req.duration_days, 'dur');
  ensureEnum(req.severity, 'sev', ['mild','moderate','severe','life_threatening']);
  ensureBool(req.red_flags_present, 'rf');
  ensureStr(req.triage_impression, 'ti');
  return { symptoms: req.symptoms_list };
}
function allergy_history(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureNum(req.allergens.length, 'alg_len');
  ensureEnum(req.severity, 'sev', ['mild','moderate','severe','anaphylaxis']);
  ensureStr(req.reaction, 'rxn');
  ensureBool(req.documented_in_record, 'dir');
  ensureBool(req.alert_bracelet, 'ab');
  return { allergy_count: req.allergens.length };
}
function medication_reconciliation(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureNum(req.med_count, 'mc');
  ensureStr(req.high_risk_meds, 'hrm');
  ensureEnum(req.compliance, 'c', ['good','partial','poor','unable_to_assess']);
  ensureNum(req.interactions_reviewed, 'ir');
  ensureBool(req.pharmacist_consult_planned, 'pcp');
  return { med_count: req.med_count };
}

function funcs() { return { chief_complaint_evaluation, vital_signs_triage, presenting_symptoms, allergy_history, medication_reconciliation }; }
module.exports = { funcs, ValidationError };