// filepath: tier91_geriatric_dementia_481_engine.js
class ValidationError extends Error { constructor(m, f) { super(m); this.field = f; } }
function ensureStr(v, f) { if (typeof v !== 'string' || !v) throw new ValidationError(`${f} required`, f); }
function ensureNum(v, f) { if (typeof v !== 'number' || isNaN(v)) throw new ValidationError(`${f} must be number`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }
function ensureEnum(v, f, list) { if (!list.includes(String(v))) throw new ValidationError(`${f} must be one of ${list.join('|')}`, f); }

function dementia_diagnosis(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.assessment_id, 'aid');
  ensureStr(req.dementia_type, 'dt');
  ensureNum(req.mmse_score, 'mmse');
  ensureNum(req.moca_score, 'moca');
  ensureEnum(req.severity, 'sev', ['mild','moderate','severe','unknown','other']);
  ensureNum(req.symptoms_duration_months, 'sdm');
  ensureNum(req.behavior_changes, 'bc');
  ensureBool(req.family_history, 'fh');
  ensureBool(req.imaging_performed, 'ip');
  ensureNum(req.csf_biomarkers, 'cb');
  ensureStr(req.provider, 'pr');
  return { aid: req.assessment_id };
}
function bpsd(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.assessment_id, 'aid');
  ensureNum(req.agitation_score, 'agr');
  ensureNum(req.aggression_score, 'ag');
  ensureNum(req.hallucinations, 'hall');
  ensureNum(req.delusions, 'del');
  ensureNum(req.depression_score, 'dep');
  ensureNum(req.anxiety_score, 'anx');
  ensureNum(req.apathy_score, 'apa');
  ensureNum(req.sleep_disturbance, 'sd');
  ensureNum(req.wandering, 'wan');
  ensureNum(req.elopement_risk, 'er');
  ensureStr(req.provider, 'pr');
  return { aid: req.assessment_id };
}
function dementia_medications(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.review_id, 'rid');
  ensureEnum(req.cholinesterase, 'choi', ['donepezil','rivastigmine','galantamine','none','other','unknown']);
  ensureNum(req.cholinesterase_dose, 'cd');
  ensureBool(req.memantine, 'mem');
  ensureNum(req.memantine_dose, 'md');
  ensureBool(req.antipsychotic_used, 'au');
  ensureEnum(req.antipsychotic_type, 'at', ['typical','atypical','none','other','unknown']);
  ensureNum(req.behavioral_response, 'br');
  ensureNum(req.side_effects, 'se');
  ensureStr(req.provider, 'pr');
  return { rid: req.review_id };
}
function caregiver_support(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.session_id, 'sid');
  ensureNumeric(req.caregiver_burden, 'cb');
  ensureNum(req.caregiver_age, 'ca');
  ensureNum(req.caregiver_health_score, 'chs');
  ensureBool(req.caregiver_depression, 'cd');
  ensureNum(req.respite_hours, 'rh');
  ensureBool(req.support_group, 'sg');
  ensureNum(req.financial_assistance, 'fa');
  ensureEnum(req.burnout_level, 'bl', ['low','moderate','high','severe','unknown','other']);
  ensureStr(req.provider, 'pr');
  return { sid: req.session_id };
}
function safety_assessment(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.assessment_id, 'aid');
  ensureBool(req.wandering_risk, 'wr');
  ensureBool(req.driving_assessed, 'da');
  ensureBool(req.cooking_safety, 'csa');
  ensureBool(req.medication_safety, 'ms');
  ensureBool(req.home_alone_safe, 'ha');
  ensureBool(req.gun_access, 'ga');
  ensureBool(req.financial_vulnerability, 'fv');
  ensureNum(req.safety_modifications, 'sm');
  ensureBool(req.guardianship_needed, 'gn');
  ensureStr(req.provider, 'pr');
  return { aid: req.assessment_id };
}

function ensureNumeric(v, f) { if (typeof v !== 'number' || isNaN(v)) throw new ValidationError(`${f} must be number`, f); }
function funcs() { return { dementia_diagnosis, bpsd, dementia_medications, caregiver_support, safety_assessment }; }
module.exports = { funcs, ValidationError };
