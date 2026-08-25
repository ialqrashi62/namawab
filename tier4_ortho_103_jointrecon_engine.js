'use strict';
// TIER4_ORTHO-103 Joint Reconstruction
const CITATIONS = [
  { id: 'AAHKS-2024', source: 'American Association Hip Knee Surgeons', year: 2024 }
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
function thaIndication(input) {
  const patientId = input.patient_id;
  if (!patientId) throw new ValidationError('patient_id required', 'patient_id');
  const age = ensureNumber(input, 'age', 0, 120);
  const hoos_jr = ensureNumber(input, 'hoos_jr_score', 0, 100);
  const tonnis = ensureNumber(input, 'tonnis_grade', 0, 3);
  const failed_conservative = input.failed_conservative_6mo === true;
  const surgery = (age < 50 && hoos_jr < 60) || age >= 50 || failed_conservative;
  const approach = ensureEnum(input, 'approach', ['posterior', 'anterior', 'anterolateral', 'lateral']);
  return {
    module: 'tier4_ortho_103_tha',
    patient_id: patientId,
    age,
    hoos_jr_score: hoos_jr,
    tonnis_grade: tonnis,
    surgery_indicated: surgery,
    approach,
    bearing: 'highly_crosslinked_poly_with_ceramic_head_long_lasting',
    citations: CITATIONS
  };
}
function tkaIndication(input) {
  const patientId = input.patient_id;
  if (!patientId) throw new ValidationError('patient_id required', 'patient_id');
  const age = ensureNumber(input, 'age', 0, 120);
  const koos_jr = ensureNumber(input, 'koos_jr_score', 0, 100);
  const kl = ensureNumber(input, 'kl_grade', 0, 4);
  const varus = ensureNumber(input, 'varus_deg', -30, 30);
  const flexion = ensureNumber(input, 'flexion_deg', 0, 150);
  const surgery = kl >= 3 && koos_jr < 60 && flexion >= 90;
  const robotics = (Math.abs(varus) > 10 || age < 60) ? 'consider_robot_assisted_personalized' : 'standard_instrument';
  return {
    module: 'tier4_ortho_103_tka',
    patient_id: patientId,
    age,
    koos_jr,
    kl_grade: kl,
    varus_deg: varus,
    flexion_deg: flexion,
    surgery_indicated: surgery,
    tech: robotics,
    component: 'cemented_cruciate_retaining_or_substitute',
    citations: CITATIONS
  };
}
function revisionTkaPlan(input) {
  const patientId = input.patient_id;
  if (!patientId) throw new ValidationError('patient_id required', 'patient_id');
  const failure_mechanism = ensureEnum(input, 'failure_mechanism', ['infection', 'instability', 'loosening', 'wear', 'stiffness', 'periprosthetic_fx']);
  const crp = ensureNumber(input, 'crp', 0, 200);
  const esr = ensureNumber(input, 'esr', 0, 200);
  const suspected_infection = failure_mechanism === 'infection' || crp > 10 || esr > 30;
  return {
    module: 'tier4_ortho_103_revision',
    patient_id: patientId,
    failure_mechanism,
    crp,
    esr,
    suspected_infection,
    workup: suspected_infection ? 'aspiration_synovial_gram_culture_15_days_off_abx' : 'revision_prep_imaging_full_workup',
    staging: 'two_stage_if_septic_one_stage_if_aseptic',
    citations: CITATIONS
  };
}
module.exports = {
  thaIndication,
  tkaIndication,
  revisionTkaPlan,
  CITATIONS,
  ValidationError
};
