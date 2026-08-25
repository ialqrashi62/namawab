'use strict';
// TIER4_INFECT-101 General ID (Sepsis, Fever of Unknown Origin)
const CITATIONS = [
  { id: 'SSC-2021', source: 'Surviving Sepsis Campaign', year: 2024 }
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
function sepsisBundle(input) {
  const patientId = input.patient_id;
  if (!patientId) throw new ValidationError('patient_id required', 'patient_id');
  const lactate = ensureNumber(input, 'lactate', 0, 30);
  const map = ensureNumber(input, 'mean_arterial_pressure', 0, 200);
  const source = ensureEnum(input, 'source', ['pulmonary', 'abdominal', 'uti', 'skin_soft_tissue', 'cns', 'line', 'endocarditis', 'unknown', 'other']);
  const sepsis = (lactate >= 2 || map < 65) ? 'septic' : 'not_septic';
  const therapy = (sepsis === 'septic') ? 'fluid_bolus_then_antibiotics_within_1h_then_vasopressors_then_review' :
    'no_antibiotic_review_other_causes';
  return {
    module: 'tier4_infect_101_sepsis',
    patient_id: patientId,
    lactate,
    mean_arterial_pressure: map,
    source,
    sepsis,
    therapy,
    monitoring: 'q1h_vitals_q4h_lactate_q12h_labs',
    citations: CITATIONS
  };
}
function fuo(input) {
  const patientId = input.patient_id;
  if (!patientId) throw new ValidationError('patient_id required', 'patient_id');
  const days = ensureNumber(input, 'fever_days', 0, 365);
  const travel = input.travel_history === true;
  const hiv = ensureEnum(input, 'hiv_status', ['positive', 'negative', 'pending']);
  const immunocompromised = input.immunocompromised === true;
  const category = (hiv === 'positive' || immunocompromised) ? 'fuo_in_immunocompromised' :
    (travel) ? 'fuo_travel_related' : 'classic_fuo';
  const workup = (category === 'fuo_in_immunocompromised') ? 'ct_chest_abdomen_blood_x3_ehrlichia_cmv_hhv6' :
    (category === 'fuo_travel_related') ? 'malaria_thick_smart_typhoid_leptospira_serology_then_review' :
    'blood_cx_x3_ct_chest_abdomen_anemia_review_then_biopsy_if_needed';
  return {
    module: 'tier4_infect_101_fuo',
    patient_id: patientId,
    fever_days: days,
    travel_history: travel,
    hiv_status: hiv,
    immunocompromised,
    category,
    workup,
    citations: CITATIONS
  };
}
module.exports = {
  sepsisBundle,
  fuo,
  CITATIONS,
  ValidationError
};