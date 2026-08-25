'use strict';
// TIER4_ENT-102 Rhinology
const CITATIONS = [
  { id: 'AAOHNS-RHINO-2024', source: 'AAOHNS Rhinology', year: 2024 }
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
function chronicSinusitis(input) {
  const patientId = input.patient_id;
  if (!patientId) throw new ValidationError('patient_id required', 'patient_id');
  const duration_weeks = ensureNumber(input, 'symptom_duration_weeks', 0, 200);
  const polyps = ensureEnum(input, 'polyp_grade', ['0', '1', '2', '3', '4']);
  const eos = ensureNumber(input, 'eosinophil_count', 0, 100);
  const ct_lund_mackay = ensureNumber(input, 'ct_lund_mackay', 0, 24);
  const crs = (duration_weeks >= 12 && ct_lund_mackay >= 4) ? 'crs_definition' : 'acute_or_subacute';
  const therapy = (crs === 'crs_definition') ?
    (eos >= 10 ? 'dupilumab_eos_high' : (polyp_grade >= '2' ? 'salvage_surgery_then_biologic' : 'max_medical_saline_antibi_steroid')) :
    'acute_sinusitis_antibiotic_5_to_10_days';
  return {
    module: 'tier4_ent_102_crs',
    patient_id: patientId,
    duration_weeks,
    polyps: polyps,
    eos,
    ct_lund_mackay,
    crs_diagnosis: crs,
    therapy,
    monitoring: 'q3mo_snot_22_patient_reported',
    citations: CITATIONS
  };
}
function allergicRhinitis(input) {
  const patientId = input.patient_id;
  if (!patientId) throw new ValidationError('patient_id required', 'patient_id');
  const severity = ensureEnum(input, 'severity', ['mild', 'moderate', 'severe']);
  const persistent = ensureEnum(input, 'persistent', ['intermittent', 'persistent']);
  const ocular = input.ocular_symptoms === true;
  const therapy = (severity === 'mild' && persistent === 'intermittent') ? 'oral_antihistamine_prn' :
    ((severity === 'moderate' || persistent === 'persistent') ? 'intranasal_corticosteroid_daily' :
    'intranasal_corticosteroid_plus_oral_anti_histamine');
  const oit = (severity === 'severe' && ocular) ? 'consider_sublingual_immunotherapy' : 'consider_then_progress';
  return {
    module: 'tier4_ent_102_ari',
    patient_id: patientId,
    severity,
    persistent,
    ocular,
    therapy,
    immunotherapy: oit,
    monitoring: 'q3mo_act',
    citations: CITATIONS
  };
}
function epistaxisTriage(input) {
  const patientId = input.patient_id;
  if (!patientId) throw new ValidationError('patient_id required', 'patient_id');
  const systolic = ensureNumber(input, 'sbp', 0, 300);
  const pulse = ensureNumber(input, 'pulse', 0, 250);
  const anticoag = input.on_anticoagulant === true;
  const posterior = input.posterior_source === true;
  const severity = (systolic < 90 || pulse > 120) ? 'hemorrhagic_shock_risk' : 'stable';
  const management = (severity === 'hemorrhagic_shock_risk') ? 'iv_fluid_resuscitation_then_posterior_pack' :
    (posterior ? 'posterior_pack_foley_then_consult_ent_or_ir' : 'anterior_packing_pressure_oxymetazoline_then_silver_nitrate');
  return {
    module: 'tier4_ent_102_epistaxis',
    patient_id: patientId,
    systolic,
    pulse,
    on_anticoagulant: anticoag,
    posterior_source: posterior,
    severity,
    management,
    monitoring: 'q15min_vitals_then_q4h',
    citations: CITATIONS
  };
}
module.exports = {
  chronicSinusitis,
  allergicRhinitis,
  epistaxisTriage,
  CITATIONS,
  ValidationError
};
