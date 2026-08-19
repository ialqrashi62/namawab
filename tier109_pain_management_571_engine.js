// filepath: tier109_pain_management_571_engine.js
class ValidationError extends Error { constructor(m, f) { super(m); this.field = f; } }
function ensureStr(v, f) { if (typeof v !== 'string' || !v) throw new ValidationError(`${f} required`, f); }
function ensureNum(v, f) { if (typeof v !== 'number' || isNaN(v)) throw new ValidationError(`${f} must be number`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }
function ensureEnum(v, f, list) { if (!list.includes(String(v))) throw new ValidationError(`${f} must be one of ${list.join('|')}`, f); }

function pain_assessment(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.pain_id, 'pid');
  ensureNum(req.pain_score, 'ps');
  ensureNum(req.duration_days, 'dd');
  ensureStr(req.location, 'loc');
  ensureEnum(req.character, 'ch', ['acute','chronic','breakthrough','neuropathic','nociceptive','mixed','other','unknown']);
  ensureNum(req.nrs, 'nrs');
  ensureNum(req.impact_function, 'if');
  ensureStr(req.provider, 'pr');
  return { pid: req.pain_id };
}
function opioid_prescribing(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.prescription_id, 'pid');
  ensureStr(req.medication, 'med');
  ensureNum(req.dose_mg, 'dm');
  ensureStr(req.frequency, 'frq');
  ensureNum(req.morphine_equivalent, 'me');
  ensureNum(req.risk_score, 'rs');
  ensureBool(req.pain_contract_signed, 'pcs');
  ensureStr(req.provider, 'pr');
  return { pid: req.prescription_id };
}
function non_opioid_treatment(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.treatment_id, 'tid');
  ensureEnum(req.type, 'tp', ['physical_therapy','acupuncture','massage','tens','cognitive_therapy','other','unknown']);
  ensureNum(req.duration_weeks, 'dw');
  ensureNum(req.sessions, 'ss');
  ensureEnum(req.response, 'resp', ['complete','partial','none','worsening','other','unknown']);
  ensureNum(req.pain_reduction_pct, 'prp');
  ensureStr(req.provider, 'pr');
  return { tid: req.treatment_id };
}
function interventional_pain(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.procedure_id, 'pid');
  ensureEnum(req.type, 'tp', ['epidural','facet_block','nerve_block','radiofrequency','spinal_cord_stim','other','unknown']);
  ensureStr(req.level, 'lvl');
  ensureEnum(req.approach, 'app', ['interlaminar','transforaminal','caudal','posterior','lateral','other','unknown']);
  ensureStr(req.steroid, 'st');
  ensureNum(req.complications, 'comp');
  ensureStr(req.provider, 'pr');
  return { pid: req.procedure_id };
}
function pain_followup(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.followup_id, 'fid');
  ensureNum(req.weeks_since_treatment, 'wst');
  ensureNum(req.pain_score, 'ps');
  ensureNum(req.functional_improvement, 'fi');
  ensureNum(req.adherence, 'adh');
  ensureNum(req.opioid_dose_change_pct, 'odc');
  ensureStr(req.provider, 'pr');
  return { fid: req.followup_id };
}

function funcs() { return { pain_assessment, opioid_prescribing, non_opioid_treatment, interventional_pain, pain_followup }; }
module.exports = { funcs, ValidationError };