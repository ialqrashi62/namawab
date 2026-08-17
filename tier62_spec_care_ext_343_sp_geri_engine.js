// filepath: tier62_spec_care_ext_343_sp_geri_engine.js
class ValidationError extends Error { constructor(m, f) { super(m); this.field = f; } }
function ensureStr(v, f) { if (typeof v !== 'string' || !v) throw new ValidationError(`${f} required`, f); }
function ensureNum(v, f) { if (typeof v !== 'number' || isNaN(v)) throw new ValidationError(`${f} must be number`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }
function ensureEnum(v, f, list) { if (!list.includes(String(v))) throw new ValidationError(`${f} must be one of ${list.join('|')}`, f); }

function geriatric_assessment(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureNum(req.age, 'age');
  ensureStr(req.cognition, 'cog');
  ensureStr(req.mobility, 'mob');
  ensureNum(req.adl_score, 'adl');
  ensureNum(req.iadl_score, 'iadl');
  ensureEnum(req.functional_status, 'fs', ['independent','partially_dependent','fully_dependent','terminal']);
  ensureStr(req.recommendation, 'rec');
  ensureBool(req.caregiver_present, 'cp');
  return { age: req.age };
}
function polypharmacy_review(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureNum(req.med_count, 'mc');
  ensureNum(req.beers_criteria_violations, 'bcv');
  ensureStr(req.high_risk_meds, 'hrm');
  ensureStr(req.recommendation, 'rec');
  ensureNum(req['follow_up'], 'fu');
  ensureBool(req.clinician_reviewed, 'cr');
  return { med_count: req.med_count };
}
function falls_clinic(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureNum(req.falls_count_6mo, 'fc6');
  ensureNum(req.tug_score, 'tug');
  ensureNum(req.balance_berg, 'bb');
  ensureBool(req.home_safety_assessment, 'hsa');
  ensureNum(req.vitamin_d_level, 'vdl');
  ensureStr(req.recommendation, 'rec');
  return { falls: req.falls_count_6mo };
}
function delirium_screen(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureEnum(req.cam_score, 'cs', ['negative','positive','inconclusive','unable_to_assess']);
  ensureStr(req.precipitants, 'prec');
  ensureEnum(req.severity, 'sev', ['mild','moderate','severe','refractory']);
  ensureStr(req.workup, 'wu');
  ensureStr(req.intervention, 'int');
  ensureNum(req['follow_up'], 'fu');
  return { cam: req.cam_score };
}
function dementia_workup(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureNum(req.moca_score, 'ms');
  ensureStr(req.mri_findings, 'mri');
  ensureStr(req.biomarkers, 'bio');
  ensureEnum(req.type, 'typ', ['alzheimer_mild','alzheimer_moderate','alzheimer_severe','vascular','lewy_body','frontotemporal','mixed','mci','unknown']);
  ensureStr(req.plan, 'plan');
  ensureBool(req.caregiver_education, 'ce');
  return { type: req.type };
}

function funcs() { return { geriatric_assessment, polypharmacy_review, falls_clinic, delirium_screen, dementia_workup }; }
module.exports = { funcs, ValidationError };