'use strict';
class ValidationError extends Error { constructor(m){super(m);this.name='ValidationError';} }
const CITATIONS = { cms_trans: 'CMS Transitions of Care 2018' };
function ensureNumber(v, name) { if (typeof v !== 'number' || isNaN(v)) throw new ValidationError(name+' must be number'); return v; }
function ensureEnum(v, opts, name) { if (!opts.includes(v)) throw new ValidationError(name+' must be one of '+opts.join(',')); return v; }
function ensureObj(v, name) { if (!v || typeof v !== 'object') throw new ValidationError(name+' required'); return v; }

function dischargeReadinessChronic(input) {
  ensureObj(input, 'input');
  const chronic_conditions = input.chronic_conditions || [];
  const new_medications = ensureNumber(input.new_medications, 'new_medications');
  const education_completed = !!input.education_completed;
  const caregiver_present = !!input.caregiver_present;
  const follow_up_scheduled = !!input.follow_up_scheduled;
  const home_services = !!input.home_services;
  const score = (education_completed?1:0) + (caregiver_present?1:0) + (follow_up_scheduled?1:0) + (home_services?1:0);
  let readiness;
  if (score >= 3 && new_medications <= 3) { readiness = 'ready'; }
  else if (score >= 2) { readiness = 'needs_review'; }
  else { readiness = 'not_ready_extend_stay'; }
  return { chronic_conditions, new_medications, education_completed, caregiver_present, follow_up_scheduled, home_services, score, readiness, citations:['cms_trans'] };
}

function hospitalReadmissionRisk(input) {
  ensureObj(input, 'input');
  const chronic_conditions = input.chronic_conditions || [];
  const previous_admissions_6mo = ensureNumber(input.previous_admissions_6mo, 'previous_admissions_6mo');
  const polypharmacy = !!input.polypharmacy;
  const lack_social_support = !!input.lack_social_support;
  const low_health_literacy = !!input.low_health_literacy;
  const dnr = !!input.dnr;
  let risk = 0;
  if (chronic_conditions.length >= 3) { risk += 1; }
  if (previous_admissions_6mo >= 2) { risk += 2; }
  if (polypharmacy) { risk += 1; }
  if (lack_social_support) { risk += 1; }
  if (low_health_literacy) { risk += 1; }
  if (dnr) { risk += 1; }
  let category;
  if (risk >= 5) { category = 'very_high'; }
  else if (risk >= 3) { category = 'high'; }
  else if (risk >= 1) { category = 'moderate'; }
  else { category = 'low'; }
  return { chronic_conditions, previous_admissions_6mo, polypharmacy, lack_social_support, low_health_literacy, dnr, risk, category };
}

module.exports = { dischargeReadinessChronic, hospitalReadmissionRisk, CITATIONS, ValidationError };
