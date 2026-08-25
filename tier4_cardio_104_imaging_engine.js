'use strict';
// TIER4_CARDIO-104 Cardiac Imaging
const CITATIONS = [
  { id: 'ASE-2024', source: 'American Society Echocardiography', year: 2024 },
  { id: 'SCCT-2024', source: 'Society Cardiovascular CT', year: 2024 }
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
function echoIndications(input) {
  const patientId = input.patient_id;
  if (!patientId) throw new ValidationError('patient_id required', 'patient_id');
  const indication = ensureEnum(input, 'indication', ['murmur', 'chest_pain', 'dyspnea', 'valve_followup', 'hf_followup', 'cardiomyopathy', 'embolic_source', 'endocarditis', 'pulmonary_htn', 'aortic_disease']);
  const q_per_year = {
    murmur: '1_time_or_2_year',
    chest_pain: 'one_time_or_repeat',
    dyspnea: 'one_time_or_repeat',
    valve_followup: 'depends_severity_q6mo_to_5y',
    hf_followup: 'q3mo_to_q6mo',
    cardiomyopathy: 'q1y_after_stable',
    embolic_source: 'one_time',
    endocarditis: 'one_time_or_q4wk_if_unresolved',
    pulmonary_htn: 'q6mo_to_q1y',
    aortic_disease: 'q1y_for_ascending_aneurysm'
  };
  const tte_performed = input.tte_performed === true;
  const tee_needed = ['endocarditis', 'embolic_source'].includes(indication) || input.valve_prosthesis === true;
  return {
    module: 'tier4_cardio_104_echo',
    patient_id: patientId,
    indication,
    frequency: q_per_year[indication],
    tte_performed,
    tee_needed,
    stress_echo: indication === 'chest_pain' ? 'consider_persistent_dyspnea_with_intermediate_risk' : 'not_routine',
    citations: CITATIONS
  };
}
function coronaryCcta(input) {
  const patientId = input.patient_id;
  if (!patientId) throw new ValidationError('patient_id required', 'patient_id');
  const calcium = ensureNumber(input, 'coronary_calcium_agaston', 0, 2000);
  const age = ensureNumber(input, 'age', 0, 120);
  const chest_pain = ensureEnum(input, 'chest_pain_type', ['typical', 'atypical', 'noncardiac', 'unknown']);
  const dm = input.diabetes === true;
  const ldl = ensureNumber(input, 'ldl', 0, 500);
  const cadence = ensureEnum(input, 'cad_rads', ['0', '1', '2', '3', '4a', '4b', '5']);
  const blocked = parseInt(cadence) >= 4;
  const tx = parseInt(cadence) >= 3 ? 'invasive_workup_with_functional_test' : (parseInt(cadence) >= 2 ? 'consider_functional_test' : 'no_blockade_optimize_risk_factors');
  return {
    module: 'tier4_cardio_104_ccta',
    patient_id: patientId,
    age,
    chest_pain_type: chest_pain,
    calcium_score_agaston: calcium,
    cad_rads: cadence,
    significant_obstruction: blocked,
    recommendation: tx,
    risk_factors: { diabetes: dm, ldl: ldl },
    citations: CITATIONS
  };
}
function cardiacMri(input) {
  const patientId = input.patient_id;
  if (!patientId) throw new ValidationError('patient_id required', 'patient_id');
  const clinical_q = ensureEnum(input, 'clinical_question', ['myocarditis', 'cardiomyopathy_etiology', 'viability', 'mass', 'pericarditis', 'congenital_anomaly', 'shunt', 'gad_lge_quality']);
  const lge_present = input.lge_present === true;
  const t1_mapping = ensureNumber(input, 't1_mapping_ms', 0, 1500);
  const t2_mapping = ensureNumber(input, 't2_mapping_ms', 0, 150);
  const ef = ensureNumber(input, 'lv_ef', 0, 80);
  const interpretation = {
    myocarditis: 'lake_louise_criteria_2_of_3',
    cardiomyopathy_etiology: 't1_t2_lge_pattern_etiology',
    viability: 'extent_of_transmural_lge_lt_50_viable',
    mass: 't1_t2_lge_speckle_q_mass_evaluation',
    pericarditis: 'pericardial_enhancement_lge',
    congenital_anomaly: 'segmental_anatomy_evaluation',
    shunt: 'pcr_qp_qs_calculation',
    gad_lge_quality: 'lge_' + (lge_present ? 'present' : 'absent')
  };
  return {
    module: 'tier4_cardio_104_mri',
    patient_id: patientId,
    clinical_question: clinical_q,
    lv_ef: ef,
    lge_present,
    t1_mapping,
    t2_mapping,
    interpretation: interpretation[clinical_q],
    citations: CITATIONS
  };
}
module.exports = {
  echoIndications,
  coronaryCcta,
  cardiacMri,
  CITATIONS,
  ValidationError
};
