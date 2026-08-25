'use strict';
// TIER4_PULM-108 Pleural Disease
const CITATIONS = [
  { id: 'BTS-Pleural-2024', source: 'British Thoracic Society Pleural Disease', year: 2024 }
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
function pleuralEffusion(input) {
  const patientId = input.patient_id;
  if (!patientId) throw new ValidationError('patient_id required', 'patient_id');
  const type = ensureEnum(input, 'type', ['transudate', 'exudate_light', 'uncomplicated_parapneumonic', 'complicated_parapneumonic', 'empyema', 'malignant', 'hemothorax', 'chylothorax', 'unclear']);
  const size = ensureEnum(input, 'size', ['minimal', 'small', 'moderate', 'large', 'massive']);
  const therapy = (type === 'empyema') ? 'iv_antibiotics_chest_tube_drainage_then_intrapleural_tpa_dnase' :
    (type === 'complicated_parapneumonic') ? 'iv_antibiotics_chest_tube_drainage' :
    (type === 'malignant') ? 'therapeutic_thoracentesis_then_consider_ipf_or_indwelling_catheter' :
    (type === 'transudate') ? 'diuretics_then_review_underlying_heart_or_liver_or_renal' :
    (size === 'large' || size === 'massive') ? 'therapeutic_thoracentesis_then_diag_workup' :
    'diagnostic_thoracentesis_then_review';
  return {
    module: 'tier4_pulm_108_effusion',
    patient_id: patientId,
    type,
    size,
    therapy,
    monitoring: 'q1_to_2wk_imaging_until_resolve_q3mo',
    citations: CITATIONS
  };
}
function pneumothorax(input) {
  const patientId = input.patient_id;
  if (!patientId) throw new ValidationError('patient_id required', 'patient_id');
  const size = ensureEnum(input, 'size', ['small', 'large', 'tension']);
  const trauma = input.traumatic === true;
  const ips_laterality = ensureEnum(input, 'ips', ['primary_sspc', 'secondary', 'traumatic', 'iatrogenic', 'catamenial']);
  const unstable = input.hemodynamically_unstable === true;
  const therapy = (unstable || size === 'tension') ? 'immediate_needle_decompression_then_chest_tube' :
    (size === 'large') ? 'chest_tube_or_aspiration_then_review' :
    (ips_laterality === 'primary_sspc') ? 'observation_then_high_flow_o2_then_review' :
    'chest_tube_then_pleurodesis_for_recurrence';
  return {
    module: 'tier4_pulm_108_pneumothorax',
    patient_id: patientId,
    size,
    ips_laterality,
    traumatic: trauma,
    hemodynamically_unstable: unstable,
    therapy,
    monitoring: 'q4h_cxr_q24h_review_recurrence_prevention',
    citations: CITATIONS
  };
}
module.exports = {
  pleuralEffusion,
  pneumothorax,
  CITATIONS,
  ValidationError
};