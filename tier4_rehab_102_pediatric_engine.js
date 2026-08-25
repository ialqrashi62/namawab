'use strict';
class ValidationError extends Error { constructor(m){super(m);this.name='ValidationError';} }
const CITATIONS = { apmt: 'APMT Pediatric Rehabilitation Practice 2017' };
function ensureNumber(v, name) { if (typeof v !== 'number' || isNaN(v)) throw new ValidationError(name+' must be number'); return v; }
function ensureEnum(v, opts, name) { if (!opts.includes(v)) throw new ValidationError(name+' must be one of '+opts.join(',')); return v; }
function ensureObj(v, name) { if (!v || typeof v !== 'object') throw new ValidationError(name+' required'); return v; }

function gmfcLevels(input) {
  ensureObj(input, 'input');
  const age_months = ensureNumber(input.age_months, 'age_months');
  const level = ensureEnum(input.level, ['i','ii','iii','iv','v'], 'level');
  let description;
  if (level === 'i') { description = 'walks_without_limitations'; }
  else if (level === 'ii') { description = 'walks_with_limitations'; }
  else if (level === 'iii') { description = 'walks_using_handheld_mobility_device'; }
  else if (level === 'iv') { description = 'self_mobility_with_limitations_may_use_powered_mobility'; }
  else { description = 'transported_in_manual_wheelchair'; }
  const therapy = level === 'i' || level === 'ii' ? 'community_ambulation' : level === 'iii' ? 'school_ambulation_assisted' : 'wheelchair_mobility_support';
  return { age_months, level, description, therapy, citations:['apmt'] };
}

function cpGmfcs(input) {
  ensureObj(input, 'input');
  const age_years = ensureNumber(input.age_years, 'age_years');
  const hand_function = ensureEnum(input.hand_function, ['bimanual','mostly_dominant','uses_one','limited_use','no_use'], 'hand_function');
  const mobility = ensureEnum(input.mobility, ['community','limited_community','school','household','wheelchair'], 'mobility');
  const severity_score = (hand_function === 'no_use' ? 4 : hand_function === 'limited_use' ? 3 : hand_function === 'uses_one' ? 2 : hand_function === 'mostly_dominant' ? 1 : 0) + (mobility === 'wheelchair' ? 4 : mobility === 'household' ? 3 : mobility === 'school' ? 2 : mobility === 'limited_community' ? 1 : 0);
  return { age_years, hand_function, mobility, severity_score };
}

module.exports = { gmfcLevels, cpGmfcs, CITATIONS, ValidationError };
