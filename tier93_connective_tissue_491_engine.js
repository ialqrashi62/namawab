// filepath: tier93_connective_tissue_491_engine.js
class ValidationError extends Error { constructor(m, f) { super(m); this.field = f; } }
function ensureStr(v, f) { if (typeof v !== 'string' || !v) throw new ValidationError(`${f} required`, f); }
function ensureNum(v, f) { if (typeof v !== 'number' || isNaN(v)) throw new ValidationError(`${f} must be number`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }
function ensureEnum(v, f, list) { if (!list.includes(String(v))) throw new ValidationError(`${f} must be one of ${list.join('|')}`, f); }

function sle_diagnosis(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.assessment_id, 'aid');
  ensureNum(req.ana_titer, 'ana');
  ensureBool(req.anti_dsdna, 'add');
  ensureBool(req.anti_smith, 'asm');
  ensureNum(req.c3, 'c3');
  ensureNum(req.c4, 'c4');
  ensureEnum(req.rash, 'rash', ['malar','discoid','subacute','photosensitive','none','other','unknown']);
  ensureBool(req.serositis, 'ser');
  ensureNum(req.renal_involvement, 'ri');
  ensureStr(req.provider, 'pr');
  return { aid: req.assessment_id };
}
function ssc_diagnosis(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.assessment_id, 'aid');
  ensureNum(req.modified_rodnan_score, 'mrs');
  ensureNum(req.disease_duration_years, 'ddu');
  ensureBool(req.interstitial_lung_disease, 'ild');
  ensureBool(req.pulmonary_hypertension, 'pah');
  ensureBool(req.scl_70_positive, 's70');
  ensureBool(req.centromere_positive, 'cp');
  ensureNum(req.digital_ulcers, 'du');
  ensureStr(req.provider, 'pr');
  return { aid: req.assessment_id };
}
function sjs_diagnosis(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.assessment_id, 'aid');
  ensureNum(req.sicca_score, 'ss');
  ensureNum(req.scha_gr_test, 'sg');
  ensureNum(req.schirmer_test, 'st');
  ensureBool(req.anti_ro, 'aro');
  ensureBool(req.anti_la, 'ala');
  ensureBool(req.parotid_enlargement, 'pe');
  ensureNum(req.lymphoma_screening, 'ls');
  ensureStr(req.provider, 'pr');
  return { aid: req.assessment_id };
}
function myositis_diagnosis(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.assessment_id, 'aid');
  ensureBool(req.muscle_weakness, 'mw');
  ensureNum(req.ck_level, 'ck');
  ensureNum(req.aldolase, 'ald');
  ensureBool(req.emg_myopathic, 'emg');
  ensureBool(req.mri_muscle_edema, 'mri');
  ensureEnum(req.myositis_specific_antibody, 'msa', ['anti_jo_1','anti_mi_2','anti_sr_p','anti_mda5','anti_tif1','none','other','unknown']);
  ensureBool(req.interstitial_lung, 'ild');
  ensureStr(req.provider, 'pr');
  return { aid: req.assessment_id };
}
function overlap_syndromes(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.assessment_id, 'aid');
  ensureNum(req.overlap_features, 'of');
  ensureNum(req.multiple_antibodies, 'ma');
  ensureEnum(req.mixed_diagnosis, 'md', ['sle_ssc','sle_sjs','ssc_myositis','ra_sle','ra_ssc','other','unknown','none']);
  ensureEnum(req.disease_complexity, 'dc', ['low','moderate','high','very_high','unknown','other']);
  ensureNum(req.specialist_referrals, 'sr');
  ensureNum(req.treatment_complexity, 'tc');
  ensureStr(req.provider, 'pr');
  return { aid: req.assessment_id };
}

function funcs() { return { sle_diagnosis, ssc_diagnosis, sjs_diagnosis, myositis_diagnosis, overlap_syndromes }; }
module.exports = { funcs, ValidationError };
