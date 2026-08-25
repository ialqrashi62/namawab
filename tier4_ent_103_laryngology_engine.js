'use strict';
// TIER4_ENT-103 Laryngology
const CITATIONS = [
  { id: 'ABEA-2024', source: 'American Broncho-Esophagological Association', year: 2024 }
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
function dysphagiaEvaluation(input) {
  const patientId = input.patient_id;
  if (!patientId) throw new ValidationError('patient_id required', 'patient_id');
  const solids = ensureEnum(input, 'solids_vs_liquids', ['solids_only', 'liquids_only', 'both', 'unknown']);
  const progressive = input.progressive === true;
  const weight_loss = ensureNumber(input, 'weight_loss_kg', 0, 50);
  const aspiration = input.aspiration_signs === true;
  const red_flags = (weight_loss > 5 || aspiration || progressive) ? 'urgent_evaluation' : 'low_acuity';
  const workup = (red_flags === 'urgent_evaluation') ? 'flex_endoscopy_then_barium_swallow_then_manometry' : 'observation_then_barium_swallow';
  return {
    module: 'tier4_ent_103_dysphagia',
    patient_id: patientId,
    solids_vs_liquids: solids,
    progressive,
    weight_loss_kg: weight_loss,
    aspiration,
    red_flags,
    workup,
    monitoring: 'q3mo_alf_then_diet_eval',
    citations: CITATIONS
  };
}
function vocalCordParalysis(input) {
  const patientId = input.patient_id;
  if (!patientId) throw new ValidationError('patient_id required', 'patient_id');
  const laterality = ensureEnum(input, 'laterality', ['unilateral_left', 'unilateral_right', 'bilateral', 'unknown']);
  const cause = ensureEnum(input, 'cause', ['idiopathic', 'surgical', 'tumor', 'trauma', 'neurologic', 'unknown']);
  const compensation = input.compensation_adequate === true;
  const closure = input.posterior_glottic_chink === true;
  const therapy = (compensation || laterality === 'unilateral_right') ? 'speech_therapy_observation' :
    (laterality === 'unilateral_left' && closure) ? 'medialization_injection_then_permanent_medialization' :
    (laterality === 'bilateral') ? 'tracheostomy_or_laser_cordectomy' : 'speech_therapy_observation';
  return {
    module: 'tier4_ent_103_vcp',
    patient_id: patientId,
    laterality,
    cause,
    compensation_adequate: compensation,
    posterior_glottic_chink: closure,
    therapy,
    citations: CITATIONS
  };
}
function globusPharyngeus(input) {
  const patientId = input.patient_id;
  if (!patientId) throw new ValidationError('patient_id required', 'patient_id');
  const alarm = (input.dysphagia === true || input.odynophagia === true || input.weight_loss_kg >= 5 || input.smoker === true || input.male_above_50 === true);
  const workup = alarm ? 'flex_endoscopy_imaging' : 'speech_therapy_empirical_ppi';
  return {
    module: 'tier4_ent_103_globus',
    patient_id: patientId,
    alarm_features: alarm,
    workup,
    monitoring: 'q3mo_review',
    citations: CITATIONS
  };
}
module.exports = {
  dysphagiaEvaluation,
  vocalCordParalysis,
  globusPharyngeus,
  CITATIONS,
  ValidationError
};
