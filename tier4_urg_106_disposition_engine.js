'use strict';
class ValidationError extends Error { constructor(m){super(m);this.name='ValidationError';} }
const CITATIONS = { acep_disposition: 'ACEP Emergency Department Disposition Standards 2018' };
function ensureNumber(v, name) { if (typeof v !== 'number' || isNaN(v)) throw new ValidationError(name+' must be number'); return v; }
function ensureEnum(v, opts, name) { if (!opts.includes(v)) throw new ValidationError(name+' must be one of '+opts.join(',')); return v; }
function ensureObj(v, name) { if (!v || typeof v !== 'object') throw new ValidationError(name+' required'); return v; }

function dischargeReadiness(input) {
  ensureObj(input, 'input');
  const ambulating = !!input.ambulating;
  const tolerating_oral = !!input.tolerating_oral;
  const pain_controlled = !!input.pain_controlled;
  const afebrile = !!input.afebrile;
  const vitals_normal = !!input.vitals_normal;
  const responsible_adult = !!input.responsible_adult;
  const total = (ambulating?1:0)+(tolerating_oral?1:0)+(pain_controlled?1:0)+(afebrile?1:0)+(vitals_normal?1:0)+(responsible_adult?1:0);
  if (total === 6) { return { ambulating, tolerating_oral, pain_controlled, afebrile, vitals_normal, responsible_adult, total, disposition: 'safe_discharge' }; }
  if (total >= 4) { return { ambulating, tolerating_oral, pain_controlled, afebrile, vitals_normal, responsible_adult, total, disposition: 'observation_consider_discharge' }; }
  return { ambulating, tolerating_oral, pain_controlled, afebrile, vitals_normal, responsible_adult, total, disposition: 'admit_or_extended_observation' };
}

function admissionDecision(input) {
  ensureObj(input, 'input');
  const diagnosis = ensureEnum(input.diagnosis, ['pneumonia','chf','mi','stroke','gi_bleed','copd_exac','sepsis','other'], 'diagnosis');
  const news2_score = ensureNumber(input.news2_score, 'news2_score');
  const social_factors = !!input.social_factors;
  let decision;
  if (news2_score >= 7) { decision = 'icu_admission'; }
  else if (news2_score >= 5) { decision = 'inpatient_admission_ward'; }
  else if (social_factors) { decision = 'consider_observation_or_admission'; }
  else { decision = 'consider_discharge_with_followup'; }
  return { diagnosis, news2_score, social_factors, decision };
}

module.exports = { dischargeReadiness, admissionDecision, CITATIONS, ValidationError };
