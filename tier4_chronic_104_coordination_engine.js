'use strict';
class ValidationError extends Error { constructor(m){super(m);this.name='ValidationError';} }
const CITATIONS = { cms_ccm: 'CMS Chronic Care Management 2019' };
function ensureNumber(v, name) { if (typeof v !== 'number' || isNaN(v)) throw new ValidationError(name+' must be number'); return v; }
function ensureEnum(v, opts, name) { if (!opts.includes(v)) throw new ValidationError(name+' must be one of '+opts.join(',')); return v; }
function ensureObj(v, name) { if (!v || typeof v !== 'object') throw new ValidationError(name+' required'); return v; }

function careTeam(input) {
  ensureObj(input, 'input');
  const chronic_conditions = input.chronic_conditions || [];
  const prep_required = ensureNumber(input.prep_required, 'prep_required');
  const care_visits_per_year = ensureNumber(input.care_visits_per_year, 'care_visits_per_year');
  const has_caregiver = !!input.has_caregiver;
  const team = [];
  if (chronic_conditions.length >= 3) { team.push('primary_care'); }
  if (chronic_conditions.includes('diabetes')) { team.push('endocrinology'); }
  if (chronic_conditions.includes('chf') || chronic_conditions.includes('cad')) { team.push('cardiology'); }
  if (chronic_conditions.includes('ckd')) { team.push('nephrology'); }
  if (chronic_conditions.includes('copd') || chronic_conditions.includes('asthma')) { team.push('pulmonology'); }
  if (chronic_conditions.includes('cancer')) { team.push('oncology'); }
  if (prep_required >= 1) { team.push('pharmacy'); }
  if (!has_caregiver) { team.push('social_work'); }
  team.push('primary_care');
  return { chronic_conditions, prep_required, care_visits_per_year, has_caregiver, team, citations:['cms_ccm'] };
}

function visitPlanning(input) {
  ensureObj(input, 'input');
  const care_visits_per_year = ensureNumber(input.care_visits_per_year, 'care_visits_per_year');
  const chronic_conditions = input.chronic_conditions || [];
  const last_visit_days = ensureNumber(input.last_visit_days, 'last_visit_days');
  let next_visit_months;
  if (chronic_conditions.length >= 3) { next_visit_months = 1; }
  else if (chronic_conditions.length === 2) { next_visit_months = 3; }
  else if (chronic_conditions.length === 1) { next_visit_months = 6; }
  else { next_visit_months = 12; }
  if (last_visit_days >= 90 && chronic_conditions.length >= 1) { next_visit_months = Math.min(next_visit_months, 1); }
  return { care_visits_per_year, chronic_conditions, last_visit_days, next_visit_months };
}

module.exports = { careTeam, visitPlanning, CITATIONS, ValidationError };
