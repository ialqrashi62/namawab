'use strict';
// TIER4_OBGYN-106 Urogynecology / Pelvic Floor
const CITATIONS = [
  { id: 'AUGS-2024', source: 'American Urogynecologic Society', year: 2024 }
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
function pelvicProlapseStage(input) {
  const patientId = input.patient_id;
  if (!patientId) throw new ValidationError('patient_id required', 'patient_id');
  const compartment = ensureEnum(input, 'compartment', ['anterior', 'posterior', 'apical_uterine', 'vaginal_cuff']);
  const stage = ensureNumber(input, 'pop_q_stage', 0, 4);
  const symptoms = input.symptoms === true;
  const therapy = {
    stage_0_1: 'observation_kegels_pessary_consider',
    stage_2: 'pessary_or_surgical_repair',
    stage_3: 'pessary_or_hysterectomy_with_repair',
    stage_4: 'surgical_referral_pessary_management'
  };
  const pick = stage <= 1 ? 'stage_0_1' : (stage === 2 ? 'stage_2' : (stage === 3 ? 'stage_3' : 'stage_4'));
  return {
    module: 'tier4_obgyn_106_prolapse',
    patient_id: patientId,
    compartment,
    pop_q_stage: stage,
    symptoms,
    therapy: therapy[pick],
    citations: CITATIONS
  };
}
function urinaryIncontinenceWorkup(input) {
  const patientId = input.patient_id;
  if (!patientId) throw new ValidationError('patient_id required', 'patient_id');
  const type = ensureEnum(input, 'incontinence_type', ['stress', 'urge', 'mixed', 'overflow', 'functional', 'unknown']);
  const leakage_per_day = ensureNumber(input, 'leakage_episodes_per_day', 0, 50);
  const pad_count = ensureNumber(input, 'pad_count_per_day', 0, 50);
  const postvoid_residual = ensureNumber(input, 'pvr_ml', 0, 1000);
  const therapy = {
    stress: 'pelvic_floor_therapy_pessary_midurethral_sling',
    urge: 'bladder_training_antimuscarinic_or_beta3_agonist',
    mixed: 'predominant_type_first_referral',
    overflow: 'catheter_drainage_treat_cause',
    functional: 'cognitive_mobility_adaptation_medication_review',
    unknown: 'bladder_diary_urodynamic_study'
  };
  return {
    module: 'tier4_obgyn_106_incontinence',
    patient_id: patientId,
    type,
    leakage_per_day,
    pad_count_per_day,
    pvr_ml: postvoid_residual,
    therapy: therapy[type],
    monitoring: 'bladder_diary_3_days',
    citations: CITATIONS
  };
}
module.exports = {
  pelvicProlapseStage,
  urinaryIncontinenceWorkup,
  CITATIONS,
  ValidationError
};
