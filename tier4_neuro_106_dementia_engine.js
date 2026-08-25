'use strict';
// TIER4_NEURO-106 Dementia
const CITATIONS = [
  { id: 'AAN-2024', source: 'American Academy Neurology - Dementia', year: 2024 },
  { id: 'NIA-AA-2024', source: 'National Institute Aging - Alzheimer Association', year: 2024 }
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
function dementiaWorkup(input) {
  const patientId = input.patient_id;
  if (!patientId) throw new ValidationError('patient_id required', 'patient_id');
  const age = ensureNumber(input, 'age', 0, 120);
  const mmse = ensureNumber(input, 'mmse', 0, 30);
  const moca = ensureNumber(input, 'moca', 0, 30);
  const functional_impairment = input.functional_impairment === true;
  const stepwise = input.stepwise_decline === true;
  const fluctuation = input.fluctuating_cognition === true;
  const visual_hallucination = input.visual_hallucination === true;
  const rem_sleep = input.rem_sleep_behavior === true;
  const behavioral_changes = input.behavioral_changes === true;
  const workup = {
    labs: 'tsh_b12_folate_thiamine_rpr_hiv_calcium',
    imaging: 'mri_brain_or_ct',
    spinocerebellar: 'consider_dementia_genetic_panel_if_early_onset'
  };
  let diagnosis = 'alzheimers_disease_likely';
  if (fluctuation && visual_hallucination) diagnosis = 'dementia_with_lewy_bodies';
  else if (behavioral_changes && stepwise_decline === false) diagnosis = 'frontotemporal_dementia';
  else if (stepwise) diagnosis = 'vascular_dementia';
  else if (rem_sleep) diagnosis = 'prodromal_dlb_or_synucleinopathy';
  return {
    module: 'tier4_neuro_106_workup',
    patient_id: patientId,
    age,
    mmse,
    moca,
    functional_impairment,
    stepwise,
    fluctuation,
    visual_hallucination,
    rem_sleep_behavior: rem_sleep,
    behavioral_changes,
    diagnosis,
    workup,
    citations: CITATIONS
  };
}
function dementiaMedication(input) {
  const patientId = input.patient_id;
  if (!patientId) throw new ValidationError('patient_id required', 'patient_id');
  const subtype = ensureEnum(input, 'subtype', ['alzheimer', 'dlb', 'pd_dementia', 'vascular', 'ftd', 'mixed']);
  const mild_moderate = ensureNumber(input, 'mmse', 0, 30) >= 10;
  const therapy = {
    alzheimer: 'cholinesterase_inhibitor_donepezil_or_rivastigmine_plus_memantine',
    dlb: 'rivastigmine_preferred_avoid_antipsychotics',
    pd_dementia: 'rivastigmine',
    vascular: 'bp_statin_antiplatelet_secondary_prevention',
    ftd: 'ssri_for_behavioral_no_standard_cholinesterase_documented',
    mixed: 'cholinesterase_plus_memantine_then_review'
  };
  return {
    module: 'tier4_neuro_106_med',
    patient_id: patientId,
    subtype,
    therapy: therapy[subtype],
    mild_moderate,
    monitoring: 'q6mo_cognitive_reassessment',
    citations: CITATIONS
  };
}
module.exports = {
  dementiaWorkup,
  dementiaMedication,
  CITATIONS,
  ValidationError
};
