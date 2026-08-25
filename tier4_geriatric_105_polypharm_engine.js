'use strict';
// TIER4_GERIATRICS-105 Polypharmacy / Deprescribing
const CITATIONS = ['Beers_Criteria_2023','STOPP_START'];
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

function beersCriteriaCheck(input) {
  if (!input || typeof input !== 'object') throw new ValidationError('input required');
  const age = ensureNumber(input.age, 'age');
  const medications = Array.isArray(input.medications) ? input.medications : [];
  const beers_high_risk = ['benzodiazepine','anticholinergic','z_drug','sulfonylurea_long','nitrofurantoin','first_gen_antipsychotic','tramadol'];
  const flagged = [];
  for (const m of medications) {
    const med = typeof m === 'string' ? m : (m && m.name) || '';
    const cls = (m && m.class) || 'unknown';
    if (beers_high_risk.includes(cls) && age >= 65) {
      flagged.push({ medication: med, class: cls, recommendation: 'review_for_discontinuation_or_alternative' });
    }
  }
  return { age, medication_count: medications.length, flagged_count: flagged.length, flagged, citations: CITATIONS };
}

function deprescribingPlan(input) {
  if (!input || typeof input !== 'object') throw new ValidationError('input required');
  const medications = Array.isArray(input.medications) ? input.medications : [];
  const life_expectancy_years = ensureNumber(input.life_expectancy_years || 5, 'life_expectancy_years');
  const target_symptom = ensureEnum(input.target_symptom || 'none', ['none','hypertension','diabetes','hyperlipidemia','pain','insomnia','depression','anxiety'], 'target_symptom');
  const candidates = [];
  for (const m of medications) {
    const cls = (m && m.class) || 'unknown';
    if (life_expectancy_years < 5 && (cls === 'statin' || cls === 'bisphosphonate')) {
      candidates.push({ medication: (m && m.name) || '', class: cls, rationale: 'limited_life_expectancy_review_benefit' });
    }
  }
  let target_plan = 'continue_monitoring';
  if (target_symptom === 'hypertension') target_plan = 'review_targets_consider_less_intensive_control';
  else if (target_symptom === 'diabetes') target_plan = 'individualize_a1c_target_relax_for_frail_elderly';
  else if (target_symptom === 'hyperlipidemia') target_plan = 'consider_statin_deprescribing_if_life_expectancy_low';
  return { life_expectancy_years, target_symptom, candidates_count: candidates.length, candidates, target_plan, citations: CITATIONS };
}

module.exports = { beersCriteriaCheck, deprescribingPlan, CITATIONS, ValidationError };