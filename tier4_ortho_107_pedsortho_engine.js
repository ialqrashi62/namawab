'use strict';
// TIER4_ORTHO-107 Pediatric Orthopedics
const CITATIONS = [
  { id: 'POSNA-2024', source: 'Pediatric Orthopedic Society North America', year: 2024 }
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
function ddhManagement(input) {
  const patientId = input.patient_id;
  if (!patientId) throw new ValidationError('patient_id required', 'patient_id');
  const age_months = ensureNumber(input, 'age_months', 0, 84);
  const side = ensureEnum(input, 'side', ['left', 'right', 'bilateral']);
  const classification = ensureEnum(input, 'graf_class', ['a', 'b', 'c', 'd', '3', '4']);
  const reducible = input.reducible === true;
  const therapy = {
    pavlik_harness: (age_months < 6 && (classification === 'b' || classification === 'c')) ? 'pavlik_harness_3_to_6_months' : 'not_indicated',
    closed_reduction: (age_months < 18 && (classification === 'd' || classification === '3')) ? 'closed_reduction_arthrogram_then_spica' : 'not_indicated',
    open_reduction: classification === '4' || age_months >= 18 ? 'open_reduction_with_osteotomies' : 'not_indicated'
  };
  return {
    module: 'tier4_ortho_107_ddh',
    patient_id: patientId,
    age_months,
    side,
    graf_class: classification,
    reducible,
    therapy,
    monitoring: 'us_q4wk_then_xr_after_6mo',
    citations: CITATIONS
  };
}
function clubfoot(input) {
  const patientId = input.patient_id;
  if (!patientId) throw new ValidationError('patient_id required', 'patient_id');
  const age_days = ensureNumber(input, 'age_days', 0, 365);
  const pirani = ensureNumber(input, 'pirani_score', 0, 6);
  const therapy = 'ponseti_method_weekly_casting_5_to_7_casts_then_tenotomy_then_brace';
  const relapse = input.relapse === true;
  return {
    module: 'tier4_ortho_107_clubfoot',
    patient_id: patientId,
    age_days,
    pirani_score: pirani,
    therapy,
    relapse,
    bracing: 'foot_abduction_brace_full_time_3_month_then_night_until_4_years',
    citations: CITATIONS
  };
}
function scfeManagement(input) {
  const patientId = input.patient_id;
  if (!patientId) throw new ValidationError('patient_id required', 'patient_id');
  const age = ensureNumber(input, 'age', 0, 30);
  const slip_angle = ensureNumber(input, 'southwick_angle', 0, 90);
  const stable = input.stable === true;
  const weight = ensureNumber(input, 'weight_kg', 0, 200);
  const surgery = stable ? 'in_situ_pin_fixation_single_screw' : 'in_situ_no_reduction_gentle_then_fix';
  const bilateral = screen_bilateral('recommend_screening_xr_contralateral_within_3mo');
  return {
    module: 'tier4_ortho_107_scfe',
    patient_id: patientId,
    age,
    slip_angle,
    stable,
    weight,
    surgery,
    bilateral_screening: bilateral,
    rehab: 'limited_weight_bearing_2_to_3_months',
    citations: CITATIONS
  };
}
function screen_bilateral(input) {
  return input;
}
module.exports = {
  ddhManagement,
  clubfoot,
  scfeManagement,
  CITATIONS,
  ValidationError
};
