'use strict';
// TIER4_SURG-106 Bariatric Surgery
const CITATIONS = ['ASMBS_2022_Guidelines','NICE_Obesity'];
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

function bariatricEligibility(input) {
  if (!input || typeof input !== 'object') throw new ValidationError('input required');
  const bmi = ensureNumber(input.bmi, 'bmi');
  const age = ensureNumber(input.age, 'age');
  const comorbidity = !!input.comorbidity;
  let eligible = false;
  if (bmi >= 40) eligible = true;
  else if (bmi >= 35 && comorbidity) eligible = true;
  return { bmi, age, comorbidity, eligible, citations: CITATIONS };
}

function bariatricProcedureChoice(input) {
  if (!input || typeof input !== 'object') throw new ValidationError('input required');
  const bmi = ensureNumber(input.bmi, 'bmi');
  const t2dm = !!input.t2dm;
  const gerd = !!input.gerd;
  let procedure = 'sleeve_gastrectomy';
  if (bmi >= 50) procedure = 'roux_en_y_gastric_bypass';
  if (gerd) procedure = 'roux_en_y_gastric_bypass_better_gerd_outcomes';
  if (t2dm) procedure = 'roux_en_y_or_sleeve_with_aggressive_diabetes_follow_up';
  return { bmi, t2dm, gerd, procedure, citations: CITATIONS };
}

module.exports = { bariatricEligibility, bariatricProcedureChoice, CITATIONS, ValidationError };