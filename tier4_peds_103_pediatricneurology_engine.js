'use strict';
// TIER4_PEDS-103 Pediatric Neurology
// Febrile seizure, epilepsy, CP, hydrocephalus, headache
const CITATIONS = [
  { id: 'ILAE-2023', source: 'International League Against Epilepsy - Pediatric', year: 2023 },
  { id: 'AAN-Peds', source: 'American Academy Neurology - Pediatric', year: 2024 }
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
function febrileSeizureClassification(input) {
  const patientId = input.patient_id;
  if (!patientId) throw new ValidationError('patient_id required', 'patient_id');
  const age_months = ensureNumber(input, 'age_months', 1, 84);
  const fever_max = ensureNumber(input, 'fever_max_c', 36, 42);
  const seizure_min = ensureNumber(input, 'seizure_duration_min', 0, 240);
  const focal = input.focal_features === true;
  const within_24h = ensureNumber(input, 'recurrent_in_24h', 0, 100);
  const cns_infection_excluded = input.cns_infection_excluded === true;
  const simple = !focal && seizure_min < 15 && within_24h < 2 && age_months >= 6 && age_months <= 60 && cns_infection_excluded;
  const complex = focal || seizure_min >= 15 || within_24h >= 2;
  const therapy = simple ? 'reassurance_antipyretic' : 'investigation_eeg_imaging_if_indicated';
  return {
    module: 'tier4_peds_103_febrile_seizure',
    patient_id: patientId,
    simple,
    complex,
    therapy,
    recurrence_risk: age_months < 18 ? '30_percent' : '15_percent',
    citations: CITATIONS
  };
}
function pediatricEpilepsySyndrome(input) {
  const patientId = input.patient_id;
  if (!patientId) throw new ValidationError('patient_id required', 'patient_id');
  const syndrome = ensureEnum(input, 'syndrome', ['bects', 'cae', 'jme', 'jfe', 'lennox_gastaut', 'dravet', 'adnfle', 'panayiotopoulos', 'landau_kleffner']);
  const age_years = ensureNumber(input, 'age_years', 0, 18);
  const seizure_count = ensureNumber(input, 'seizure_count_3mo', 0, 1000);
  const on_aed = input.on_aed === true;
  const aed_regimens = {
    bects: 'often_no_treatment_or_levetiracetam',
    cae: 'valproic_acid_or_ethosuximide',
    jme: 'valproic_acid_or_lamotrigine',
    jfe: 'valproic_acid_or_levetiracetam',
    lennox_gastaut: 'rufinamide_felbamate_cannabidiol',
    dravet: 'stiripentol_cannabidiol_fenfluramine',
    adnfle: 'carbamazepine',
    panayiotopoulos: 'often_no_treatment',
    landau_kleffner: 'steroid_or_ivig_consider_speech_therapy'
  };
  return {
    module: 'tier4_peds_103_epilepsy',
    patient_id: patientId,
    syndrome,
    age_years,
    seizure_count,
    on_aed,
    aed_first_line: aed_regimens[syndrome],
    alternative: 'refer_pediatric_epilepsy_if_drug_resistant',
    citations: CITATIONS
  };
}
function pediatricHeadacheRedFlags(input) {
  const patientId = input.patient_id;
  if (!patientId) throw new ValidationError('patient_id required', 'patient_id');
  const sudden_onset = input.sudden_onset === true;
  const morning_vomiting = input.morning_vomiting === true;
  const focal_neuro = input.focal_neuro === true;
  const optic_papilledema = input.optic_papilledema === true;
  const increased_ictal = input.increased_with_valsalva === true;
  const age_under_5 = ensureNumber(input, 'age_years', 0, 18) < 5;
  const red_flags = [sudden_onset, morning_vomiting, focal_neuro, optic_papilledema, increased_ictal, age_under_5].filter(Boolean).length;
  const imaging_indicated = red_flags >= 1;
  return {
    module: 'tier4_peds_103_headache_redflags',
    patient_id: patientId,
    red_flags_count: red_flags,
    imaging_indicated,
    imaging_type: imaging_indicated ? 'mri_brain_contrast_preferred' : 'none',
    next_step: imaging_indicated ? 'urgent_neuro_imaging' : 'primary_care_followup',
    citations: CITATIONS
  };
}
module.exports = {
  febrileSeizureClassification,
  pediatricEpilepsySyndrome,
  pediatricHeadacheRedFlags,
  CITATIONS,
  ValidationError
};
