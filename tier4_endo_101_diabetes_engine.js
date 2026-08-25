'use strict';
// TIER4_ENDO-101 Diabetes
const CITATIONS = [
  { id: 'ADA-2024', source: 'American Diabetes Association Standards of Care', year: 2024 }
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
function diabetesClassification(input) {
  const patientId = input.patient_id;
  if (!patientId) throw new ValidationError('patient_id required', 'patient_id');
  const a1c = ensureNumber(input, 'hba1c_pct', 0, 20);
  const age = ensureNumber(input, 'age_at_diagnosis', 0, 120);
  const bmi = ensureNumber(input, 'bmi', 0, 80);
  const antibodies = ensureEnum(input, 'antibody_status', ['gad_positive', 'ia2_positive', 'znT8_positive', 'negative', 'not_tested']);
  const c_peptide = ensureEnum(input, 'c_peptide', ['low', 'normal', 'high', 'pending']);
  const type = (age < 30 && (antibodies !== 'negative' && antibodies !== 'not_tested')) ? 't1dm' :
    (age < 50 && bmi < 30 && c_peptide === 'low') ? 't1dm_lada_possible' :
    (age >= 30 && bmi >= 30) ? 't2dm_likely' :
    (age >= 25 && bmi < 25) ? 'monogenic_or_t1dm' : 't2dm_or_other';
  return {
    module: 'tier4_endo_101_class',
    patient_id: patientId,
    hba1c_pct: a1c,
    age_at_diagnosis: age,
    bmi,
    antibody_status: antibodies,
    c_peptide,
    type,
    monitoring: 'q3mo_a1c_q1y_lipids_q1y_eye_q1y_kidney',
    citations: CITATIONS
  };
}
function insulinInitiation(input) {
  const patientId = input.patient_id;
  if (!patientId) throw new ValidationError('patient_id required', 'patient_id');
  const a1c = ensureNumber(input, 'hba1c_pct', 0, 20);
  const fpg = ensureNumber(input, 'fpg_mg_dl', 0, 1000);
  const egfr = ensureNumber(input, 'egfr', 0, 200);
  const weight_kg = ensureNumber(input, 'weight_kg', 0, 300);
  const candidate = (a1c >= 9 || fpg >= 250 || egfr < 30 || type1_likely(input));
  const therapy = (egfr < 30) ? 'insulin_only_then_titrate' :
    (a1c >= 10) ? 'basal_insulin_then_prandial' : 'basal_insulin_then_oral_bridge';
  const dose_u = Math.round((weight_kg * 0.2) * 10) / 10;
  return {
    module: 'tier4_endo_101_insulin',
    patient_id: patientId,
    hba1c_pct: a1c,
    fpg_mg_dl: fpg,
    egfr,
    weight_kg,
    insulin_candidate: candidate,
    therapy,
    starting_dose_units: dose_u,
    monitoring: 'q2_to_7d_bg_q3mo_a1c',
    citations: CITATIONS
  };
}
function type1_likely(input) {
  if (!input) return false;
  const age = Number(input.age_at_diagnosis || 999);
  const bmi = Number(input.bmi || 0);
  return (age < 30 && bmi < 30);
}
function diabeticKetoacidosis(input) {
  const patientId = input.patient_id;
  if (!patientId) throw new ValidationError('patient_id required', 'patient_id');
  const glucose = ensureNumber(input, 'glucose_mg_dl', 0, 2000);
  const ph = ensureNumber(input, 'ph', 0, 14);
  const hco3 = ensureNumber(input, 'bicarbonate', 0, 50);
  const anion_gap = ensureNumber(input, 'anion_gap', 0, 50);
  const ketones = ensureEnum(input, 'ketones', ['negative', 'trace', 'small', 'moderate', 'large']);
  const severe = (ph < 7.1 || hco3 < 5 || anion_gap >= 16);
  const therapy = (severe) ? 'iv_fluid_then_insulin_drip_then_k_potassium_then_reassess' :
    (glucose >= 250) ? 'iv_fluid_insulin_drip_then_reassess' :
    'supportive_recheck_q1h';
  return {
    module: 'tier4_endo_101_dka',
    patient_id: patientId,
    glucose_mg_dl: glucose,
    ph,
    bicarbonate: hco3,
    anion_gap,
    ketones,
    severity: severe ? 'severe' : 'mild_to_moderate',
    therapy,
    monitoring: 'q1h_glucose_q2h_chem_q4h_k',
    citations: CITATIONS
  };
}
module.exports = {
  diabetesClassification,
  insulinInitiation,
  diabeticKetoacidosis,
  CITATIONS,
  ValidationError
};