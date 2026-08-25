'use strict';
// TIER4_SURG-103 Perioperative
const CITATIONS = ['ACC_2014_Perioperative','NSQIP_Perioperative'];
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

function vteProphylaxis(input) {
  if (!input || typeof input !== 'object') throw new ValidationError('input required');
  const surgery_type = ensureEnum(input.surgery_type || 'general', ['general','orthopedic','cancer','neurosurgery','bariatric'], 'surgery_type');
  const caprini_score = ensureNumber(input.caprini_score || 0, 'caprini_score');
  const bleeding_risk = !!input.bleeding_risk;
  let recommendation = 'LMWH_within_24_hours_surgery';
  if (caprini_score >= 5) recommendation = 'LMWH_extended_28_to_35_days_for_high_risk';
  if (bleeding_risk) recommendation = 'mechanical_prophylaxis_only_intermittent_pneumatic';
  if (surgery_type === 'orthopedic') recommendation = 'LMWH_28_to_35_days';
  return { surgery_type, caprini_score, bleeding_risk, recommendation, citations: CITATIONS };
}

function perioperativeCardiacRisk(input) {
  if (!input || typeof input !== 'object') throw new ValidationError('input required');
  const surgery_high_risk = !!input.surgery_high_risk;
  const functional_capacity = ensureEnum(input.functional_capacity || 'moderate', ['poor','moderate','good','excellent'], 'functional_capacity');
  const recent_mi = !!input.recent_mi;
  let risk = 'low';
  if (surgery_high_risk && functional_capacity === 'poor') risk = 'high';
  if (recent_mi) risk = 'high_defer_if_less_than_60_days_post_mi';
  return { surgery_high_risk, functional_capacity, recent_mi, risk, citations: CITATIONS };
}

module.exports = { vteProphylaxis, perioperativeCardiacRisk, CITATIONS, ValidationError };