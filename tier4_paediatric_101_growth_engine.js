'use strict';
// TIER4_PAEDIATRIC-101 Growth & Anthropometry
const CITATIONS = ['WHO_Growth_Standards','CDC_Growth_Charts'];
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

function growthPercentile(input) {
  if (!input || typeof input !== 'object') throw new ValidationError('input required');
  const age_months = ensureNumber(input.age_months, 'age_months');
  const sex = ensureEnum(input.sex, ['male','female'], 'sex');
  const weight_kg = ensureNumber(input.weight_kg, 'weight_kg');
  const height_cm = ensureNumber(input.height_cm, 'height_cm');
  const hc_cm = ensureNumber(input.hc_cm || 0, 'hc_cm');
  const bmi = weight_kg / Math.pow(height_cm / 100, 2);
  let weight_status = 'normal';
  if (bmi < 16) weight_status = 'underweight';
  else if (bmi >= 25) weight_status = 'overweight';
  else if (bmi >= 30) weight_status = 'obese';
  let height_status = 'normal';
  if (height_cm < 90) height_status = 'short_stature_investigate';
  const microcephaly_threshold = age_months <= 24 && hc_cm > 0 && hc_cm < (sex === 'male' ? 42 : 41);
  const macrocephaly_threshold = age_months <= 24 && hc_cm > (sex === 'male' ? 50 : 49);
  return { age_months, sex, weight_kg, height_cm, hc_cm, bmi: parseFloat(bmi.toFixed(2)), weight_status, height_status, microcephaly_concern: microcephaly_threshold, macrocephaly_concern: macrocephaly_threshold, citations: CITATIONS };
}

function growthVelocityCheck(input) {
  if (!input || typeof input !== 'object') throw new ValidationError('input required');
  const age_months_prev = ensureNumber(input.age_months_prev, 'age_months_prev');
  const height_cm_prev = ensureNumber(input.height_cm_prev, 'height_cm_prev');
  const age_months_current = ensureNumber(input.age_months_current, 'age_months_current');
  const height_cm_current = ensureNumber(input.height_cm_current, 'height_cm_current');
  const months_diff = age_months_current - age_months_prev;
  const cm_diff = height_cm_current - height_cm_prev;
  const cm_per_year = months_diff > 0 ? (cm_diff / months_diff) * 12 : 0;
  let concern = false;
  let referral = 'none';
  if (age_months_current < 24 && cm_per_year < 12) { concern = true; referral = 'consider_growth_hormone_workup'; }
  else if (age_months_current >= 24 && age_months_current < 60 && cm_per_year < 6) { concern = true; referral = 'endocrine_referral'; }
  else if (age_months_current >= 60 && cm_per_year < 5) { concern = true; referral = 'endocrine_referral'; }
  return { months_diff, cm_diff, cm_per_year: parseFloat(cm_per_year.toFixed(2)), concern, referral, citations: CITATIONS };
}

module.exports = { growthPercentile, growthVelocityCheck, CITATIONS, ValidationError };