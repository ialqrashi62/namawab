'use strict';
// TIER4_PALL_EXT-101 Pain
const CITATIONS = ['WHO_Cancer_Pain_Ladder','NCCN_Pain'];
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

function whoCancerPainLadder(input) {
  if (!input || typeof input !== 'object') throw new ValidationError('input required');
  const nrs_score = ensureNumber(input.nrs_score, 'nrs_score');
  let ladder_step = 1;
  if (nrs_score >= 4 && nrs_score <= 6) ladder_step = 2;
  else if (nrs_score >= 7) ladder_step = 3;
  let recommendation = 'non_opioid_acetaminophen_or_nsaid_plus_adjuvant';
  if (ladder_step === 2) recommendation = 'mild_opioid_codeine_tramadol_plus_non_opioid';
  if (ladder_step === 3) recommendation = 'strong_opioid_morphine_oxycodone_plus_non_opioid_adjuvant';
  return { nrs_score, ladder_step, recommendation, citations: CITATIONS };
}

function opioidDoseCalculation(input) {
  if (!input || typeof input !== 'object') throw new ValidationError('input required');
  const current_dose_morphine_equiv_mg = ensureNumber(input.current_dose_morphine_equiv_mg, 'current_dose_morphine_equiv_mg');
  const route = ensureEnum(input.route || 'oral', ['oral','subcutaneous','intravenous'], 'route');
  const breakthrough_doses_per_day = ensureNumber(input.breakthrough_doses_per_day || 0, 'breakthrough_doses_per_day');
  const rescue_dose_morphine_equiv = current_dose_morphine_equiv_mg * 0.1;
  let new_dose_factor = 1;
  if (breakthrough_doses_per_day >= 3) new_dose_factor = 1.5;
  else if (breakthrough_doses_per_day >= 1) new_dose_factor = 1.25;
  const new_dose = current_dose_morphine_equiv_mg * new_dose_factor;
  return { current_dose_morphine_equiv_mg, route, breakthrough_doses_per_day, rescue_dose_morphine_equiv, recommended_new_dose: new_dose, citation: CITATIONS };
}

module.exports = { whoCancerPainLadder, opioidDoseCalculation, CITATIONS, ValidationError };