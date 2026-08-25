'use strict';
// TIER4_INT-103 Dyslipidemia
const CITATIONS = ['ACC_AHA_2018_Cholesterol','USPSTF_Statin'];
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

function ascvdRisk(input) {
  if (!input || typeof input !== 'object') throw new ValidationError('input required');
  const age = ensureNumber(input.age, 'age');
  const sex = ensureEnum(input.sex, ['male','female'], 'sex');
  const smoker = !!input.smoker;
  const diabetes = !!input.diabetes;
  const sbp = ensureNumber(input.sbp, 'sbp');
  const total_chol = ensureNumber(input.total_chol || 200, 'total_chol');
  const hdl = ensureNumber(input.hdl || 50, 'hdl');
  let score = 0;
  if (age >= 60) score += 3;
  else if (age >= 50) score += 2;
  else if (age >= 40) score += 1;
  if (sex === 'male') score += 1;
  if (smoker) score += 2;
  if (diabetes) score += 2;
  if (sbp >= 140) score += 1;
  if (total_chol >= 240) score += 2;
  if (hdl < 40) score += 1;
  let risk_category = 'low';
  let risk_pct = 5;
  if (score >= 8) { risk_category = 'high'; risk_pct = 20; }
  else if (score >= 5) { risk_category = 'intermediate'; risk_pct = 10; }
  return { age, sex, smoker, diabetes, sbp, total_chol, hdl, score, risk_category, risk_pct, citations: CITATIONS };
}

function statinTherapy(input) {
  if (!input || typeof input !== 'object') throw new ValidationError('input required');
  const ascvd_history = !!input.ascvd_history;
  const ldl = ensureNumber(input.ldl, 'ldl');
  const risk_category = ensureEnum(input.risk_category || 'low', ['low','intermediate','high'], 'risk_category');
  let recommendation = 'lifestyle_diet_exercise_no_statin';
  if (ascvd_history) recommendation = 'high_intensity_statin_atorvastatin_40_to_80_with_goal_ldl_less_than_70';
  else if (risk_category === 'high' || ldl >= 190) recommendation = 'high_intensity_statin';
  else if (risk_category === 'intermediate') recommendation = 'moderate_to_high_intensity_statin_with_risk_enhancers';
  return { ascvd_history, ldl, risk_category, recommendation, citations: CITATIONS };
}

module.exports = { ascvdRisk, statinTherapy, CITATIONS, ValidationError };