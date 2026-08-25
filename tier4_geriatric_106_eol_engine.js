'use strict';
// TIER4_GERIATRICS-106 End-of-Life Care
const CITATIONS = ['AGS_End_of_Life','POLST_2019'];
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

function goalsOfCareDiscussion(input) {
  if (!input || typeof input !== 'object') throw new ValidationError('input required');
  const age = ensureNumber(input.age, 'age');
  const life_limiting_illness = !!input.life_limiting_illness;
  const functional_decline = !!input.functional_decline;
  const advance_directive_present = !!input.advance_directive_present;
  const code_status_desired = ensureEnum(input.code_status_desired || 'full', ['full','dnr','dnr_dni','and'], 'code_status_desired');
  const discuss_now = life_limiting_illness || functional_decline || age >= 80 || !advance_directive_present;
  const elements = [
    'understanding_of_illness',
    'values_and_preferences',
    'treatment_goals_curative_vs_comfort',
    'code_status_and_ad',
    'surrogate_decision_maker'
  ];
  return { age, life_limiting_illness, functional_decline, advance_directive_present, code_status_desired, discuss_now, discussion_elements: elements, citations: CITATIONS };
}

function hospiceEligibility(input) {
  if (!input || typeof input !== 'object') throw new ValidationError('input required');
  const age = ensureNumber(input.age, 'age');
  const diagnosis_terminal = ensureEnum(input.diagnosis_terminal || 'cancer', ['cancer','heart_failure','copd','dementia','liver_failure','renal_failure','als','hiv'], 'diagnosis_terminal');
  const functional_status = ensureEnum(input.functional_status || 'palliative_performance_50', ['palliative_performance_50','palliative_performance_40','palliative_performance_30','palliative_performance_20','palliative_performance_10'], 'functional_status');
  const weight_loss = !!input.weight_loss;
  const hospitalizations_6mo = ensureNumber(input.hospitalizations_6mo || 0, 'hospitalizations_6mo');
  let eligible = false;
  let criteria_met = [];
  if (functional_status === 'palliative_performance_50' || functional_status === 'palliative_performance_40') {
    eligible = true; criteria_met.push('functional_decline');
  }
  if (weight_loss) { eligible = true; criteria_met.push('weight_loss'); }
  if (hospitalizations_6mo >= 2) { eligible = true; criteria_met.push('recurrent_hospitalizations'); }
  return { age, diagnosis_terminal, functional_status, weight_loss, hospitalizations_6mo, eligible, criteria_met, citations: CITATIONS };
}

module.exports = { goalsOfCareDiscussion, hospiceEligibility, CITATIONS, ValidationError };