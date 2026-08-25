'use strict';
class ValidationError extends Error { constructor(m){super(m);this.name='ValidationError';} }
const CITATIONS = { acsm: 'ACSM Guidelines for Exercise Testing 2018' };
function ensureNumber(v, name) { if (typeof v !== 'number' || isNaN(v)) throw new ValidationError(name+' must be number'); return v; }
function ensureEnum(v, opts, name) { if (!opts.includes(v)) throw new ValidationError(name+' must be one of '+opts.join(',')); return v; }
function ensureObj(v, name) { if (!v || typeof v !== 'object') throw new ValidationError(name+' required'); return v; }

function sixMinWalk(input) {
  ensureObj(input, 'input');
  const distance_m = ensureNumber(input.distance_m, 'distance_m');
  const age = ensureNumber(input.age, 'age');
  const is_female = !!input.is_female;
  const baseline_predicted_m = is_female ? (1010 - (age * 5)) : (1100 - (age * 6));
  const pct_predicted = Math.round((distance_m / baseline_predicted_m) * 1000) / 10;
  let severity;
  if (pct_predicted >= 80) { severity = 'normal'; }
  else if (pct_predicted >= 60) { severity = 'mild_impairment'; }
  else if (pct_predicted >= 40) { severity = 'moderate_impairment'; }
  else { severity = 'severe_impairment'; }
  return { distance_m, age, is_female, baseline_predicted_m, pct_predicted, severity };
}

function cardiopulmonaryExercise(input) {
  ensureObj(input, 'input');
  const vo2_max = ensureNumber(input.vo2_max, 'vo2_max');
  const age = ensureNumber(input.age, 'age');
  const is_female = !!input.is_female;
  const predicted = is_female ? (50 - (age * 0.3)) : (55 - (age * 0.4));
  const pct = Math.round((vo2_max / predicted) * 1000) / 10;
  let therapy;
  if (pct >= 90) { therapy = 'no_restriction'; }
  else if (pct >= 70) { therapy = 'moderate_intensity_aerobic'; }
  else if (pct >= 50) { therapy = 'supervised_cardiopulmonary_rehab'; }
  else { therapy = 'low_intensity_consider_supplemental_o2'; }
  return { vo2_max, age, is_female, predicted, pct, therapy, citations:['acsm'] };
}

module.exports = { sixMinWalk, cardiopulmonaryExercise, CITATIONS, ValidationError };
