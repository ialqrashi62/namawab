'use strict';
// TIER4_CARDIO-101 Heart Failure
const CITATIONS = [
  { id: 'AHA-HF-2024', source: 'AHA/ACC/HFSA 2022 HF Guideline', year: 2022 },
  { id: 'ESC-2023', source: 'European Society Cardiology HF', year: 2023 }
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
function hfClassification(input) {
  const patientId = input.patient_id;
  if (!patientId) throw new ValidationError('patient_id required', 'patient_id');
  const lvef = ensureNumber(input, 'lvef', 0, 80);
  const nyha = ensureNumber(input, 'nyha_class', 1, 4);
  const ntprobnp = ensureNumber(input, 'ntprobnp_pg_ml', 0, 50000);
  const ace_inhibitor = input.on_ace_inhibitor_or_arni === true;
  const beta_blocker = input.on_beta_blocker === true;
  const sglt2 = input.on_sglt2_inhibitor === true;
  const mra = input.on_mra === true;
  const phenotype = (lvef >= 50) ? 'hfpef' : (lvef >= 40) ? 'hfmr' : 'hfref';
  const gdmt = (lvef < 40) ? (ace_inhibitor && beta_blocker && sglt2 && mra) ? 'optimal' : 'optimize_missing_arms' : 'focus_on_comorbidities';
  return {
    module: 'tier4_cardio_101_class',
    patient_id: patientId,
    lvef,
    nyha,
    ntprobnp,
    phenotype,
    gdmt_optimized: gdmt,
    monitoring: 'q3mo_clinic_q3mo_echo_q3mo_labs',
    citations: CITATIONS
  };
}
function hfMedicationOptimization(input) {
  const patientId = input.patient_id;
  if (!patientId) throw new ValidationError('patient_id required', 'patient_id');
  const lvef = ensureNumber(input, 'lvef', 0, 80);
  const systolic = ensureNumber(input, 'sbp', 0, 200);
  const potassium = ensureNumber(input, 'potassium', 0, 10);
  const egfr = ensureNumber(input, 'egfr', 0, 120);
  const met = ['sacubitril_valsartan_97_103_bid', 'metoprolol_succinate_200mg_d', 'spironolactone_25mg_d', 'empagliflozin_10mg_d'];
  const safe = potassium < 5.0 && egfr >= 30 && systolic >= 100;
  const add = (lvef < 40 && safe) ? met : 'unable_initiate_review';
  return {
    module: 'tier4_cardio_101_med',
    patient_id: patientId,
    lvef,
    systolic,
    potassium,
    egfr,
    safe_to_initiate: safe,
    therapy_recommended: add,
    monitoring: 'q1week_q1mo_k_lfts_creat_then_q3mo',
    citations: CITATIONS
  };
}
function acuteDecompensatedHF(input) {
  const patientId = input.patient_id;
  if (!patientId) throw new ValidationError('patient_id required', 'patient_id');
  const systolic = ensureNumber(input, 'sbp', 0, 200);
  const creatinine = ensureNumber(input, 'creatinine', 0, 20);
  const sodium = ensureNumber(input, 'sodium', 0, 200);
  const cold_warm = ensureEnum(input, 'cold_warm', ['warm', 'cold']);
  const wet_dry = ensureEnum(input, 'wet_dry', ['wet', 'dry']);
  const profile = `${cold_warm}_${wet_dry}`;
  const therapy = (cold_warm === 'cold' && wet_dry === 'wet') ? 'iv_diuretics_inotropic_vasodilator_perfusion' :
    (cold_warm === 'cold' && wet_dry === 'dry') ? 'inotropic_perfusion_then_diuresis' :
    (cold_warm === 'warm' && wet_dry === 'wet') ? 'iv_diuretics_vasodilator' : 'po_diuretics_then_reassess';
  return {
    module: 'tier4_cardio_101_acute',
    patient_id: patientId,
    systolic,
    creatinine,
    sodium,
    profile,
    therapy,
    monitoring: 'ivc_us_q_day_diuresis_q_intake_output',
    citations: CITATIONS
  };
}
module.exports = {
  hfClassification,
  hfMedicationOptimization,
  acuteDecompensatedHF,
  CITATIONS,
  ValidationError
};
