'use strict';
class ValidationError extends Error { constructor(m){super(m);this.name='ValidationError';} }
const CITATIONS = {
  acr_manual: 'ACR Manual on Contrast Media 2020',
  esur: 'European Society of Urogenital Radiology Guidelines 2018'
};
function ensureNumber(v, name) { if (typeof v !== 'number' || isNaN(v)) throw new ValidationError(name+' must be number'); return v; }
function ensureEnum(v, opts, name) { if (!opts.includes(v)) throw new ValidationError(name+' must be one of '+opts.join(',')); return v; }
function ensureObj(v, name) { if (!v || typeof v !== 'object') throw new ValidationError(name+' required'); return v; }

function contrastRenal(input) {
  ensureObj(input, 'input');
  const egfr = ensureNumber(input.egfr, 'egfr');
  const diabetes = !!input.diabetes;
  const dehydration = !!input.dehydration;
  let risk;
  if (egfr >= 60) { risk = 'low_risk'; }
  else if (egfr >= 45) { risk = 'low_to_moderate'; }
  else if (egfr >= 30) { risk = 'moderate_pre_hydration'; }
  else { risk = 'high_risk_avoid_prefer_alternative'; }
  const precaution = (dehydration || diabetes) && egfr < 45 ? 'IV_hydration_pre_post' : 'standard';
  return { egfr, diabetes, dehydration, risk, precaution, citations:['acr_manual'] };
}

function gfr(input) {
  ensureObj(input, 'input');
  const age = ensureNumber(input.age, 'age');
  const is_female = !!input.is_female;
  const is_black = !!input.is_black;
  const scr = ensureNumber(input.scr, 'scr');
  const ckd_epi = (((is_female ? 144 : 141) * Math.pow(scr / (is_female ? 0.7 : 0.9), (is_female ? -0.329 : -0.411)) * Math.pow(0.993, age)) * (is_female ? 1.018 : 1) * (is_black ? 1.159 : 1));
  return { age, is_female, is_black, scr, gfr_ml_min_1_73m2: Math.round(ckd_epi * 10) / 10 };
}

module.exports = { contrastRenal, gfr, CITATIONS, ValidationError };
