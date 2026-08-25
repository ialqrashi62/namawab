'use strict';
// TIER4_PULM-103 Interstitial Lung Disease
const CITATIONS = [
  { id: 'ATS-ERS-ILD-2024', source: 'ATS/ERS/JRS/ALAT ILD Guidelines', year: 2024 }
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
function ipfManagement(input) {
  const patientId = input.patient_id;
  if (!patientId) throw new ValidationError('patient_id required', 'patient_id');
  const fvc = ensureNumber(input, 'fvc_pct', 0, 200);
  const dlco = ensureNumber(input, 'dlco_pct', 0, 200);
  const honeycombing = input.honeycombing === true;
  const uip_pattern = ensureEnum(input, 'hrct_pattern', ['uip_definite', 'uip_probable', 'uip_indeterminate', 'alternative']);
  const antifibrotic = (uip_pattern === 'uip_definite' || uip_pattern === 'uip_probable') ? 'pirfenidone_or_nintedanib' : 'review_for_other_ild';
  const therapy = (fvc >= 80) ? 'observe_then_review' : (antifibrotic === 'pirfenidone_or_nintedanib' ? antifibrotic + '_then_supplemental_o2_if_needed' : 'review_immunosuppression_for_other_ild');
  return {
    module: 'tier4_pulm_103_ipf',
    patient_id: patientId,
    fvc_pct: fvc,
    dlco_pct: dlco,
    honeycombing,
    hrct_pattern: uip_pattern,
    therapy,
    monitoring: 'q3mo_pfts_q6mo_ct_q1y_transplant_eval_review',
    citations: CITATIONS
  };
}
function ildDiagnosisWorkup(input) {
  const patientId = input.patient_id;
  if (!patientId) throw new ValidationError('patient_id required', 'patient_id');
  const ct_pattern = ensureEnum(input, 'ct_pattern', ['uip', 'nsip', 'cop', 'd_adipose', 'organizing_pneumonia', 'lymphoid', 'sarcoid', 'unclear']);
  const autoimmune = ensureEnum(input, 'autoimmune', ['none', 'ra', 'ssc', 'sjogren', 'pm_dm', 'mixed_ctd', 'other']);
  const hypersens = ensureEnum(input, 'hypersens', ['none', 'medication', 'occupational', 'avian', 'mold', 'other']);
  const etiology = (autoimmune !== 'none') ? 'ctd_ild' :
    (hypersens !== 'none') ? 'hp_or_drug_ild' :
    (ct_pattern === 'sarcoid') ? 'sarcoidosis_stage_review' :
    (ct_pattern === 'organizing_pneumonia') ? 'cop_review' :
    'idiopathic_ild_workup';
  const therapy = (etiology === 'ctd_ild') ? 'mmf_or_rituximab_or_antifibrotic_review' :
    (etiology === 'hp_or_drug_ild') ? 'antigen_removal_then_steroids_review' :
    (etiology === 'sarcoidosis_stage_review') ? 'consider_steroids_if_symptomatic' :
    'mmf_or_azathioprine_or_antifibrotic_per_pattern';
  return {
    module: 'tier4_pulm_103_workup',
    patient_id: patientId,
    ct_pattern,
    autoimmune,
    hypersens,
    etiology,
    therapy,
    monitoring: 'q3mo_pfts_q6mo_ct_q1y_md_t_review',
    citations: CITATIONS
  };
}
module.exports = {
  ipfManagement,
  ildDiagnosisWorkup,
  CITATIONS,
  ValidationError
};