// filepath: tier33_endocrinology_ext_200_adrenal_engine.js
// TIER33_ENDOCRINOLOGY-200: Adrenal disorders
class ValidationError extends Error { constructor(message, field) { super(message); this.name = 'ValidationError'; this.field = field; this.kind = 'validation'; } }
function ensureNumber(v, f) { if (typeof v !== 'number' || !isFinite(v)) throw new ValidationError(`${f} must be a finite number`, f); }
function ensureStr(v, f) { if (typeof v !== 'string' || !v.length) throw new ValidationError(`${f} required`, f); }
function ensureEnum(v, f, allowed) { if (!allowed.includes(v)) throw new ValidationError(`${f} must be one of ${allowed.join('|')}`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }

function adrenal_incidentaloma(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureNumber(req.lesion_size_cm, 'size');
  ensureNumber(req.hounsfield_units, 'hu');
  ensureBool(req.hormonal_workup_done, 'workup');
  ensureEnum(req.functional, 'func', ['non_functional','cortisol_secreting','aldosterone_secreting','catecholamine_secreting','sex_steroid','inconclusive','other']);
  ensureBool(req.follow_up_6_months, 'fup');
  let status;
  if (req.hounsfield_units > 10 && req.functional === 'non_functional') status = 'high_hu_indeterminate_consider_surgery';
  else if (req.lesion_size_cm >= 4) status = 'large_incidentaloma_surgery_refer';
  else if (req.functional !== 'non_functional' && req.functional !== 'inconclusive') status = 'functional_adenoma_resection';
  else if (req.lesion_size_cm < 4 && req.functional === 'non_functional' && req.hounsfield_units <= 10) status = 'benign_imaging_follow_up';
  else status = 'adrenal_incidentaloma_review';
  return { status, size: req.lesion_size_cm };
}

function cushing_syndrome(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureNumber(req.late_night_salivary_cortisol, 'lnsc');
  ensureEnum(req.dex_suppression_1mg, 'dst', ['positive','negative','inconclusive']);
  ensureNumber(req.acth, 'acth');
  ensureBool(req.imaging_done, 'img');
  ensureEnum(req.cause, 'cause', ['pituitary','ectopic_acth','adrenal','iatrogenic','pseudo_cushing','unknown','other']);
  let status;
  if (req.acth < 5 && req.cause === 'pituitary') status = 'low_acth_inconsistent_re_review';
  else if (req.lnsc > 4 && req.cause === 'ectopic_acth') status = 'ectopic_acth_imaging_urgent';
  else if (req.cause === 'pituitary' && req.acth > 15) status = 'cushing_disease_refer_neurosurgery';
  else if (req.acth < 5 && req.cause === 'adrenal') status = 'adrenal_cushing_adrenalectomy_refer';
  else if (req.lnsc <= 4 && req.dst === 'negative') status = 'cushing_excluded';
  else status = 'cushing_review_appropriate';
  return { status, cause: req.cause };
}

function adrenal_insufficiency(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureNumber(req.cortisol_am, 'cortisol');
  ensureNumber(req.acth, 'acth');
  ensureEnum(req.synacthen_stim, 'stim', ['passed','failed','borderline','not_done']);
  ensureEnum(req.etiology, 'etio', ['primary','secondary','tertiary','iatrogenic','other']);
  ensureNumber(req.hydrocort_dose, 'hc');
  let status;
  if (req.etiology === 'primary' && req.stim === 'failed' && req.hydrocort_dose < 15) status = 'primary_addison_dose_increase_stress_dose_education';
  else if (req.stim === 'failed' && req.hydrocort_dose >= 20 && req.etiology === 'secondary') status = 'secondary_ai_replacement_dose_review';
  else if (req.cortisol_am < 3 && req.stim === 'failed') status = 'ai_diagnosed_glucocorticoid_stress_dose';
  else status = 'ai_review_appropriate';
  return { status, et: req.etiology };
}

function primary_aldosteronism(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureNumber(req.aldosterone_renin_ratio, 'arr');
  ensureNumber(req.aldosterone, 'aldo');
  ensureNumber(req.renin, 'renin');
  ensureEnum(req.confirmatory_test, 'confirm', ['positive','negative','inconclusive','not_done']);
  ensureEnum(req.subtype_workup, 'workup', ['pending','ct_ordered','ct_done','avs_ordered','avs_done','complete','other']);
  let status;
  if (req.arr >= 20 && req.confirmatory_test === 'positive' && req.subtype_workup === 'pending') status = 'pa_confirmed_subtype_workup_urgent';
  else if (req.subtype_workup === 'complete') status = 'pa_subtyped_review_treatment';
  else if (req.arr < 20) status = 'pa_screen_negative';
  else status = 'pa_review_appropriate';
  return { status, arr: req.aldosterone_renin_ratio };
}

function pheochromocytoma(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureNumber(req.plasma_metanephrine, 'plasma');
  ensureNumber(req.urine_metanephrine, 'urine');
  ensureBool(req.imaging_done, 'img');
  ensureNumber(req.tumor_size_cm, 'size');
  ensureBool(req.alpha_blockade, 'alpha');
  let status;
  if (req.tumor_size_cm >= 4 && !req.alpha_blockade) status = 'large_pheo_alpha_blockade_urgent_pre_surgery';
  else if (!req.alpha_blockade && req.plasma_metanephrine > 200) status = 'biochemical_pheo_initiate_alpha';
  else if (req.alpha_blockade && req.imaging_done) status = 'pre_surgical_phaeo_adequate';
  else status = 'pheo_review_appropriate';
  return { status, pl: req.plasma_metanephrine };
}

function funcs() { return { adrenal_incidentaloma, cushing_syndrome, adrenal_insufficiency, primary_aldosteronism, pheochromocytoma }; }
module.exports = { funcs, ValidationError };