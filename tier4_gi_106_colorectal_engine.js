'use strict';
// TIER4_GI-106 Colorectal
const CITATIONS = [
  { id: 'ASCRS-2024', source: 'American Society Colon Rectal Surgeons', year: 2024 }
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
function hemorrhoids(input) {
  const patientId = input.patient_id;
  if (!patientId) throw new ValidationError('patient_id required', 'patient_id');
  const grade = ensureEnum(input, 'grade', ['I', 'II', 'III', 'IV']);
  const therapy = {
    I: 'conservative_fiber_sitz_bath',
    II: 'conservative_then_rubber_band_ligation',
    III: 'rubber_band_ligation_or_stapled_hemorrhoidopexy',
    IV: 'excisional_hemorrhoidectomy'
  };
  return {
    module: 'tier4_gi_106_hem',
    patient_id: patientId,
    grade,
    therapy: therapy[grade],
    monitoring: 'q1mo_post_then_q6mo',
    citations: CITATIONS
  };
}
function colorectalCancerScreening(input) {
  const patientId = input.patient_id;
  if (!patientId) throw new ValidationError('patient_id required', 'patient_id');
  const age = ensureNumber(input, 'age', 0, 120);
  const family_history = (input.first_degree_relative_crc === true);
  const ibd = (input.ulcerative_colitis === true || input.crohns === true);
  const fit_or_cologuard = (age >= 45 && age <= 75 && !family_history && !ibd) ? 'annual_fit_or_3y_cologuard' : 'not_first_line';
  const colonoscopy = (age >= 45 && !family_history && !ibd) ? 'colonoscopy_q10y' :
    (family_history || ibd) ? 'colonoscopy_q1_to_5y_surveillance' : 'not_eligible_screening_yet';
  return {
    module: 'tier4_gi_106_screening',
    patient_id: patientId,
    age,
    family_history,
    ibd,
    fit_or_cologuard,
    colonoscopy,
    citations: CITATIONS
  };
}
function diverticulitis(input) {
  const patientId = input.patient_id;
  if (!patientId) throw new ValidationError('patient_id required', 'patient_id');
  const complexity = ensureEnum(input, 'hinchey_class', ['Ia', 'Ib', 'II', 'III', 'IV']);
  const therapy = (complexity === 'Ia') ? 'outpatient_oral_antibiotic_clear_liquid' :
    (complexity === 'Ib' || complexity === 'II') ? 'inpatient_iv_antibiotic_npo' :
    (complexity === 'III' || complexity === 'IV') ? 'urgent_operative_or_percutaneous_drainage' : 'not_assessed';
  return {
    module: 'tier4_gi_106_divert',
    patient_id: patientId,
    hinchey_class: complexity,
    therapy,
    monitoring: 'q_post_diet_advance',
    citations: CITATIONS
  };
}
module.exports = {
  hemorrhoids,
  colorectalCancerScreening,
  diverticulitis,
  CITATIONS,
  ValidationError
};
