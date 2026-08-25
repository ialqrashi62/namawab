'use strict';
// TIER4_PEDS-104 Pediatric Pulmonology
// Asthma, bronchiolitis, CF, BPD
const CITATIONS = [
  { id: 'GINA-2024', source: 'GINA - Childhood Asthma', year: 2024 },
  { id: 'AAP-Bronchiolitis', source: 'AAP - Bronchiolitis Guideline', year: 2024 }
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
function pediatricAsthmaControl(input) {
  const patientId = input.patient_id;
  if (!patientId) throw new ValidationError('patient_id required', 'patient_id');
  const age_years = ensureNumber(input, 'age_years', 0, 18);
  const symptoms_day = ensureNumber(input, 'daytime_symptoms_per_week', 0, 30);
  const nighttime = ensureNumber(input, 'nighttime_awakenings_per_month', 0, 30);
  const sab_use = ensureNumber(input, 'sab_canisters_per_year', 0, 12);
  const activity_limitation = input.activity_limitation === true;
  const fev1_pred = ensureNumber(input, 'fev1_pct_pred', 0, 150);
  const control_assessment = symptoms_day <= 2 && nighttime <= 1 && !activity_limitation && sab_use <= 1 ? 'well_controlled'
    : (symptoms_day <= 4 && nighttime <= 2 && fev1_pred >= 80 ? 'partly_controlled' : 'uncontrolled');
  const step = control_assessment === 'well_controlled' ? 1 : (control_assessment === 'partly_controlled' ? 2 : 3);
  const therapy = {
    step1: 'prn_sab_alone',
    step2: 'low_dose_ics_plus_prn_sab',
    step3: 'low_dose_ics_laba_plus_prn_sab',
    step4: 'medium_dose_ics_laba',
    step5: 'high_dose_ics_laba_plus_tiotropium_or_omalizumab',
    step6: 'oral_corticosteroids_biologic'
  };
  const picks = [null, 'step1', 'step2', 'step3', 'step4', 'step5', 'step6'];
  return {
    module: 'tier4_peds_104_asthma',
    patient_id: patientId,
    age_years,
    control_assessment,
    step,
    therapy: therapy[picks[step]],
    monitoring: { act_q1mo: true, peak_flow_daily: fev1_pred < 80, ics_adherence: 'review_at_each_visit' },
    citations: CITATIONS
  };
}
function bronchiolitisSeverity(input) {
  const patientId = input.patient_id;
  if (!patientId) throw new ValidationError('patient_id required', 'patient_id');
  const age_weeks = ensureNumber(input, 'age_weeks', 0, 90);
  const o2_sat = ensureNumber(input, 'o2_sat', 0, 100);
  const resp_rate = ensureNumber(input, 'resp_rate', 0, 120);
  const feeding = ensureEnum(input, 'feeding', ['normal', 'poor', 'cannot']);
  const apnea = input.apnea === true;
  let severity = 'mild';
  if (o2_sat < 92 || resp_rate > 70 || feeding === 'cannot' || apnea) severity = 'severe';
  else if (o2_sat < 94 || resp_rate > 50 || feeding === 'poor') severity = 'moderate';
  const therapy = {
    suction: 'nasal_suction_minimal_handling',
    oxygen: o2_sat < 90 ? 'supplement_2L_nc' : 'no_oxygen',
    hypertonic_saline: 'controversial_do_not_routine',
    bronchodilator: 'not_recommended',
    corticosteroids: 'not_recommended',
    antibiotics: 'only_if_secondary_bacterial_pneumonia'
  };
  return {
    module: 'tier4_peds_104_bronchiolitis',
    patient_id: patientId,
    age_weeks,
    severity,
    therapy,
    admission: severity === 'severe' || (age_weeks < 12 && severity !== 'mild'),
    citations: CITATIONS
  };
}
module.exports = {
  pediatricAsthmaControl,
  bronchiolitisSeverity,
  CITATIONS,
  ValidationError
};
