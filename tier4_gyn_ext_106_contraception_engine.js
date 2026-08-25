'use strict';
class ValidationError extends Error { constructor(m){super(m);this.name='ValidationError';} }
const CITATIONS = { acog_contr: 'ACOG Contraception 2020' };
function ensureNumber(v, name) { if (typeof v !== 'number' || isNaN(v)) throw new ValidationError(name+' must be number'); return v; }
function ensureEnum(v, opts, name) { if (!opts.includes(v)) throw new ValidationError(name+' must be one of '+opts.join(',')); return v; }
function ensureObj(v, name) { if (!v || typeof v !== 'object') throw new ValidationError(name+' required'); return v; }

function contraceptionChoice(input) {
  ensureObj(input, 'input');
  const age = ensureNumber(input.age, 'age');
  const smoker = !!input.smoker;
  const hypertension = !!input.hypertension;
  const diabetes = !!input.diabetes;
  const breastfeeding = !!input.breastfeeding;
  const wants_pregnancy_soon = !!input.wants_pregnancy_soon;
  const migraine = !!input.migraine;
  const bmi = ensureNumber(input.bmi, 'bmi');
  if (wants_pregnancy_soon) { return { age, smoker, hypertension, diabetes, breastfeeding, wants_pregnancy_soon, migraine, bmi, recommendation: 'no_method_planning_pregnancy' }; }
  if (smoker && age >= 35) { return { age, smoker, hypertension, diabetes, breastfeeding, wants_pregnancy_soon, migraine, bmi, recommendation: 'avoid_combined_OC_consider_progestin' }; }
  if (hypertension) { return { age, smoker, hypertension, diabetes, breastfeeding, wants_pregnancy_soon, migraine, bmi, recommendation: 'progestin_only_or_non_hormonal' }; }
  if (migraine) { return { age, smoker, hypertension, diabetes, breastfeeding, wants_pregnancy_soon, migraine, bmi, recommendation: 'progestin_only_or_non_hormonal' }; }
  if (breastfeeding) { return { age, smoker, hypertension, diabetes, breastfeeding, wants_pregnancy_soon, migraine, bmi, recommendation: 'progestin_only_minipill_bf_compatible' }; }
  if (bmi >= 35) { return { age, smoker, hypertension, diabetes, breastfeeding, wants_pregnancy_soon, migraine, bmi, recommendation: 'consider_iud_efficacy_less_oral' }; }
  return { age, smoker, hypertension, diabetes, breastfeeding, wants_pregnancy_soon, migraine, bmi, recommendation: 'combined_OC_first_line' };
}

function emergencyContraception(input) {
  ensureObj(input, 'input');
  const hours_since = ensureNumber(input.hours_since, 'hours_since');
  const weight_kg = ensureNumber(input.weight_kg, 'weight_kg');
  const within_iud_window = hours_since <= 120;
  let therapy;
  if (within_iud_window) { therapy = 'copper_iud_most_effective'; }
  else if (hours_since <= 72) { therapy = 'levonorgestrel_1.5mg_within_72h'; }
  else if (hours_since <= 120) { therapy = 'ulipristal_30mg_within_120h'; }
  else { therapy = 'outside_window_consider_iud_counseling'; }
  const weight_caveat = weight_kg >= 75 ? 'levonorgestrel_less_effective_consider_iud' : 'no_weight_caveat';
  return { hours_since, weight_kg, within_iud_window, therapy, weight_caveat };
}

module.exports = { contraceptionChoice, emergencyContraception, CITATIONS, ValidationError };
