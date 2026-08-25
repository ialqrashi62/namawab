'use strict';
class ValidationError extends Error { constructor(m){super(m);this.name='ValidationError';} }
const CITATIONS = { ada_caries: 'ADA Caries Risk Assessment 2018' };
function ensureNumber(v, name) { if (typeof v !== 'number' || isNaN(v)) throw new ValidationError(name+' must be number'); return v; }
function ensureEnum(v, opts, name) { if (!opts.includes(v)) throw new ValidationError(name+' must be one of '+opts.join(',')); return v; }
function ensureObj(v, name) { if (!v || typeof v !== 'object') throw new ValidationError(name+' required'); return v; }

function cariesRisk(input) {
  ensureObj(input, 'input');
  const past_caries = ensureNumber(input.past_caries, 'past_caries');
  const dmft = ensureNumber(input.dmft, 'dmft');
  const sugar_intake = ensureEnum(input.sugar_intake, ['low','moderate','high','very_high'], 'sugar_intake');
  const fluoride = !!input.fluoride;
  const saliva_flow = ensureEnum(input.saliva_flow, ['normal','low','xerostomia'], 'saliva_flow');
  const age = ensureNumber(input.age, 'age');
  const dmft_score = dmft / Math.max(age - 6, 1);
  let risk;
  if (past_caries >= 3 || dmft_score >= 1) { risk = 'high_risk'; }
  else if (sugar_intake === 'very_high' || saliva_flow === 'xerostomia') { risk = 'high_risk'; }
  else if (past_caries >= 1 || sugar_intake === 'high') { risk = 'moderate_risk'; }
  else if (sugar_intake === 'moderate' || !fluoride) { risk = 'low_moderate'; }
  else { risk = 'low_risk'; }
  const rec_intervals = risk === 'high_risk' ? '2_4_month_recall' : risk === 'moderate_risk' ? '6_month_recall' : '12_month_recall';
  return { past_caries, dmft, dmft_score: Math.round(dmft_score*100)/100, sugar_intake, fluoride, saliva_flow, age, risk, rec_intervals, citations:['ada_caries'] };
}

function pulpStatus(input) {
  ensureObj(input, 'input');
  const pain = ensureEnum(input.pain, ['none','cold_sensitivity','spontaneous','lingering','severe','relieved_by_analgesics'], 'pain');
  const test_cold = ensureEnum(input.test_cold, ['normal','heightened','prolonged','no_response'], 'test_cold');
  const radiolucency = !!input.radiolucency;
  const mobility = ensureEnum(input.mobility, ['none','grade_1','grade_2','grade_3'], 'mobility');
  let diagnosis;
  if (pain === 'no_response' && test_cold === 'no_response') { diagnosis = 'necrotic_pulp'; }
  else if (pain === 'lingering' || pain === 'spontaneous') { diagnosis = 'irreversible_pulpitis'; }
  else if (pain === 'cold_sensitivity' && test_cold === 'prolonged') { diagnosis = 'reversible_pulpitis'; }
  else if (test_cold === 'normal') { diagnosis = 'normal_pulp'; }
  else { diagnosis = 'unclear_further_test'; }
  const therapy = diagnosis === 'necrotic_pulp' ? 'root_canal_or_extraction' : diagnosis === 'irreversible_pulpitis' ? 'root_canal_extraction' : diagnosis === 'reversible_pulpitis' ? 'caries_removal_protective_restoration' : 'no_treatment';
  return { pain, test_cold, radiolucency, mobility, diagnosis, therapy };
}

module.exports = { cariesRisk, pulpStatus, CITATIONS, ValidationError };
