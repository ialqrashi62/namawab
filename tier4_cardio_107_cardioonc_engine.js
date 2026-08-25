'use strict';
// TIER4_CARDIO-107 Cardio-Oncology
const CITATIONS = [
  { id: 'ESC-CardioOnc-2024', source: 'European Society Cardiology Cardio-Onc', year: 2024 }
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
function chemoCardiotoxRisk(input) {
  const patientId = input.patient_id;
  if (!patientId) throw new ValidationError('patient_id required', 'patient_id');
  const agent = ensureEnum(input, 'agent', ['anthracycline', 'trastuzumab', 'bevacizumab', 'tkis', 'immune_checkpoint', 'cyclophosphamide', 'cisplatin', '5fu', 'other']);
  const cumulative_dose = ensureNumber(input, 'cumulative_dose', 0, 1000);
  const age = ensureNumber(input, 'age', 0, 120);
  const baseline_lvef = ensureNumber(input, 'baseline_lvef', 0, 80);
  const hf = (cumulative_dose >= 250 && agent === 'anthracycline') || (baseline_lvef < 50) || (age >= 65);
  const monitoring = hf ? 'echo_q3mo_3mo_after_completion' : 'echo_q6mo_or_after_chemo_3months';
  const cardioprotection = (cumulative_dose >= 250) ? 'dexrazoxane_iron_chelation' : 'none';
  return {
    module: 'tier4_cardio_107_risk',
    patient_id: patientId,
    agent,
    cumulative_dose,
    age,
    baseline_lvef,
    high_risk: hf,
    monitoring,
    cardioprotection,
    citations: CITATIONS
  };
}
function icdPrevention(input) {
  const patientId = input.patient_id;
  if (!patientId) throw new ValidationError('patient_id required', 'patient_id');
  const lvef = ensureNumber(input, 'lvef', 0, 80);
  const nhya = ensureNumber(input, 'nyha_class', 1, 4);
  const qrs = ensureNumber(input, 'qrs_duration_ms', 0, 300);
  const on_optimal = input.on_optimal_therapy_3mo === true;
  const icd = (lvef <= 35 && nhya >= 2 && on_optimal);
  return {
    module: 'tier4_cardio_107_icd',
    patient_id: patientId,
    lvef,
    nyha: nhya,
    qrs_ms: qrs,
    on_optimal_therapy_3mo: on_optimal,
    icd_primary_prevention: icd,
    citations: CITATIONS
  };
}
function radiationHeartDisease(input) {
  const patientId = input.patient_id;
  if (!patientId) throw new ValidationError('patient_id required', 'patient_id');
  const chest_rt = ensureNumber(input, 'chest_radiation_dose_gy', 0, 100);
  const years_since = ensureNumber(input, 'years_since_exposure', 0, 100);
  const pericard = input.pericardial_disease === true;
  const valve = input.valve_disease === true;
  const cad = input.cad === true;
  const hf = input.hf === true;
  const therapy = (pericard || valve || cad || hf) ? 'consult_cardio_onc_dedicated_imaging_advanced' : 'surveillance_5_y_after_then_q5y';
  return {
    module: 'tier4_cardio_107_radiation',
    patient_id: patientId,
    chest_radiation_dose_gy: chest_rt,
    years_since,
    diagnosis: { pericardial_disease: pericard, valve_disease: valve, cad, hf },
    therapy,
    monitoring: 'echo_5y_then_q5y_followup',
    citations: CITATIONS
  };
}
module.exports = {
  chemoCardiotoxRisk,
  icdPrevention,
  radiationHeartDisease,
  CITATIONS,
  ValidationError
};
