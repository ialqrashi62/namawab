'use strict';
// TIER4_CARDIO-108 Hypertension
const CITATIONS = [
  { id: 'AHA-2024-HTN', source: 'AHA Hypertension 2024', year: 2024 }
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
function htClassification(input) {
  const patientId = input.patient_id;
  if (!patientId) throw new ValidationError('patient_id required', 'patient_id');
  const sbp = ensureNumber(input, 'sbp', 0, 300);
  const dbp = ensureNumber(input, 'dbp', 0, 200);
  let stage = 'normal';
  if (sbp >= 180 || dbp >= 120) stage = 'hypertensive_crisis';
  else if (sbp >= 160 || dbp >= 100) stage = 'stage_2_htn';
  else if (sbp >= 140 || dbp >= 90) stage = 'stage_2_htn_aaha';
  else if (sbp >= 130 || dbp >= 80) stage = 'stage_1_aaha';
  else if (sbp >= 120) stage = 'elevated';
  const therapy = stage === 'hypertensive_crisis' ? 'urgent_iv_or_oral_within_1h_then_discharge_or_admit' :
    (stage === 'stage_2_htn' || stage === 'stage_2_htn_aaha' ? 'initiate_2_agents_lifestyle' : 'lifestyle_then_1_agent_q3mo');
  return {
    module: 'tier4_cardio_108_class',
    patient_id: patientId,
    sbp,
    dbp,
    stage,
    therapy,
    monitoring: 'home_bp_q_week_then_2_to_4_week_followup',
    citations: CITATIONS
  };
}
function htCrisis(input) {
  const patientId = input.patient_id;
  if (!patientId) throw new ValidationError('patient_id required', 'patient_id');
  const sbp = ensureNumber(input, 'sbp', 0, 300);
  const dbp = ensureNumber(input, 'dbp', 0, 200);
  const end_organ = input.target_organ_damage === true;
  const hypertensive = (sbp >= 180 || dbp >= 120);
  const subtype = end_organ ? 'hypertensive_emergency' : 'hypertensive_urgency';
  const therapy = (subtype === 'hypertensive_emergency') ? 'iv_labetalol_or_nicardipine_in_icu_monitor' : 'oral_captopril_25_then_review';
  const target = (subtype === 'hypertensive_emergency') ? 'sbp_minus_25_pct_in_1h_then_160_in_2_to_6h_then_guide' : 'sbp_goal_under_160';
  return {
    module: 'tier4_cardio_108_crisis',
    patient_id: patientId,
    subtype,
    sbp,
    dbp,
    end_organ_damage: end_organ,
    therapy,
    target,
    citations: CITATIONS
  };
}
function resistHt(input) {
  const patientId = input.patient_id;
  if (!patientId) throw new ValidationError('patient_id required', 'patient_id');
  const on_three = input.on_three_agents === true;
  const sbp = ensureNumber(input, 'sbp', 0, 300);
  const dbp = ensureNumber(input, 'dbp', 0, 200);
  const on_diuretic = input.on_diuretic === true;
  const secondary = ['renal_artery_stenosis', 'primary_aldosteronism', 'pheochromocytoma', 'cushing', 'coarctation', 'osa', 'renal_disease'];
  const workup = (on_three && on_diuretic && (sbp >= 140 || dbp >= 90)) ? 'screen_secondary_causes' : 'optimize_meds_adherence';
  return {
    module: 'tier4_cardio_108_resist',
    patient_id: patientId,
    on_three_agents: on_three,
    on_diuretic,
    sbp,
    dbp,
    secondary_causes_screen: secondary,
    workup,
    next_step: 'consider_aldosterone_antagonist_spirololactone_or_amiloride',
    citations: CITATIONS
  };
}
module.exports = {
  htClassification,
  htCrisis,
  resistHt,
  CITATIONS,
  ValidationError
};
