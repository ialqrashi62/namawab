'use strict';
// TIER4_INFECT-104 Tropical & Travel Medicine
const CITATIONS = [
  { id: 'CDC-Yellow-Book-2024', source: 'CDC Yellow Book Travel Medicine', year: 2024 }
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
function malariaManagement(input) {
  const patientId = input.patient_id;
  if (!patientId) throw new ValidationError('patient_id required', 'patient_id');
  const species = ensureEnum(input, 'species', ['p_falciparum', 'p_vivax', 'p_ovale', 'p_malariae', 'p_knowlesi', 'unknown']);
  const severity = ensureEnum(input, 'severity', ['uncomplicated', 'complicated', 'severe']);
  const g6pd = ensureEnum(input, 'g6pd', ['normal', 'deficient', 'unknown']);
  const therapy = (severity === 'severe' || severity === 'complicated') ? 'iv_artesunate_then_oral_act' :
    (species === 'p_vivax' || species === 'p_ovale') ? (g6pd === 'deficient' ? 'act_no_primaquine_review' : 'act_then_primaquine_14d_radical_cure') :
    'act_3days_with_or_without_single_dose_primaquine';
  return {
    module: 'tier4_infect_104_malaria',
    patient_id: patientId,
    species,
    severity,
    g6pd,
    therapy,
    monitoring: 'q6h_parasite_count_q12h_glucose_q24h_labs',
    citations: CITATIONS
  };
}
function travelVaccines(input) {
  const patientId = input.patient_id;
  if (!patientId) throw new ValidationError('patient_id required', 'patient_id');
  const destination = ensureEnum(input, 'destination', ['south_america', 'central_america', 'sub_saharan_africa', 'south_asia', 'east_asia', 'middle_east', 'russia_eastern_europe', 'high_altitude', 'other']);
  const duration_weeks = ensureNumber(input, 'duration_weeks', 0, 200);
  const yellow_fever = (destination === 'sub_saharan_africa' || destination === 'south_america') ? 'yellow_fever_vaccine_required' : 'not_required';
  const malaria_chemo = (destination === 'sub_saharan_africa') ? 'atovaquone_proguanil_or_doxycycline_or_mefloquine' : 'no_chemo';
  const therapy = (yellow_fever === 'yellow_fever_vaccine_required' ? 'yellow_fever_vaccine_at_least_10d_before' : '') +
    (malaria_chemo === 'atovaquone_proguanil_or_doxycycline_or_mefloquine' ? ' + malaria_chemoprophylaxis_start_1d_before_travel' : '');
  return {
    module: 'tier4_infect_104_travel',
    patient_id: patientId,
    destination,
    duration_weeks,
    yellow_fever,
    malaria_chemo,
    therapy: therapy.length > 0 ? therapy.trim() : 'no_specific_required',
    monitoring: 'pre_travel_4wk_visit_post_travel_q1mo_review',
    citations: CITATIONS
  };
}
module.exports = {
  malariaManagement,
  travelVaccines,
  CITATIONS,
  ValidationError
};