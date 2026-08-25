'use strict';
// TIER4_GERIATRICS-102 Fall Risk
const CITATIONS = ['CDC_STEDI_Falls','STEADI_2024'];
class ValidationError extends Error { constructor(m){super(m); this.name='ValidationError'; } }
function ensureNumber(v, name) {
  const n = typeof v === 'number' ? v : parseFloat(v);
  if (!Number.isFinite(n)) throw new ValidationError(`${name} must be a number`);
  return n;
}

function fallRiskAssessment(input) {
  if (!input || typeof input !== 'object') throw new ValidationError('input required');
  const age = ensureNumber(input.age, 'age');
  const falls_last_year = ensureNumber(input.falls_last_year || 0, 'falls_last_year');
  const gait_problem = !!input.gait_problem;
  const balance_problem = !!input.balance_problem;
  const assistive_device = !!input.assistive_device;
  const vision_problem = !!input.vision_problem;
  const orthostatic = !!input.orthostatic;
  const medications_risk = ensureNumber(input.medications_risk || 0, 'medications_risk');
  let risk_score = 0;
  if (falls_last_year >= 2) risk_score += 4;
  else if (falls_last_year === 1) risk_score += 2;
  if (gait_problem) risk_score += 2;
  if (balance_problem) risk_score += 2;
  if (assistive_device) risk_score += 1;
  if (vision_problem) risk_score += 1;
  if (orthostatic) risk_score += 2;
  risk_score += medications_risk;
  let risk_level = 'low';
  if (risk_score >= 8) risk_level = 'high';
  else if (risk_score >= 4) risk_level = 'moderate';
  const interventions = [];
  if (gait_problem || balance_problem) interventions.push('pt_balance_gait_training');
  if (vision_problem) interventions.push('vision_assessment_annual');
  if (orthostatic) interventions.push('orthostatic_workup_medication_review');
  if (medications_risk >= 2) interventions.push('medication_review_high_risk_drugs');
  interventions.push('vitamin_d_800_to_1000_iu_daily');
  if (risk_level === 'high') interventions.push('home_safety_evaluation');
  return { age, falls_last_year, risk_score, risk_level, interventions, citations: CITATIONS };
}

function timedUpAndGo(input) {
  if (!input || typeof input !== 'object') throw new ValidationError('input required');
  const tug_seconds = ensureNumber(input.tug_seconds, 'tug_seconds');
  const assistive_device = !!input.assistive_device;
  let fall_risk = 'low';
  if (tug_seconds >= 30) fall_risk = 'high';
  else if (tug_seconds >= 14) fall_risk = 'intermediate';
  const recommendation = fall_risk === 'high' ? 'comprehensive_fall_clinic_referral' : fall_risk === 'intermediate' ? 'pt_for_balance_training' : 'annual_reassessment';
  return { tug_seconds, assistive_device, fall_risk, recommendation, citations: CITATIONS };
}

module.exports = { fallRiskAssessment, timedUpAndGo, CITATIONS, ValidationError };