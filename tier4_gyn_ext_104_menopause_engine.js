'use strict';
class ValidationError extends Error { constructor(m){super(m);this.name='ValidationError';} }
const CITATIONS = { nams_ht: 'NAMS Hormone Therapy 2017' };
function ensureNumber(v, name) { if (typeof v !== 'number' || isNaN(v)) throw new ValidationError(name+' must be number'); return v; }
function ensureEnum(v, opts, name) { if (!opts.includes(v)) throw new ValidationError(name+' must be one of '+opts.join(',')); return v; }
function ensureObj(v, name) { if (!v || typeof v !== 'object') throw new ValidationError(name+' required'); return v; }

function menopauseStage(input) {
  ensureObj(input, 'input');
  const age = ensureNumber(input.age, 'age');
  const last_period_months = ensureNumber(input.last_period_months, 'last_period_months');
  const fsh = ensureNumber(input.fsh, 'fsh');
  const hot_flash = !!input.hot_flash;
  const night_sweat = !!input.night_sweat;
  const vaginal_dryness = !!input.vaginal_dryness;
  const stage = last_period_months >= 12 ? 'postmenopause' : last_period_months >= 4 ? 'late_perimenopause' : last_period_months >= 1 && hot_flash ? 'early_perimenopause' : 'premenopause';
  const symptoms = (hot_flash?1:0) + (night_sweat?1:0) + (vaginal_dryness?1:0);
  return { age, last_period_months, fsh, hot_flash, night_sweat, vaginal_dryness, stage, symptoms };
}

function hormoneTherapySafety(input) {
  ensureObj(input, 'input');
  const age = ensureNumber(input.age, 'age');
  const years_since_menopause = ensureNumber(input.years_since_menopause, 'years_since_menopause');
  const breast_cancer_history = !!input.breast_cancer_history;
  const vte_history = !!input.vte_history;
  const chd_history = !!input.chd_history;
  const stroke_history = !!input.stroke_history;
  const liver_disease = !!input.liver_disease;
  let recommendation;
  if (breast_cancer_history || vte_history || chd_history || stroke_history || liver_disease) { recommendation = 'contraindicated'; }
  else if (age >= 60 || years_since_menopause >= 10) { recommendation = 'systemic_ht_cautioned_use_transdermal'; }
  else if (years_since_menopause < 10 && age < 60) { recommendation = 'safe_lowest_dose'; }
  else { recommendation = 'non_hormonal_alternatives'; }
  return { age, years_since_menopause, breast_cancer_history, vte_history, chd_history, stroke_history, liver_disease, recommendation, citations:['nams_ht'] };
}

module.exports = { menopauseStage, hormoneTherapySafety, CITATIONS, ValidationError };
