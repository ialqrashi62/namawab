'use strict';
// TIER4_PAEDIATRIC-103 Newborn Exam
const CITATIONS = ['AAP_Newborn_Examination','NRN_Newborn_Care'];
class ValidationError extends Error { constructor(m){super(m); this.name='ValidationError'; } }
function ensureNumber(v, name) {
  const n = typeof v === 'number' ? v : parseFloat(v);
  if (!Number.isFinite(n)) throw new ValidationError(`${name} must be a number`);
  return n;
}
function ensureEnum(v, allowed, name) {
  if (typeof v !== 'string' || !allowed.includes(v)) throw new ValidationError(`${name} must be one of ${allowed.join(',')}`);
  return v;
}

function newbornExam(input) {
  if (!input || typeof input !== 'object') throw new ValidationError('input required');
  const age_hours = ensureNumber(input.age_hours, 'age_hours');
  const apgar_1min = ensureNumber(input.apgar_1min, 'apgar_1min');
  const apgar_5min = ensureNumber(input.apgar_5min, 'apgar_5min');
  const birth_weight_g = ensureNumber(input.birth_weight_g, 'birth_weight_g');
  const skin_normal = !!input.skin_normal;
  const head_normal = !!input.head_normal;
  const eyes_normal = !!input.eyes_normal;
  const heart_normal = !!input.heart_normal;
  const hips_normal = !!input.hips_normal;
  const concerns = [];
  if (!skin_normal) concerns.push('skin');
  if (!head_normal) concerns.push('head');
  if (!eyes_normal) concerns.push('eyes_red_reflex_check');
  if (!heart_normal) concerns.push('cardiac_murmur_evaluate');
  if (!hips_normal) concerns.push('hip_dysplasia_ultrasound_4_6_weeks');
  const jaundice_risk = age_hours > 72 ? 'evaluate_bilirubin_within_24_hours' : 'follow_bilirubin_risk_nomogram';
  return { age_hours, apgar_1min, apgar_5min, birth_weight_g, concerns, jaundice_follow_up: jaundice_risk, citations: CITATIONS };
}

function newbornHipScreening(input) {
  if (!input || typeof input !== 'object') throw new ValidationError('input required');
  const risk_factors = (input.risk_factors && Array.isArray(input.risk_factors)) ? input.risk_factors : [];
  const sex = ensureEnum(input.sex, ['male','female'], 'sex');
  const breech_presentation = risk_factors.includes('breech') || !!input.breech_presentation;
  const family_history_ddh = risk_factors.includes('family_history_ddh') || !!input.family_history_ddh;
  const swaddling_legs_extended = risk_factors.includes('swaddling_extended_legs') || !!input.swaddling_extended_legs;
  const first_born = !!input.first_born;
  let risk_score = 0;
  if (sex === 'female') risk_score += 1;
  if (breech_presentation) risk_score += 3;
  if (family_history_ddh) risk_score += 2;
  if (swaddling_legs_extended) risk_score += 2;
  if (first_born) risk_score += 1;
  const imaging = risk_score >= 4 ? 'hip_ultrasound_4_to_6_weeks' : risk_score >= 2 ? 'hip_ultrasound_consider' : 'clinical_follow_up_until_walking';
  return { sex, breech_presentation, family_history_ddh, swaddling_legs_extended, first_born, risk_score, imaging, citations: CITATIONS };
}

module.exports = { newbornExam, newbornHipScreening, CITATIONS, ValidationError };