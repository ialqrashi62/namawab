'use strict';
// TIER4_INFECT-105 CNS Infections
const CITATIONS = [
  { id: 'IDSA-CNS-2024', source: 'IDSA CNS Infection Guidelines', year: 2024 }
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
function meningitis(input) {
  const patientId = input.patient_id;
  if (!patientId) throw new ValidationError('patient_id required', 'patient_id');
  const age = ensureNumber(input, 'age', 0, 120);
  const etiol = ensureEnum(input, 'suspected_etiology', ['bacterial', 'viral', 'fungal', 'tb', 'other', 'unknown']);
  const csf_pressure = ensureNumber(input, 'csf_opening_pressure', 0, 500);
  const wbc = ensureNumber(input, 'csf_wbc', 0, 50000);
  const therapy = (etiol === 'bacterial') ? 'iv_ceftriaxone_plus_vanco_plus_dexamethasone_then_tap' :
    (etiol === 'viral') ? 'supportive_hsv_then_acyclovir_empiric' :
    (etiol === 'tb') ? 'hrze_plus_streptomycin_then_review' :
    (etiol === 'fungal') ? 'amphotericin_then_flucytosine_then_fluconazole' :
    'empiric_vanco_plus_ceftriaxone_plus_dexamethasone_then_review';
  return {
    module: 'tier4_infect_105_meningitis',
    patient_id: patientId,
    age,
    etiology: etiol,
    csf_opening_pressure: csf_pressure,
    csf_wbc: wbc,
    therapy,
    monitoring: 'q4h_neuro_q24h_lp',
    citations: CITATIONS
  };
}
function encephalitis(input) {
  const patientId = input.patient_id;
  if (!patientId) throw new ValidationError('patient_id required', 'patient_id');
  const etiol = ensureEnum(input, 'etiology', ['hsv', 'wnv', 'japanese_encephalitis', 'cmv', 'hsv2', 'enterovirus', 'autoimmune', 'other', 'unknown']);
  const consciousness = ensureEnum(input, 'consciousness', ['normal', 'altered', 'coma']);
  const therapy = (etiol === 'hsv' || etiol === 'unknown') ? 'iv_acyclovir_then_review_for_negative_pcr' :
    (etiol === 'wnv' || etiol === 'japanese_encephalitis') ? 'supportive_no_specific_antiviral' :
    (etiol === 'autoimmune') ? 'iv_steroids_then_ivig_then_review' :
    'supportive_care';
  return {
    module: 'tier4_infect_105_enceph',
    patient_id: patientId,
    etiology: etiol,
    consciousness,
    therapy,
    monitoring: 'q2h_neuro_q24h_labs_q24h_imaging_per_need',
    citations: CITATIONS
  };
}
module.exports = {
  meningitis,
  encephalitis,
  CITATIONS,
  ValidationError
};