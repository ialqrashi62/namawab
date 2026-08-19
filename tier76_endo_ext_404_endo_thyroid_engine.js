// filepath: tier76_endo_ext_404_endo_thyroid_engine.js
class ValidationError extends Error { constructor(m, f) { super(m); this.field = f; } }
function ensureStr(v, f) { if (typeof v !== 'string' || !v) throw new ValidationError(`${f} required`, f); }
function ensureNum(v, f) { if (typeof v !== 'number' || isNaN(v)) throw new ValidationError(`${f} must be number`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }
function ensureEnum(v, f, list) { if (!list.includes(String(v))) throw new ValidationError(`${f} must be one of ${list.join('|')}`, f); }

function thyroid_assessment(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.assessment_id, 'aid');
  ensureNum(req.tsh, 'tsh');
  ensureNum(req.free_t4, 'ft4');
  ensureNum(req.free_t3, 'ft3');
  ensureStr(req.symptoms, 'sym');
  ensureStr(req.thyroid_exam, 'te');
  ensureBool(req.antibody_tests, 'at');
  ensureStr(req.imaging_ordered, 'io');
  ensureStr(req.medication_history, 'mh');
  ensureStr(req.family_history, 'fh');
  ensureStr(req.provider, 'pr');
  ensureNum(req.next_review, 'nr');
  return { aid: req.assessment_id };
}
function thyroid_ultrasound(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.study_id, 'sid');
  ensureNum(req.ti_rads_score, 'trs');
  ensureNum(req.nodule_size_cm, 'nsc');
  ensureNum(req.nodule_count, 'nc');
  ensureEnum(req.laterality, 'lat', ['left','right','bilateral','isthmus','unknown','other']);
  ensureEnum(req.echogenicity, 'echo', ['hypoechoic','hyperechoic','isoechoic','heterogeneous','anechoic','mixed','complex','unknown','other']);
  ensureBool(req.calcifications_present, 'cp');
  ensureEnum(req.vascularity, 'vasc', ['low','moderate','high','avascular','unknown','other']);
  ensureStr(req.recommendation, 'rec');
  ensureStr(req.provider, 'pr');
  ensureNum(req.next_review, 'nr');
  return { sid: req.study_id };
}
function thyroid_biopsy(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.procedure_id, 'pid');
  ensureEnum(req.biopsy_type, 'bt', ['fnc','core_biopsy','surgical_biopsy','molecular_testing','ngsuc','thyroseq','afirma','other']);
  ensureStr(req.nodule_targeted, 'nt');
  ensureNum(req.samples_collected, 'sc');
  ensureEnum(req.complications, 'comp', ['none','bleeding','hematoma','pain','infection','voice_change','tracheal_puncture','other']);
  ensureEnum(req.cytology_result, 'cr', ['bethesda_1','bethesda_2','bethesda_3','bethesda_4','bethesda_5','bethesda_6','non_diagnostic','unsatisfactory','other','unknown']);
  ensureStr(req.recommended_followup, 'rf');
  ensureStr(req.provider, 'pr');
  ensureNum(req.next_review, 'nr');
  return { pid: req.procedure_id };
}
function thyroid_cancer(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.cancer_id, 'cid');
  ensureEnum(req.cancer_type, 'ct', ['papillary','follicular','medullary','anaplastic','hurthle','lymphoma','other']);
  ensureStr(req.stage, 'stage');
  ensureStr(req.treatment, 'tx');
  ensureBool(req.rai_required, 'rr');
  ensureBool(req.tsh_suppression_active, 'tsa');
  ensureEnum(req.thyroglobulin_trending, 'tt', ['declining','stable','rising','suppressed','elevated','unknown','other']);
  ensureEnum(req.recurrence_risk, 'rrec', ['low','intermediate','high','very_high','unknown','other']);
  ensureStr(req.provider, 'pr');
  ensureNum(req.next_review, 'nr');
  return { cid: req.cancer_id };
}
function thyroid_eye_disease(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.assessment_id, 'aid');
  ensureNum(req.cas_score, 'cs');
  ensureBool(req.eyelid_retraction, 'er');
  ensureNum(req.proptosis_mm, 'pm');
  ensureBool(req.diplopia_present, 'dp');
  ensureBool(req.optic_nerve_involvement, 'oni');
  ensureEnum(req.disease_activity, 'da', ['active','inactive','remission','unknown','other']);
  ensureBool(req.iv_steroid_considered, 'isc');
  ensureStr(req.provider, 'pr');
  ensureNum(req.next_review, 'nr');
  return { aid: req.assessment_id };
}

function funcs() { return { thyroid_assessment, thyroid_ultrasound, thyroid_biopsy, thyroid_cancer, thyroid_eye_disease }; }
module.exports = { funcs, ValidationError };