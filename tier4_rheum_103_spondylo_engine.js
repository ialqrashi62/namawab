'use strict';
// TIER4_RHEUM-103 Spondyloarthropathy (SpA)
const CITATIONS = [
  { id: 'ASAS-2024', source: 'ASAS Spondyloarthritis Guidelines', year: 2024 }
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
function axialSpa(input) {
  const patientId = input.patient_id;
  if (!patientId) throw new ValidationError('patient_id required', 'patient_id');
  const back_pain_yrs = ensureNumber(input, 'back_pain_years', 0, 50);
  const age_onset = ensureNumber(input, 'age_onset_back_pain', 0, 100);
  const hla_b27 = ensureEnum(input, 'hla_b27', ['positive', 'negative', 'pending']);
  const sacroiliitis = ensureEnum(input, 'mri_sacroiliitis', ['none', 'mild', 'moderate', 'severe', 'pending']);
  const enthesitis = input.enthesitis === true;
  const uveitis = input.uveitis === true;
  const psoriasis = input.psoriasis === true;
  const ibd = input.ibd === true;
  const axis_count = (sacroiliitis !== 'none' && sacroiliitis !== 'pending' ? 1 : 0) + (hla_b27 === 'positive' ? 1 : 0) +
    (enthesitis ? 1 : 0) + (uveitis ? 1 : 0) + (psoriasis ? 1 : 0) + (ibd ? 1 : 0);
  const diagnosis = (back_pain_yrs >= 3 && age_onset < 45 && axis_count >= 1) ? 'axial_spa' : 'not_axial_spa';
  const therapy = (diagnosis !== 'axial_spa') ? 'no_nsaid_review' :
    (axis_count >= 2) ? 'tnf_inhibitor_or_il17_inhibitor_then_assess' : 'nsaid_then_assess';
  return {
    module: 'tier4_rheum_103_axial',
    patient_id: patientId,
    back_pain_years: back_pain_yrs,
    age_onset_back_pain: age_onset,
    hla_b27,
    mri_sacroiliitis: sacroiliitis,
    enthesitis,
    uveitis,
    psoriasis,
    ibd,
    axis_count,
    diagnosis,
    therapy,
    monitoring: 'q3mo_assess_q6mo_imaging_q1y_labs',
    citations: CITATIONS
  };
}
function peripheralSpa(input) {
  const patientId = input.patient_id;
  if (!patientId) throw new ValidationError('patient_id required', 'patient_id');
  const subtype = ensureEnum(input, 'subtype', ['psoriatic_arthritis', 'reactive_arthritis', 'ibd_associated', 'undifferentiated']);
  const dactylitis = input.dactylitis === true;
  const enthesitis = input.enthesitis === true;
  const therapy = (dactylitis && enthesitis) ? 'tnf_inhibitor_or_il17_or_il23_then_assess' :
    (subtype === 'psoriatic_arthritis') ? 'mtx_then_tnf_or_il17' :
    (subtype === 'reactive_arthritis') ? 'nsaid_then_review_then_dmard' :
    'mtx_then_biologic_review';
  return {
    module: 'tier4_rheum_103_peripheral',
    patient_id: patientId,
    subtype,
    dactylitis,
    enthesitis,
    therapy,
    monitoring: 'q3mo_disease_activity_q6mo_imaging',
    citations: CITATIONS
  };
}
module.exports = {
  axialSpa,
  peripheralSpa,
  CITATIONS,
  ValidationError
};