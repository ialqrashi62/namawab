'use strict';
// TIER4_NEURO-102 Epilepsy
const CITATIONS = [
  { id: 'ILAE-2023', source: 'International League Against Epilepsy', year: 2023 }
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
function statusEpilepticus(input) {
  const patientId = input.patient_id;
  if (!patientId) throw new ValidationError('patient_id required', 'patient_id');
  const duration_min = ensureNumber(input, 'duration_min', 0, 240);
  const first_line_drug = ensureEnum(input, 'first_line_drug', ['none', 'iv_lorazepam', 'iv_diazepam', 'iv_midazolam', 'im_midazolam', 'rectal_diazepam']);
  const phase = duration_min < 5 ? 'stage_1_early' : (duration_min < 30 ? 'stage_2_established' : 'stage_3_refractory');
  const therapy = (first_line_drug === 'none' && duration_min >= 5) ? 'iv_lorazepam_0_1mg_kg_max_4mg_q5_min_x2' :
    (first_line_drug === 'none' && duration_min < 5) ? 'observe_if_self_aborted' : 'repeat_first_line_seizure_5_min_max';
  const second_line = (phase === 'stage_2_established') ? 'levetiracetam_60mg_kg_or_fosphenytoin_20pe_kg_or_valproate_40mg_kg' : 'pending';
  const anesthetic = (phase === 'stage_3_refractory') ? 'midazolam_or_propofol_or_pentobarbital_coma_with_EEG' : 'pending';
  return {
    module: 'tier4_neuro_102_se',
    patient_id: patientId,
    phase,
    first_line_drug,
    therapy,
    second_line,
    third_line_anesthetic: anesthetic,
    monitoring: 'continuous_eeg_within_1h_for_nonconvulsive',
    citations: CITATIONS
  };
}
function epilepsyDrugSelection(input) {
  const patientId = input.patient_id;
  if (!patientId) throw new ValidationError('patient_id required', 'patient_id');
  const seizure_type = ensureEnum(input, 'seizure_type', ['focal', 'generalized_tonic_clonic', 'absence', 'myoclonic', 'tonic', 'atonic']);
  const syndrome = ensureEnum(input, 'syndrome', ['jme', 'jfe', 'cae', 'bects', 'lennox_gastaut', 'dravet', 'focal_temporal', 'focal_frontal', 'unknown']);
  const childbearing = input.female_childbearing === true;
  const hepatic = input.hepatic_disease === true;
  const mood = input.mood_disorder === true;
  const therapy = {
    focal: 'levetiracetam_lamotrigine_first_line',
    generalized_tonic_clonic: 'valproate_lamotrigine_first_line_avoid_if_childbearing',
    absence: 'ethosuximide_valproate',
    myoclonic: 'valproate_levetiracetam',
    tonic: 'lamotrigine_rfz',
    atonic: 'lamotrigine_rfz'
  };
  let first = therapy[seizure_type];
  if (childbearing && seizure_type === 'generalized_tonic_clonic') first = 'levetiracetam_lamotrigine_secure_contraception';
  if (hepatic) first = 'levetiracetam_brivaracetam_first_line';
  if (mood) first = 'lamotrigine_valproate';
  return {
    module: 'tier4_neuro_102_drug',
    patient_id: patientId,
    seizure_type,
    syndrome,
    therapy: first,
    monitoring: 'asm_levels_lfts_cbc_as_clinically_indicated',
    citations: CITATIONS
  };
}
module.exports = {
  statusEpilepticus,
  epilepsyDrugSelection,
  CITATIONS,
  ValidationError
};
