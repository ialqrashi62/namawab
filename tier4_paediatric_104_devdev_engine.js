'use strict';
// TIER4_PAEDIATRIC-104 Developmental Milestones
const CITATIONS = ['AAP_Developmental_Milestones','CDC_Learn_the_Signs'];
class ValidationError extends Error { constructor(m){super(m); this.name='ValidationError'; } }
function ensureNumber(v, name) {
  const n = typeof v === 'number' ? v : parseFloat(v);
  if (!Number.isFinite(n)) throw new ValidationError(`${name} must be a number`);
  return n;
}

function developmentalMilestonesCheck(input) {
  if (!input || typeof input !== 'object') throw new ValidationError('input required');
  const age_months = ensureNumber(input.age_months, 'age_months');
  const motor_skills_present = !!input.motor_skills_present;
  const language_skills_present = !!input.language_skills_present;
  const social_skills_present = !!input.social_skills_present;
  const cognitive_skills_present = !!input.cognitive_skills_present;
  const missed_milestones = [];
  if (!motor_skills_present) missed_milestones.push('motor');
  if (!language_skills_present) missed_milestones.push('language');
  if (!social_skills_present) missed_milestones.push('social');
  if (!cognitive_skills_present) missed_milestones.push('cognitive');
  const domains_concern = missed_milestones.length >= 2;
  const action = missed_milestones.length === 0 ? 'routine' : domains_concern ? 'early_intervention_referral_multidisciplinary' : 'reassess_in_2_3_months';
  return { age_months, motor_skills_present, language_skills_present, social_skills_present, cognitive_skills_present, missed_milestones, domains_concern, action, citations: CITATIONS };
}

function autismScreeningMchat(input) {
  if (!input || typeof input !== 'object') throw new ValidationError('input required');
  const age_months = ensureNumber(input.age_months, 'age_months');
  const abnormal_eye_contact = !!input.abnormal_eye_contact;
  const no_response_to_name = !!input.no_response_to_name;
  const no_pointing = !!input.no_pointing;
  const no_pretend_play = !!input.no_pretend_play;
  const repetitive_behaviors = !!input.repetitive_behaviors;
  let failed_items = 0;
  if (abnormal_eye_contact) failed_items++;
  if (no_response_to_name) failed_items++;
  if (no_pointing) failed_items++;
  if (no_pretend_play) failed_items++;
  if (repetitive_behaviors) failed_items++;
  let risk_level = 'low';
  if (failed_items >= 5) risk_level = 'high';
  else if (failed_items >= 3) risk_level = 'moderate';
  return { age_months, failed_items, risk_level, action: risk_level === 'low' ? 'continue_routine_surveillance' : 'comprehensive_diagnostic_evaluation_specialist_referral', citations: CITATIONS };
}

module.exports = { developmentalMilestonesCheck, autismScreeningMchat, CITATIONS, ValidationError };