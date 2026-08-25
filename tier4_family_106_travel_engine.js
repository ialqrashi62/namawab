'use strict';
class ValidationError extends Error { constructor(m){super(m);this.name='ValidationError';} }
const CITATIONS = { cdc_travel: 'CDC Yellow Book 2020' };
function ensureNumber(v, name) { if (typeof v !== 'number' || isNaN(v)) throw new ValidationError(name+' must be number'); return v; }
function ensureEnum(v, opts, name) { if (!opts.includes(v)) throw new ValidationError(name+' must be one of '+opts.join(',')); return v; }
function ensureObj(v, name) { if (!v || typeof v !== 'object') throw new ValidationError(name+' required'); return v; }

function travelConsult(input) {
  ensureObj(input, 'input');
  const destination = ensureEnum(input.destination, ['domestic_low_risk','sub_tropical','tropical','developing','high_altitude','cruise'], 'destination');
  const duration_days = ensureNumber(input.duration_days, 'duration_days');
  const age = ensureNumber(input.age, 'age');
  const pregnant = !!input.pregnant;
  const immunocompromised = !!input.immunocompromised;
  const recommendations = [];
  if (destination === 'tropical' || destination === 'developing') { recommendations.push('hepatitis_a_typhoid_malaria_prophylaxis'); }
  if (duration_days >= 30) { recommendations.push('kwt_register_visit_stamp'); }
  if (pregnant) { recommendations.push('avoid_zones_with_zika'); }
  if (immunocompromised) { recommendations.push('avoid_live_vaccines'); }
  if (age >= 60) { recommendations.push('consider_pneumococcal_vaccines'); }
  recommendations.push('travel_insurance_evacuation_coverage');
  return { destination, duration_days, age, pregnant, immunocompromised, recommendations, citations:['cdc_travel'] };
}

function travelVaccines(input) {
  ensureObj(input, 'input');
  const destination = ensureEnum(input.destination, ['domestic_low_risk','sub_tropical','tropical','developing','high_altitude','cruise'], 'destination');
  const received_routine = !!input.received_routine;
  const vaccines = [];
  if (received_routine) { vaccines.push('routine_review'); }
  if (destination === 'tropical' || destination === 'developing') { vaccines.push('yellow_fever'); vaccines.push('hepatitis_a'); vaccines.push('typhoid'); vaccines.push('japanese_encephalitis_consider'); }
  if (destination === 'cruise') { vaccines.push('influenza'); }
  if (destination === 'high_altitude') { vaccines.push('consider_diamox_prophylaxis'); }
  vaccines.push('covid19_review');
  return { destination, received_routine, vaccines };
}

module.exports = { travelConsult, travelVaccines, CITATIONS, ValidationError };
