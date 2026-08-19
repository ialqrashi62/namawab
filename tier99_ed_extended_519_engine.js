// filepath: tier99_ed_extended_519_engine.js
class ValidationError extends Error { constructor(m, f) { super(m); this.field = f; } }
function ensureStr(v, f) { if (typeof v !== 'string' || !v) throw new ValidationError(`${f} required`, f); }
function ensureNum(v, f) { if (typeof v !== 'number' || isNaN(v)) throw new ValidationError(`${f} must be number`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }
function ensureEnum(v, f, list) { if (!list.includes(String(v))) throw new ValidationError(`${f} must be one of ${list.join('|')}`, f); }

function ed_triage(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.visit_id, 'vid');
  ensureNum(req.esi_level, 'esi');
  ensureNum(req.pain_score, 'pain');
  ensureNum(req.vital_signs_score, 'vss');
  ensureNum(req.wait_time_min, 'wtm');
  ensureNum(req.los_min, 'los');
  ensureEnum(req.disposition, 'disp', ['admit','discharge','transfer','observation','expired','other','unknown']);
  ensureStr(req.provider, 'pr');
  return { vid: req.visit_id };
}
function trauma_assessment(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.assessment_id, 'aid');
  ensureNum(req.gcs, 'gcs');
  ensureNum(req.systolic_bp, 'sbp');
  ensureNum(req.respiratory_rate, 'rr');
  ensureNum(req.iss_score, 'iss');
  ensureBool(req.fast_exam, 'fe');
  ensureNum(req.ct_imaging, 'cti');
  ensureNum(req.blood_products, 'bp');
  ensureNum(req.surgery_consult, 'sc');
  ensureStr(req.provider, 'pr');
  return { aid: req.assessment_id };
}
function stroke_alert(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.episode_id, 'eid');
  ensureNum(req.nihss, 'nihss');
  ensureNum(req.door_to_ct, 'dtc');
  ensureNum(req.door_to_needle, 'dtn');
  ensureNum(req.door_to_groin, 'dtg');
  ensureBool(req.tpa_given, 'tpa');
  ensureBool(req.thrombectomy, 'th');
  ensureNum(req.last_known_well, 'lkw');
  ensureStr(req.provider, 'pr');
  return { eid: req.episode_id };
}
function overdose_toxicology(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.assessment_id, 'aid');
  ensureStr(req.substance, 'sub');
  ensureNum(req.amount, 'amt');
  ensureNum(req.intentional, 'int');
  ensureNum(req.gcs, 'gcs');
  ensureBool(req.antidote_given, 'ag');
  ensureNum(req.icu_admission, 'icu');
  ensureNum(req.psych_consult, 'psy');
  ensureStr(req.provider, 'pr');
  return { aid: req.assessment_id };
}
function ed_discharge(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.visit_id, 'vid');
  ensureNum(req.los_min, 'los');
  ensureNum(req.diagnoses_count, 'dc');
  ensureNum(req.prescriptions, 'rx');
  ensureNum(req.follow_up_days, 'fud');
  ensureNum(req.return_72h, 'r72');
  ensureNum(req.patient_satisfaction, 'ps');
  ensureStr(req.provider, 'pr');
  return { vid: req.visit_id };
}

function funcs() { return { ed_triage, trauma_assessment, stroke_alert, overdose_toxicology, ed_discharge }; }
module.exports = { funcs, ValidationError };
