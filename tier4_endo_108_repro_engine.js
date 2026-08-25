'use strict';
// TIER4_ENDO-108 Reproductive Endocrinology
const CITATIONS = [
  { id: 'ASRM-2024', source: 'American Society Reproductive Medicine', year: 2024 }
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
function pcos(input) {
  const patientId = input.patient_id;
  if (!patientId) throw new ValidationError('patient_id required', 'patient_id');
  const cycle_days = ensureNumber(input, 'cycle_length_days', 0, 200);
  const hyperandrogen = input.hyperandrogenism === true;
  const polycystic_ovary = input.polycystic_ovary === true;
  const bmi = ensureNumber(input, 'bmi', 0, 80);
  const phenotype = (cycle_days > 35 && hyperandrogen && polycystic_ovary) ? 'pcos_classic' :
    (cycle_days > 35 && hyperandrogen) ? 'pcos_phenotype_b' :
    (cycle_days > 35 && polycystic_ovary) ? 'pcos_phenotype_c' : 'not_pcos';
  const therapy = (phenotype === 'not_pcos') ? 'review_other_causes' :
    (bmi >= 30) ? 'lifestyle_weight_loss_letrozole_or_metformin' : 'letrozole_or_clomiphene_then_assess';
  return {
    module: 'tier4_endo_108_pcos',
    patient_id: patientId,
    cycle_length_days: cycle_days,
    hyperandrogenism: hyperandrogen,
    polycystic_ovary,
    bmi,
    phenotype,
    therapy,
    monitoring: 'q3mo_cycle_q6mo_androgens',
    citations: CITATIONS
  };
}
function hypogonadism(input) {
  const patientId = input.patient_id;
  if (!patientId) throw new ValidationError('patient_id required', 'patient_id');
  const total_t = ensureNumber(input, 'total_testosterone_ng_dl', 0, 2000);
  const lh = ensureNumber(input, 'lh', 0, 100);
  const fsh = ensureNumber(input, 'fsh', 0, 100);
  const age = ensureNumber(input, 'age', 0, 100);
  const type = (lh < 3 && fsh < 3) ? 'secondary_hypogonadism' :
    (lh > 10 && fsh > 10) ? 'primary_hypogonadism' : 'subclinical';
  const therapy = (type === 'primary_hypogonadism') ? 'testosterone_replacement_fertility_counsel' :
    (type === 'secondary_hypogonadism') ? 'workup_pituitary_imaging_then_hcg_or_trt' :
    'review_lifestyle_obesity_sleep_recheck';
  return {
    module: 'tier4_endo_108_hypogonadism',
    patient_id: patientId,
    total_testosterone_ng_dl: total_t,
    lh,
    fsh,
    age,
    type,
    therapy,
    monitoring: 'q3mo_t_q1y_bone_density_q1y_labs',
    citations: CITATIONS
  };
}
module.exports = {
  pcos,
  hypogonadism,
  CITATIONS,
  ValidationError
};