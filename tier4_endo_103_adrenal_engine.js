'use strict';
// TIER4_ENDO-103 Adrenal
const CITATIONS = [
  { id: 'AACE-2024', source: 'AACE Adrenal Guideline', year: 2024 }
];
class ValidationError extends Error {
  constructor(message, field) {
    super(message);
    this.name = 'ValidationError';
    this.field = field;
    this.code = 'VALIDATION_FAILED';
  }
}
function ensureNumber(obj, key, min, max) {
  const v = obj[key];
  if (v === undefined || v === null) throw new ValidationError(`${key} required`, key);
  const n = Number(v);
  if (Number.isNaN(n)) throw new ValidationError(`${key} not numeric`, key);
  if (min !== undefined && n < min) throw new ValidationError(`${key} < ${min}`, key);
  if (max !== undefined && n > max) throw new ValidationError(`${key} > ${max}`, key);
  return n;
}
function ensureEnum(obj, key, allowed) {
  const v = obj[key];
  if (!allowed.includes(v)) throw new ValidationError(`${key} must be one of ${allowed.join(',')}`, key);
  return v;
}
function adrenalInsufficiency(input) {
  const patientId = input.patient_id;
  if (!patientId) throw new ValidationError('patient_id required', 'patient_id');
  const cortisol_am = ensureNumber(input, 'cortisol_am_ug_dl', 0, 50);
  const acth = ensureNumber(input, 'acth', 0, 1000);
  const etiology = ensureEnum(input, 'etiology', ['primary_addison', 'secondary_pituitary', 'iatrogenic_chronic_steroid', 'other', 'unknown']);
  const adrenal_crisis = input.adrenal_crisis === true;
  const therapy = (adrenal_crisis) ? 'iv_hydrocortisone_100mg_then_fluids_then_stress_dose' :
    (cortisol_am < 3) ? 'physiologic_hydrocortisone_then_taper' :
    'review_with_cosyntropin_stimulation_test';
  return {
    module: 'tier4_endo_103_ai',
    patient_id: patientId,
    cortisol_am: cortisol_am,
    acth,
    etiology,
    adrenal_crisis,
    therapy,
    monitoring: 'q1_to_2wk_until_stable_q3mo_review',
    citations: CITATIONS
  };
}
function cushingsEval(input) {
  const patientId = input.patient_id;
  if (!patientId) throw new ValidationError('patient_id required', 'patient_id');
  const cortisol_24h = ensureNumber(input, 'cortisol_24h_urinary_ug', 0, 10000);
  const acth = ensureNumber(input, 'acth', 0, 1000);
  const dex_suppression = ensureEnum(input, 'dex_suppression', ['suppressed', 'not_suppressed', 'pending']);
  const late_night_salivary = ensureEnum(input, 'salivary_cortisol', ['normal', 'elevated', 'pending']);
  const cushing = (cortisol_24h >= 100 && dex_suppression === 'not_suppressed' && late_night_salivary === 'elevated') ? 'cushing_confirmed' :
    (cortisol_24h >= 50 || dex_suppression === 'not_suppressed') ? 'cushing_possible' : 'not_cushing';
  const etiology = (cushing !== 'not_cushing' && acth > 20) ? 'acth_dependent_pituitary_or_ectopic' :
    (cushing !== 'not_cushing' && acth < 5) ? 'acth_independent_adrenal' : 'not_assessed';
  return {
    module: 'tier4_endo_103_cushing',
    patient_id: patientId,
    cortisol_24h_urinary_ug: cortisol_24h,
    acth,
    dex_suppression,
    salivary_cortisol: late_night_salivary,
    cushing,
    etiology,
    monitoring: 'q3mo_labs_q6mo_imaging_per_etiology',
    citations: CITATIONS
  };
}
function pheochromocytoma(input) {
  const patientId = input.patient_id;
  if (!patientId) throw new ValidationError('patient_id required', 'patient_id');
  const normetanephrine = ensureNumber(input, 'normetanephrine_pg_ml', 0, 100000);
  const metanephrine = ensureNumber(input, 'metanephrine_pg_ml', 0, 100000);
  const sbp = ensureNumber(input, 'sbp', 0, 300);
  const triad = (sbp >= 180 && input.headache === true && input.palpitations === true && input.diaphoresis === true);
  const confirmed = (normetanephrine >= 2000 || metanephrine >= 1000 || triad);
  const therapy = (confirmed) ? 'alpha_blocker_then_beta_then_surgical_resection' : 'monitor_recheck_plasma_metanephrines';
  return {
    module: 'tier4_endo_103_pheo',
    patient_id: patientId,
    normetanephrine,
    metanephrine,
    sbp,
    classic_triad: triad,
    confirmed,
    therapy,
    monitoring: 'pre_op_2wk_alpha_q6mo_post_op_metabolites',
    citations: CITATIONS
  };
}
module.exports = {
  adrenalInsufficiency,
  cushingsEval,
  pheochromocytoma,
  CITATIONS,
  ValidationError
};