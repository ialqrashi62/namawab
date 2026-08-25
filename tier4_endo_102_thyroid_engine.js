'use strict';
// TIER4_ENDO-102 Thyroid
const CITATIONS = [
  { id: 'ATA-2024', source: 'American Thyroid Association Guidelines', year: 2024 }
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
function hypothyroidism(input) {
  const patientId = input.patient_id;
  if (!patientId) throw new ValidationError('patient_id required', 'patient_id');
  const tsh = ensureNumber(input, 'tsh', 0, 100);
  const t4_free = ensureNumber(input, 't4_free', 0, 10);
  const etiology = ensureEnum(input, 'etiology', ['hashimoto', 'iatrogenic_post_thyroidectomy', 'iatrogenic_post_rai', 'drug_induced', 'central', 'transient', 'other', 'unknown']);
  const subclinical = (tsh >= 4.5 && t4_free >= 0.8);
  const overt = (tsh >= 10 || t4_free < 0.8);
  const therapy = (overt) ? 'levothyroxine_start_then_titrate' :
    (subclinical) ? 'levothyroxine_if_tsh_gt_10_or_pregnant_or_symptomatic' : 'observe_q6mo_recheck';
  return {
    module: 'tier4_endo_102_hypo',
    patient_id: patientId,
    tsh,
    t4_free,
    etiology,
    subclinical,
    overt,
    therapy,
    monitoring: 'q6_to_8wk_tsh_until_stable_then_q1y',
    citations: CITATIONS
  };
}
function hyperthyroidism(input) {
  const patientId = input.patient_id;
  if (!patientId) throw new ValidationError('patient_id required', 'patient_id');
  const tsh = ensureNumber(input, 'tsh', 0, 100);
  const t4_free = ensureNumber(input, 't4_free', 0, 10);
  const etiology = ensureEnum(input, 'etiology', ['graves', 'toxic_nodule', 'toxic_multinodular', 'subacute_thyroiditis', 'drug_induced', 'other', 'unknown']);
  const severity = (tsh < 0.01 && t4_free >= 2.5) ? 'severe' : (tsh < 0.1) ? 'moderate' : 'mild';
  const therapy = (etiology === 'graves' && severity === 'severe') ? 'methimazole_rai_or_surgery' :
    (etiology === 'graves') ? 'methimazole_then_review' :
    (etiology === 'toxic_nodule' || etiology === 'toxic_multinodular') ? 'rai_or_surgery' :
    'beta_blocker_then_treat_underlying';
  return {
    module: 'tier4_endo_102_hyper',
    patient_id: patientId,
    tsh,
    t4_free,
    etiology,
    severity,
    therapy,
    monitoring: 'q4wk_tsh_t4_until_stable_then_q3mo',
    citations: CITATIONS
  };
}
function thyroidNodule(input) {
  const patientId = input.patient_id;
  if (!patientId) throw new ValidationError('patient_id required', 'patient_id');
  const size_cm = ensureNumber(input, 'nodule_size_cm', 0, 20);
  const tirads = ensureEnum(input, 'tirads', ['tirads_1', 'tirads_2', 'tirads_3', 'tirads_4', 'tirads_5', 'pending']);
  const fna_indicated = (tirads === 'tirads_5') || (tirads === 'tirads_4' && size_cm >= 1.0) || (tirads === 'tirads_3' && size_cm >= 2.5);
  const plan = (fna_indicated) ? 'fna_cytology_then_review' : (tirads === 'tirads_4' || tirads === 'tirads_3') ? 'surveillance_us_q12mo' : 'no_followup_needed';
  return {
    module: 'tier4_endo_102_nodule',
    patient_id: patientId,
    nodule_size_cm: size_cm,
    tirads,
    fna_indicated,
    plan,
    citations: CITATIONS
  };
}
module.exports = {
  hypothyroidism,
  hyperthyroidism,
  thyroidNodule,
  CITATIONS,
  ValidationError
};