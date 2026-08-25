'use strict';
// TIER4_OBGYN-104 Gynecologic Oncology
const CITATIONS = [
  { id: 'NCCN-Ovarian', source: 'NCCN Ovarian Cancer', year: 2024 },
  { id: 'NCCN-Endometrial', source: 'NCCN Endometrial Cancer', year: 2024 },
  { id: 'NCCN-Cervical', source: 'NCCN Cervical Cancer', year: 2024 }
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
function ovarianCancerRisk(input) {
  const patientId = input.patient_id;
  if (!patientId) throw new ValidationError('patient_id required', 'patient_id');
  const age = ensureNumber(input, 'age', 0, 120);
  const brca_positive = ensureEnum(input, 'brca_status', ['negative', 'brca1', 'brca2', 'unknown', 'pending']);
  const family_history = input.family_history_ovarian === true;
  const endometrioma = input.endometriosis_history === true;
  const ca125 = ensureNumber(input, 'ca125_u_ml', 0, 5000);
  let risk = 'average';
  let recommendation = 'routine_screening';
  if (brca_positive === 'brca1') {
    risk = 'high';
    recommendation = 'rso_35_to_40_years_with_completion_or_screening_tv_us_q6mo';
  } else if (brca_positive === 'brca2') {
    risk = 'high';
    recommendation = 'rso_40_to_45_years';
  } else if (family_history || endometrioma) {
    risk = 'moderate';
    recommendation = 'consider_tv_us_and_ca125_for_evaluation';
  } else if (ca125 > 200) {
    risk = 'elevated';
    recommendation = 'imaging_then_specialist_referral';
  }
  return {
    module: 'tier4_obgyn_104_ovarian_risk',
    patient_id: patientId,
    age,
    brca_status: brca_positive,
    ca125,
    risk,
    recommendation,
    citations: CITATIONS
  };
}
function endometrialCancerWorkup(input) {
  const patientId = input.patient_id;
  if (!patientId) throw new ValidationError('patient_id required', 'patient_id');
  const age = ensureNumber(input, 'age', 0, 120);
  const bleeding_pattern = ensureEnum(input, 'bleeding_pattern', ['postmenopausal', 'abnormal_premenopausal', 'normal', 'postcoital']);
  const bmi = ensureNumber(input, 'bmi', 0, 80);
  const endometrial_thickness_mm = ensureNumber(input, 'endometrial_thickness_mm', 0, 60);
  const ls_sil = input.ls_sil_pap_history === true;
  const workup = {
    biopsy: (age > 45 && bleeding_pattern === 'postmenopausal') || endometrial_thickness_mm >= 4 ? 'endometrial_biopsy' : 'monitor',
    biometric_us: 'transvaginal_ultrasound',
    lynch_screen: age < 50 ? 'consider_lynch_testing_mmr' : 'age_appropriate',
    risk_reduction: bmi > 30 ? 'weight_loss_5_10_percent' : 'lifestyle_review'
  };
  return {
    module: 'tier4_obgyn_104_endometrial',
    patient_id: patientId,
    age,
    bleeding_pattern,
    bmi,
    endometrial_thickness_mm,
    workup,
    citations: CITATIONS
  };
}
function cervicalCancerScreen(input) {
  const patientId = input.patient_id;
  if (!patientId) throw new ValidationError('patient_id required', 'patient_id');
  const age = ensureNumber(input, 'age', 0, 120);
  const hpv_status = ensureEnum(input, 'hpv_status', ['negative', 'positive_hr', 'positive_low', 'unknown', 'inadequate']);
  const cytology = ensureEnum(input, 'cytology', ['negative', 'ascus', 'lsil', 'hsil', 'agc', 'cancer']);
  const prev_screening = input.adequate_prior_screening === true;
  const workup = {
    cotest_negative: 'return_5_year_screening',
    hpv_pos_cyto_neg: 'colposcopy_co_testing_1_year',
    ascus_hpv: 'colposcopy',
    lsil: 'colposcopy_if_25_colpo_or_jv_observation',
    hsil_or_agc: 'colposcopy_with_biopsy_endocervical_sampling',
    postmenopausal: 'endometrial_biopsy_if_agc'
  };
  let key = 'cotest_negative';
  if (hpv_status === 'positive_hr' && cytology === 'negative') key = 'hpv_pos_cyto_neg';
  else if (cytology === 'ascus') key = 'ascus_hpv';
  else if (cytology === 'lsil') key = 'lsil';
  else if (cytology === 'hsil' || cytology === 'agc') key = 'hsil_or_agc';
  return {
    module: 'tier4_obgyn_104_cervical',
    patient_id: patientId,
    age,
    hpv_status,
    cytology,
    workup: workup[key],
    citations: CITATIONS
  };
}
module.exports = {
  ovarianCancerRisk,
  endometrialCancerWorkup,
  cervicalCancerScreen,
  CITATIONS,
  ValidationError
};
