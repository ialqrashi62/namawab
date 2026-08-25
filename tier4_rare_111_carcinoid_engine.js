'use strict';
// TIER4_RARE-111 Carcinoid Syndrome & NET
const CITATIONS = [
  { id: 'ENETS-2023', source: 'European Neuroendocrine Tumor Society', year: 2023 },
  { id: 'NCCN-NET', source: 'NCCN Guidelines - Neuroendocrine Tumors', year: 2024 }
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
function carcinoidSyndromeDiagnosis(input) {
  const patientId = input.patient_id;
  if (!patientId) throw new ValidationError('patient_id required', 'patient_id');
  const urinary_5hiaa = ensureNumber(input, 'urinary_5hiaa_24h_mg', 0, 200);
  const chromogranin_a = ensureNumber(input, 'chromogranin_a_ng_ml', 0, 5000);
  const flushing = input.flushing === true;
  const diarrhea = input.diarrhea === true;
  const wheezing = input.wheezing === true;
  const carcinoid_heart = input.carcinoid_heart === true;
  const primary_site = ensureEnum(input, 'primary_site', ['small_bowel', 'appendix', 'lung', 'pancreas', 'rectum', 'stomach', 'unknown']);
  const syndrome = (flushing || diarrhea || wheezing) && (urinary_5hiaa > 25 || chromogranin_a > 200);
  return {
    module: 'tier4_rare_111_carcinoid_dx',
    patient_id: patientId,
    syndrome_present: syndrome,
    urinary_5hiaa,
    chromogranin_a,
    primary_site,
    carcinoid_heart_disease: carcinoid_heart,
    symptoms: { flushing, diarrhea, wheezing },
    imaging: 'gallium_68_dotatate_pet_ct',
    next_steps: syndrome ? 'octreotide_initiate_echo_carcinoid_heart' : 'restage_evaluate_tumor_burden',
    citations: CITATIONS
  };
}
function carcinoidSyndromeTreatment(input) {
  const patientId = input.patient_id;
  if (!patientId) throw new ValidationError('patient_id required', 'patient_id');
  const tumor_burden = ensureEnum(input, 'tumor_burden', ['low', 'moderate', 'high']);
  const functional = input.functional === true;
  const somatostatin_receptor_positive = input.sstr_positive === true;
  const therapy = {
    somatostatin_analog: functional ? 'octreotide_lar_30mg_im_q4wk_or_lanreotide_120mg_sc_q4wk' : 'consider_for_tumor_control',
    targeted: somatostatin_receptor_positive && tumor_burden !== 'low' ? 'prrt_lu_177_dotatate' : 'reserve_for_progression',
    cytotoxic: tumor_burden === 'high' ? 'capecitabine_temozolomide_consider' : 'not_initial',
    antidiarrheal: 'loperamide_on_white_bg'
  };
  return {
    module: 'tier4_rare_111_carcinoid_tx',
    patient_id: patientId,
    tumor_burden,
    functional,
    sstr_positive: somatostatin_receptor_positive,
    therapy,
    monitoring: {
      chromogranin_a_q3mo: functional,
      urinary_5hiaa_q3mo: functional,
      ct_q3mo: tumor_burden !== 'low',
      gallium_68_dotatate_q1y: 'restage_for_prrt_eligibility'
    },
    citations: CITATIONS
  };
}
function carcinoidCrisis(input) {
  const patientId = input.patient_id;
  if (!patientId) throw new ValidationError('patient_id required', 'patient_id');
  const bp_systolic = ensureNumber(input, 'bp_systolic', 0, 300);
  const bp_diastolic = ensureNumber(input, 'bp_diastolic', 0, 200);
  const heart_rate = ensureNumber(input, 'heart_rate', 0, 250);
  const temp_c = ensureNumber(input, 'temp_c', 30, 45);
  const on_octreotide = input.on_octreotide === true;
  const trigger = input.trigger || 'unknown';
  const therapy = {
    octreotide_iv: '500_ug_iv_bolus_then_50_ug_per_h_infusion',
    fluids: 'bolus_avoid_if_right_heart_failure',
    vasopressors: 'phenylephrine_or_norepinephrine',
    avoid: ['labetalol', 'pure_beta_blockers', 'succinylcholine', 'morphine', 'desflurane'],
    temperature_control: temp_c > 38.5 ? 'cooling_blanket' : 'monitor'
  };
  return {
    module: 'tier4_rare_111_carcinoid_crisis',
    patient_id: patientId,
    bp: { systolic: bp_systolic, diastolic: bp_diastolic },
    heart_rate,
    temp_c,
    on_octreotide,
    trigger,
    therapy,
    citations: CITATIONS
  };
}
module.exports = {
  carcinoidSyndromeDiagnosis,
  carcinoidSyndromeTreatment,
  carcinoidCrisis,
  CITATIONS,
  ValidationError
};
