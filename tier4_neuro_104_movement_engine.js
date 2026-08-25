'use strict';
// TIER4_NEURO-104 Movement Disorders
const CITATIONS = [
  { id: 'MDS-2024', source: 'Movement Disorder Society', year: 2024 }
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
function parkinsonism(input) {
  const patientId = input.patient_id;
  if (!patientId) throw new ValidationError('patient_id required', 'patient_id');
  const brady = input.bradykinesia === true;
  const rigidity = input.rigidity === true;
  const tremor = input.resting_tremor === true;
  const postural = input.postural_instability === true;
  const asym = input.asymmetric_onset === true;
  const smell = input.hyposmia === true;
  const rem = input.rem_behavior_disorder === true;
  const idiopathic_pd = brady && (rigidity || tremor) && asym && (smell || rem);
  const atypical = postural === true && brady === true && asym === false;
  const therapy = idiopathic_pd ? 'carbidopa_levodopa_if_functional' : (atypical ? 'trial_of_levodopa_review_atypical_workup' : 'review_cause');
  return {
    module: 'tier4_neuro_104_pd',
    patient_id: patientId,
    bradykinesia: brady,
    rigidity,
    tremor,
    postural,
    asymmetric_onset: asym,
    hyposmia: smell,
    rem_behavior: rem,
    idiopathic_pd_likely: idiopathic_pd,
    atypical_likely: atypical,
    therapy,
    citations: CITATIONS
  };
}
function parkinsonDoseSchedule(input) {
  const patientId = input.patient_id;
  if (!patientId) throw new ValidationError('patient_id required', 'patient_id');
  const yo = ensureNumber(input, 'years_on_levodopa', 0, 30);
  const age = ensureNumber(input, 'age', 0, 120);
  const dyskinesia = input.dyskinesia === true;
  const motor_fluct = input.motor_fluctuations === true;
  const strategy = dyskinesia && motor_fluct ? 'consider_dbs_or_apomorphine_pump' :
    (yo > 5 && age < 70) ? 'consider_dbs_candidate' : 'oral_pd_therapy_optimize';
  return {
    module: 'tier4_neuro_104_pd_dose',
    patient_id: patientId,
    years_on_levodopa: yo,
    age,
    dyskinesia,
    motor_fluctuations: motor_fluct,
    strategy,
    initial_therapy: 'levodopa_carbidopa_25_100_tid',
    adjunct: ['dopamine_agonist', 'maob_inhibitor', 'comt_inhibitor'],
    citations: CITATIONS
  };
}
function essentialTremor(input) {
  const patientId = input.patient_id;
  if (!patientId) throw new ValidationError('patient_id required', 'patient_id');
  const bilateral = input.bilateral_action_tremor === true;
  const family_history = input.family_history === true;
  const alcohol_response = input.alcohol_response === true;
  const voice = input.voice_tremor === true;
  const head = input.head_tremor === true;
  const therapy = (bilateral && family_history) ? 'propranolol_or_primidone_first_line' : 'review_cause_labs_fbc_tft_ceruloplasmin';
  return {
    module: 'tier4_neuro_104_et',
    patient_id: patientId,
    bilateral,
    family_history,
    alcohol_response,
    voice,
    head,
    therapy,
    citations: CITATIONS
  };
}
function dystonia(input) {
  const patientId = input.patient_id;
  if (!patientId) throw new ValidationError('patient_id required', 'patient_id');
  const type = ensureEnum(input, 'dystonia_type', ['cervical', 'blepharospasm', 'focal_hand', 'generalized', 'myoclonus_dystonia', 'drug_induced']);
  const therapy = {
    cervical: 'botulinum_toxin_a_first_line',
    blepharospasm: 'botulinum_toxin_a_first_line',
    focal_hand: 'botulinum_toxin_a_task_specific',
    generalized: 'deep_brain_stimulation_candidate_or_muscle_relaxant',
    myoclonus_dystonia: 'benzodiazepine_or_zonisamide',
    drug_induced: 'withdrawal_drug_consideration'
  };
  return {
    module: 'tier4_neuro_104_dystonia',
    patient_id: patientId,
    dystonia_type: type,
    therapy: therapy[type],
    citations: CITATIONS
  };
}
module.exports = {
  parkinsonism,
  parkinsonDoseSchedule,
  essentialTremor,
  dystonia,
  CITATIONS,
  ValidationError
};
