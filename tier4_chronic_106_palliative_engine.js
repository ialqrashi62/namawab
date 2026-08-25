'use strict';
class ValidationError extends Error { constructor(m){super(m);this.name='ValidationError';} }
const CITATIONS = { aahpm: 'AAHPM Chronic Care 2019' };
function ensureNumber(v, name) { if (typeof v !== 'number' || isNaN(v)) throw new ValidationError(name+' must be number'); return v; }
function ensureEnum(v, opts, name) { if (!opts.includes(v)) throw new ValidationError(name+' must be one of '+opts.join(',')); return v; }
function ensureObj(v, name) { if (!v || typeof v !== 'object') throw new ValidationError(name+' required'); return v; }

function goalsOfCare(input) {
  ensureObj(input, 'input');
  const prognosis = ensureEnum(input.prognosis, ['cure','chronic','palliative','end_of_life'], 'prognosis');
  const functional_status = ensureEnum(input.functional_status, ['independent','limited','moderate_disability','severe_disability'], 'functional_status');
  const patient_goals = ensureEnum(input.patient_goals, ['cure','life_prolonging','functional','comfort','other'], 'patient_goals');
  let plan;
  if (prognosis === 'cure') { plan = 'aggressive_curative'; }
  else if (prognosis === 'chronic' && patient_goals === 'cure') { plan = 'chronic_disease_management_with_prevention'; }
  else if (prognosis === 'chronic' && patient_goals === 'functional') { plan = 'chronic_disease_management_with_rehab'; }
  else if (prognosis === 'palliative' || patient_goals === 'comfort') { plan = 'palliative_care_comfort'; }
  else { plan = 'end_of_life_care'; }
  return { prognosis, functional_status, patient_goals, plan, citations:['aahpm'] };
}

function symptomBurden(input) {
  ensureObj(input, 'input');
  const pain = ensureNumber(input.pain, 'pain');
  const dyspnea = ensureNumber(input.dyspnea, 'dyspnea');
  const nausea = ensureNumber(input.nausea, 'nausea');
  const fatigue = ensureNumber(input.fatigue, 'fatigue');
  const depression = ensureNumber(input.depression, 'depression');
  const anxiety = ensureNumber(input.anxiety, 'anxiety');
  const total = pain + dyspnea + nausea + fatigue + depression + anxiety;
  let severity;
  if (total >= 30) { severity = 'severe_multi_team'; }
  else if (total >= 18) { severity = 'moderate_complex'; }
  else if (total >= 6) { severity = 'mild_symptom_mgmt'; }
  else { severity = 'minimal'; }
  return { pain, dyspnea, nausea, fatigue, depression, anxiety, total, severity };
}

module.exports = { goalsOfCare, symptomBurden, CITATIONS, ValidationError };
