'use strict';
// TIER4_INFECT-106 Bone & Joint Infections
const CITATIONS = [
  { id: 'IDSA-Osteomyelitis-2024', source: 'IDSA Bone Infection Guidelines', year: 2024 }
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
function osteomyelitis(input) {
  const patientId = input.patient_id;
  if (!patientId) throw new ValidationError('patient_id required', 'patient_id');
  const organism = ensureEnum(input, 'organism', ['mrsa', 'mssa', 'pseudomonas', 'salmonella', 'brucella', 'tb', 'culture_negative', 'pending']);
  const site = ensureEnum(input, 'site', ['foot_diabetic', 'vertebral', 'long_bone', 'joint_prosthetic', 'native_joint', 'pelvis', 'other']);
  const dm = input.diabetes === true;
  const therapy = (site === 'foot_diabetic' && dm) ? 'iv_antibiotics_then_offloading_wound_care_6wk' :
    (site === 'vertebral') ? 'iv_antibiotics_x6wk_then_oral_x6wk' :
    (site === 'joint_prosthetic') ? 'iv_antibiotics_4_to_6wk_then_suppressive_review_drainage' :
    (organism === 'mrsa') ? 'iv_vancomycin_then_oral_linezolid_or_daptomycin' :
    'iv_cefazolin_or_nafcillin_then_oral_review';
  return {
    module: 'tier4_infect_106_om',
    patient_id: patientId,
    organism,
    site,
    diabetes: dm,
    therapy,
    monitoring: 'q1wk_inflammatory_markers_q2wk_imaging',
    citations: CITATIONS
  };
}
function septicArthritis(input) {
  const patientId = input.patient_id;
  if (!patientId) throw new ValidationError('patient_id required', 'patient_id');
  const joint = ensureEnum(input, 'joint', ['knee', 'hip', 'shoulder', 'ankle', 'wrist', 'other']);
  const organism = ensureEnum(input, 'organism', ['mrsa', 'mssa', 'gonococcal', 'streptococcal', 'culture_negative', 'pending']);
  const prosthetic = input.prosthetic === true;
  const therapy = (prosthetic) ? 'iv_vanco_plus_cefepime_then_da_irrigation_4wk_then_review' :
    (organism === 'gonococcal') ? 'iv_ceftriaxone_then_oral_then_review' :
    'iv_vanco_plus_ceftriaxone_empiric_then_targeted';
  return {
    module: 'tier4_infect_106_sa',
    patient_id: patientId,
    joint,
    organism,
    prosthetic,
    therapy,
    monitoring: 'q1wk_synovial_fluid_q2wk_imaging_q4wk_inflammatory',
    citations: CITATIONS
  };
}
module.exports = {
  osteomyelitis,
  septicArthritis,
  CITATIONS,
  ValidationError
};