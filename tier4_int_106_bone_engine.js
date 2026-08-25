'use strict';
// TIER4_INT-106 Bone/Calcium
const CITATIONS = ['USPSTF_Osteoporosis','Endocrine_Society_Hypercalcemia'];
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

function osteoporosisScreen(input) {
  if (!input || typeof input !== 'object') throw new ValidationError('input required');
  const age = ensureNumber(input.age, 'age');
  const sex = ensureEnum(input.sex, ['male','female'], 'sex');
  const prior_fracture = !!input.prior_fracture;
  const bmi_low = !!input.bmi_low;
  const glucocorticoid_use = !!input.glucocorticoid_use;
  let screen_recommended = false;
  if (sex === 'female' && age >= 65) screen_recommended = true;
  if (sex === 'male' && age >= 70) screen_recommended = true;
  if (prior_fracture || glucocorticoid_use) screen_recommended = true;
  return { age, sex, prior_fracture, bmi_low, glucocorticoid_use, screen_recommended, test: 'dexa_central_hip_and_spine', citations: CITATIONS };
}

function hypercalcemiaWorkup(input) {
  if (!input || typeof input !== 'object') throw new ValidationError('input required');
  const calcium = ensureNumber(input.calcium, 'calcium');
  const pth = ensureNumber(input.pth, 'pth');
  const vitamin_d_25_oh = ensureNumber(input.vitamin_d_25_oh || 30, 'vitamin_d_25_oh');
  let diagnosis = 'normocalcemia';
  if (calcium > 10.5) {
    if (pth > 65) diagnosis = 'primary_hyperparathyroidism';
    else if (vitamin_d_25_oh < 20) diagnosis = 'vitamin_d_related_hypercalcemia_granulomatous_or_iatrogenic';
    else diagnosis = 'non_pth_hypercalcemia_malignancy_or_other_workup';
  }
  return { calcium, pth, vitamin_d_25_oh, diagnosis, citations: CITATIONS };
}

module.exports = { osteoporosisScreen, hypercalcemiaWorkup, CITATIONS, ValidationError };