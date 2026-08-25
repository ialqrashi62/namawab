// filepath: tier75_pulm_ext_398_pulm_assess_engine.js
class ValidationError extends Error { constructor(m, f) { super(m); this.field = f; } }
function ensureStr(v, f) { if (typeof v !== 'string' || !v) throw new ValidationError(`${f} required`, f); }
function ensureNum(v, f) { if (typeof v !== 'number' || isNaN(v)) throw new ValidationError(`${f} must be number`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }
function ensureEnum(v, f, list) { if (!list.includes(String(v))) throw new ValidationError(`${f} must be one of ${list.join('|')}`, f); }

function spirometry(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.study_id, 'sid');
  ensureNum(req.fev1, 'fev1');
  ensureNum(req.fvc, 'fvc');
  ensureNum(req.fev1_fvc_ratio, 'ratio');
  ensureEnum(req.interpretation, 'interp', ['normal','mild_obstruction','moderate_obstruction','severe_obstruction','mild_restriction','moderate_restriction','severe_restriction','mixed','uninterpretable','other']);
  ensureEnum(req.quality, 'q', ['acceptable','acceptable_with_artifacts','poor','unacceptable','best','good','fair','excellent','other']);
  ensureStr(req.technologist, 'tech');
  ensureStr(req.pre_post_comparison, 'ppc');
  ensureBool(req.bronchodilator_response, 'bdr');
  ensureStr(req.clinical_question, 'cq');
  ensureStr(req.signed_by, 'sb');
  return { fev1: req.fev1 };
}
function peak_flow(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.reading_id, 'rid');
  ensureNum(req.pef_value, 'pfv');
  ensureNum(req.best_personal, 'bp');
  ensureNum(req.percent_actual, 'pa');
  ensureEnum(req.zone, 'z', ['green','yellow','red','unknown','other']);
  ensureEnum(req.trend, 'tr', ['stable','improving','declining','variable','unclear','unknown','other']);
  ensureNum(req.readings_per_day, 'rpd');
  ensureBool(req.asthma_action_plan_provided, 'aapp');
  ensureStr(req.provider, 'pr');
  ensureNum(req.next_review, 'nr');
  ensureEnum(req.technique_quality, 'tq', ['good','excellent','acceptable','poor','very_poor','unknown','other']);
  return { pef: req.pef_value };
}
function bronchodilator_test(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.study_id, 'sid');
  ensureNum(req.baseline_fev1, 'bf');
  ensureNum(req.post_fev1, 'pf');
  ensureNum(req.percent_change, 'pc');
  ensureEnum(req.classification, 'cls', ['positive_response','negative_response','equivocal','incomplete','other']);
  ensureStr(req.agent, 'ag');
  ensureNum(req.time_to_reassessment_min, 'trm');
  ensureStr(req.technologist, 'tech');
  ensureStr(req.clinical_significance, 'cs');
  ensureStr(req.provider, 'pr');
  return { pc: req.percent_change };
}
function arterial_blood_gas(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.abg_id, 'aid');
  ensureNum(req.ph, 'ph');
  ensureNum(req.pco2, 'pco2');
  ensureNum(req.po2, 'po2');
  ensureNum(req.hco3, 'hco3');
  ensureNum(req.o2_saturation, 'o2s');
  ensureNum(req.be, 'be');
  ensureNum(req.lactate, 'lact');
  ensureStr(req.sample_source, 'ss');
  ensureNum(req.FiO2, 'fio2');
  ensureStr(req.interpretation, 'interp');
  ensureStr(req.collection_time, 'ct');
  ensureStr(req.provider, 'pr');
  return { ph: req.ph };
}
function oximetry_assessment(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.assessment_id, 'aid');
  ensureNum(req.rest_spo2, 'rs');
  ensureNum(req.ambulation_spo2_low, 'asl');
  ensureNum(req.six_minute_walk_distance_ft, 'smwdf');
  ensureBool(req.desaturation_exercise, 'de');
  ensureBool(req.supplemental_o2_required, 'sor');
  ensureNum(req.flow_rate_requirement, 'frr');
  ensureStr(req.duration_of_requirement, 'dor');
  ensureStr(req.provider, 'pr');
  ensureNum(req.next_review, 'nr');
  return { smwdf: req.six_minute_walk_distance_ft };
}

function funcs() { return { spirometry, peak_flow, bronchodilator_test, arterial_blood_gas, oximetry_assessment }; }
module.exports = { funcs, ValidationError };